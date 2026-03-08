#!/usr/bin/env python3
"""
CodeAssist Session Database Manager

SQLite-backed session storage with metadata extraction, importance scoring,
and active consolidation. Inspired by Google's always-on-memory-agent pattern.

Usage:
    python session-db.py save <name> [--branch X] [--dir X] [--task X] [--progress X]
                          [--pending X] [--decisions X] [--files X] [--notes X]
                          [--entities X] [--topics X] [--importance X]
    python session-db.py resume <name>
    python session-db.py list [--filter X] [--archived] [--json]
    python session-db.py get <name> [--json]
    python session-db.py archive <name>
    python session-db.py delete <name>
    python session-db.py consolidate [--dry-run]
    python session-db.py connections <name>
    python session-db.py search <query> [--limit N]
    python session-db.py migrate [--from-dir X]
    python session-db.py stats
    python session-db.py init
"""

import argparse
import json
import os
import re
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path


def get_db_path():
    """Find the .claude/sessions directory, create if needed."""
    # Walk up from CWD looking for .claude/
    cwd = Path.cwd()
    for parent in [cwd, *cwd.parents]:
        claude_dir = parent / ".claude"
        if claude_dir.is_dir():
            sessions_dir = claude_dir / "sessions"
            sessions_dir.mkdir(exist_ok=True)
            return sessions_dir / "sessions.db"
    # Fallback: create in CWD
    sessions_dir = cwd / ".claude" / "sessions"
    sessions_dir.mkdir(parents=True, exist_ok=True)
    return sessions_dir / "sessions.db"


def get_connection():
    """Get a database connection with WAL mode for concurrent access."""
    db_path = get_db_path()
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db(conn):
    """Create tables if they don't exist."""
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            branch TEXT,
            directory TEXT,
            task TEXT,
            progress TEXT,
            pending TEXT,
            decisions TEXT,
            files_modified TEXT,
            notes TEXT,
            entities TEXT DEFAULT '[]',
            topics TEXT DEFAULT '[]',
            importance REAL DEFAULT 0.5,
            consolidated INTEGER DEFAULT 0,
            archived INTEGER DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS consolidations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_session_ids TEXT NOT NULL,
            summary TEXT NOT NULL,
            insight TEXT,
            connections TEXT DEFAULT '[]',
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS session_connections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            from_session_id INTEGER NOT NULL,
            to_session_id INTEGER NOT NULL,
            relationship TEXT NOT NULL,
            strength REAL DEFAULT 0.5,
            created_at TEXT NOT NULL,
            FOREIGN KEY (from_session_id) REFERENCES sessions(id) ON DELETE CASCADE,
            FOREIGN KEY (to_session_id) REFERENCES sessions(id) ON DELETE CASCADE,
            UNIQUE(from_session_id, to_session_id, relationship)
        );

        CREATE INDEX IF NOT EXISTS idx_sessions_name ON sessions(name);
        CREATE INDEX IF NOT EXISTS idx_sessions_branch ON sessions(branch);
        CREATE INDEX IF NOT EXISTS idx_sessions_archived ON sessions(archived);
        CREATE INDEX IF NOT EXISTS idx_sessions_consolidated ON sessions(consolidated);
        CREATE INDEX IF NOT EXISTS idx_sessions_importance ON sessions(importance DESC);
        CREATE INDEX IF NOT EXISTS idx_sessions_created ON sessions(created_at DESC);
    """)
    conn.commit()


def now_iso():
    return datetime.now(timezone.utc).isoformat()


# --- SAVE ---

def cmd_save(conn, args):
    """Save a session to the database."""
    name = args.name
    now = now_iso()

    # Parse entities and topics as JSON arrays
    entities = args.entities or "[]"
    topics = args.topics or "[]"
    if not entities.startswith("["):
        entities = json.dumps([e.strip() for e in entities.split(",")])
    if not topics.startswith("["):
        topics = json.dumps([t.strip() for t in topics.split(",")])

    importance = float(args.importance) if args.importance else 0.5

    try:
        conn.execute("""
            INSERT INTO sessions (name, branch, directory, task, progress, pending,
                                  decisions, files_modified, notes, entities, topics,
                                  importance, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (name, args.branch, args.dir, args.task, args.progress, args.pending,
              args.decisions, args.files, args.notes, entities, topics,
              importance, now, now))
        conn.commit()
        session_id = conn.execute("SELECT id FROM sessions WHERE name = ?", (name,)).fetchone()["id"]

        # Auto-detect connections to existing sessions
        _auto_connect(conn, session_id)

        print(json.dumps({
            "status": "saved",
            "id": session_id,
            "name": name,
            "db": str(get_db_path()),
            "created_at": now
        }))
    except sqlite3.IntegrityError:
        # Update existing session
        conn.execute("""
            UPDATE sessions SET branch=?, directory=?, task=?, progress=?, pending=?,
                               decisions=?, files_modified=?, notes=?, entities=?, topics=?,
                               importance=?, updated_at=?, archived=0
            WHERE name=?
        """, (args.branch, args.dir, args.task, args.progress, args.pending,
              args.decisions, args.files, args.notes, entities, topics,
              importance, now, name))
        conn.commit()
        session_id = conn.execute("SELECT id FROM sessions WHERE name = ?", (name,)).fetchone()["id"]
        _auto_connect(conn, session_id)
        print(json.dumps({
            "status": "updated",
            "id": session_id,
            "name": name,
            "updated_at": now
        }))


def _auto_connect(conn, session_id):
    """Find and create connections to related sessions based on shared entities/files."""
    session = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
    if not session:
        return

    entities = set(json.loads(session["entities"] or "[]"))
    files = set(f.strip() for f in (session["files_modified"] or "").split("\n") if f.strip())
    branch = session["branch"] or ""

    others = conn.execute(
        "SELECT * FROM sessions WHERE id != ? AND archived = 0", (session_id,)
    ).fetchall()

    for other in others:
        other_entities = set(json.loads(other["entities"] or "[]"))
        other_files = set(f.strip() for f in (other["files_modified"] or "").split("\n") if f.strip())
        other_branch = other["branch"] or ""

        # Shared entities
        shared_entities = entities & other_entities
        if shared_entities:
            _upsert_connection(conn, session_id, other["id"],
                               f"shared_entities:{','.join(list(shared_entities)[:5])}",
                               min(1.0, len(shared_entities) * 0.2))

        # Shared files
        shared_files = files & other_files
        if shared_files:
            _upsert_connection(conn, session_id, other["id"],
                               f"shared_files:{','.join(list(shared_files)[:5])}",
                               min(1.0, len(shared_files) * 0.15))

        # Same branch
        if branch and branch == other_branch:
            _upsert_connection(conn, session_id, other["id"],
                               "same_branch", 0.3)


def _upsert_connection(conn, from_id, to_id, relationship, strength):
    """Insert or update a connection."""
    try:
        conn.execute("""
            INSERT INTO session_connections (from_session_id, to_session_id, relationship, strength, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (from_id, to_id, relationship, strength, now_iso()))
    except sqlite3.IntegrityError:
        conn.execute("""
            UPDATE session_connections SET strength = MAX(strength, ?) WHERE
            from_session_id = ? AND to_session_id = ? AND relationship = ?
        """, (strength, from_id, to_id, relationship))
    conn.commit()


# --- RESUME ---

def cmd_resume(conn, args):
    """Get session data for resuming."""
    session = conn.execute(
        "SELECT * FROM sessions WHERE name = ? AND archived = 0", (args.name,)
    ).fetchone()

    if not session:
        # Try partial match
        sessions = conn.execute(
            "SELECT * FROM sessions WHERE name LIKE ? AND archived = 0",
            (f"%{args.name}%",)
        ).fetchall()
        if sessions:
            print(json.dumps({
                "status": "not_found",
                "suggestions": [dict(s) for s in sessions]
            }))
        else:
            print(json.dumps({"status": "not_found", "suggestions": []}))
        return

    # Get connections
    connections = conn.execute("""
        SELECT sc.*, s.name as connected_name, s.task as connected_task
        FROM session_connections sc
        JOIN sessions s ON (
            CASE WHEN sc.from_session_id = ? THEN sc.to_session_id ELSE sc.from_session_id END
        ) = s.id
        WHERE sc.from_session_id = ? OR sc.to_session_id = ?
        ORDER BY sc.strength DESC
        LIMIT 5
    """, (session["id"], session["id"], session["id"])).fetchall()

    # Get relevant consolidations
    consolidations = conn.execute("""
        SELECT * FROM consolidations
        WHERE source_session_ids LIKE ?
        ORDER BY created_at DESC LIMIT 3
    """, (f"%{session['id']}%",)).fetchall()

    result = dict(session)
    result["connections"] = [dict(c) for c in connections]
    result["consolidations"] = [dict(c) for c in consolidations]
    result["status"] = "found"
    print(json.dumps(result))


# --- LIST ---

def cmd_list(conn, args):
    """List sessions."""
    query = "SELECT * FROM sessions WHERE archived = ?"
    params = [1 if args.archived else 0]

    if args.filter:
        query += " AND (name LIKE ? OR task LIKE ? OR branch LIKE ? OR topics LIKE ?)"
        f = f"%{args.filter}%"
        params.extend([f, f, f, f])

    query += " ORDER BY created_at DESC"
    sessions = conn.execute(query, params).fetchall()

    if args.json:
        print(json.dumps([dict(s) for s in sessions]))
    else:
        if not sessions:
            print("No sessions found.")
            return
        print(f"\n{'Name':<30} {'Branch':<25} {'Importance':<12} {'Task':<40} {'Saved':<20}")
        print("-" * 127)
        for s in sessions:
            name = (s["name"] or "")[:29]
            branch = (s["branch"] or "")[:24]
            importance = f"{s['importance']:.1f}"
            task = (s["task"] or "")[:39]
            created = (s["created_at"] or "")[:19]
            print(f"{name:<30} {branch:<25} {importance:<12} {task:<40} {created:<20}")
        print(f"\nTotal: {len(sessions)} session(s)")


# --- GET ---

def cmd_get(conn, args):
    """Get a single session by name."""
    session = conn.execute("SELECT * FROM sessions WHERE name = ?", (args.name,)).fetchone()
    if session:
        result = dict(session)
        result["status"] = "found"
        print(json.dumps(result))
    else:
        print(json.dumps({"status": "not_found"}))


# --- ARCHIVE ---

def cmd_archive(conn, args):
    """Archive a session."""
    result = conn.execute(
        "UPDATE sessions SET archived = 1, updated_at = ? WHERE name = ?",
        (now_iso(), args.name)
    )
    conn.commit()
    if result.rowcount:
        print(json.dumps({"status": "archived", "name": args.name}))
    else:
        print(json.dumps({"status": "not_found", "name": args.name}))


# --- DELETE ---

def cmd_delete(conn, args):
    """Delete a session permanently."""
    result = conn.execute("DELETE FROM sessions WHERE name = ?", (args.name,))
    conn.commit()
    if result.rowcount:
        print(json.dumps({"status": "deleted", "name": args.name}))
    else:
        print(json.dumps({"status": "not_found", "name": args.name}))


# --- CONSOLIDATE ---

def cmd_consolidate(conn, args):
    """Find unconsolidated sessions and output them for LLM consolidation."""
    sessions = conn.execute(
        "SELECT * FROM sessions WHERE consolidated = 0 AND archived = 0 ORDER BY created_at DESC"
    ).fetchall()

    if len(sessions) < 2:
        print(json.dumps({
            "status": "skip",
            "reason": f"Need at least 2 unconsolidated sessions, found {len(sessions)}"
        }))
        return

    session_data = [dict(s) for s in sessions]

    if args.dry_run:
        print(json.dumps({
            "status": "dry_run",
            "session_count": len(sessions),
            "sessions": [{"id": s["id"], "name": s["name"], "task": s["task"]} for s in session_data]
        }))
        return

    # Output sessions for Claude to consolidate
    print(json.dumps({
        "status": "ready",
        "session_count": len(sessions),
        "sessions": session_data
    }))


def cmd_consolidate_save(conn, args):
    """Save a consolidation result."""
    source_ids = args.source_ids  # JSON array of session IDs
    summary = args.summary
    insight = args.insight
    connections = args.connections or "[]"

    conn.execute("""
        INSERT INTO consolidations (source_session_ids, summary, insight, connections, created_at)
        VALUES (?, ?, ?, ?, ?)
    """, (source_ids, summary, insight, connections, now_iso()))

    # Mark source sessions as consolidated
    ids = json.loads(source_ids)
    for sid in ids:
        conn.execute(
            "UPDATE sessions SET consolidated = 1, updated_at = ? WHERE id = ?",
            (now_iso(), sid)
        )
    conn.commit()

    print(json.dumps({
        "status": "consolidated",
        "sessions_consolidated": len(ids),
        "consolidation_id": conn.execute("SELECT last_insert_rowid()").fetchone()[0]
    }))


# --- CONNECTIONS ---

def cmd_connections(conn, args):
    """Show connections for a session."""
    session = conn.execute("SELECT id FROM sessions WHERE name = ?", (args.name,)).fetchone()
    if not session:
        print(json.dumps({"status": "not_found"}))
        return

    sid = session["id"]
    connections = conn.execute("""
        SELECT sc.*,
               s1.name as from_name, s1.task as from_task,
               s2.name as to_name, s2.task as to_task
        FROM session_connections sc
        JOIN sessions s1 ON sc.from_session_id = s1.id
        JOIN sessions s2 ON sc.to_session_id = s2.id
        WHERE sc.from_session_id = ? OR sc.to_session_id = ?
        ORDER BY sc.strength DESC
    """, (sid, sid)).fetchall()

    print(json.dumps({
        "status": "found",
        "session": args.name,
        "connections": [dict(c) for c in connections]
    }))


# --- SEARCH ---

def cmd_search(conn, args):
    """Full-text search across sessions."""
    q = f"%{args.query}%"
    limit = args.limit or 10

    sessions = conn.execute("""
        SELECT *,
            CASE
                WHEN task LIKE ? THEN importance + 0.3
                WHEN notes LIKE ? THEN importance + 0.2
                WHEN files_modified LIKE ? THEN importance + 0.1
                ELSE importance
            END as relevance
        FROM sessions
        WHERE (name LIKE ? OR task LIKE ? OR progress LIKE ? OR pending LIKE ?
               OR decisions LIKE ? OR files_modified LIKE ? OR notes LIKE ?
               OR entities LIKE ? OR topics LIKE ?)
        AND archived = 0
        ORDER BY relevance DESC, created_at DESC
        LIMIT ?
    """, (q, q, q, q, q, q, q, q, q, q, q, q, limit)).fetchall()

    print(json.dumps({
        "status": "found",
        "count": len(sessions),
        "results": [dict(s) for s in sessions]
    }))


# --- MIGRATE ---

def cmd_migrate(conn, args):
    """Migrate markdown session files to SQLite."""
    sessions_dir = Path(args.from_dir) if args.from_dir else get_db_path().parent
    migrated = 0
    skipped = 0

    for md_file in sessions_dir.glob("*.md"):
        if md_file.name in ("index.md", "README.md"):
            continue

        name = md_file.stem
        if name.endswith(".active"):
            name = name.replace(".active", "")

        # Check if already exists
        existing = conn.execute("SELECT id FROM sessions WHERE name = ?", (name,)).fetchone()
        if existing:
            skipped += 1
            continue

        content = md_file.read_text(encoding="utf-8", errors="replace")

        # Parse markdown structure
        branch = _extract_field(content, r"Branch:\s*(.+)")
        directory = _extract_field(content, r"Directory:\s*(.+)")
        task = _extract_section(content, "Current Task")
        progress = _extract_section(content, "Recent Progress")
        pending = _extract_section(content, "Pending Work")
        decisions = _extract_section(content, "Key Decisions")
        files_modified = _extract_section(content, "Files Modified")
        notes = _extract_section(content, "Notes")
        saved_time = _extract_field(content, r"Saved:\s*(.+)")

        created_at = saved_time or md_file.stat().st_mtime
        if isinstance(created_at, float):
            created_at = datetime.fromtimestamp(created_at, tz=timezone.utc).isoformat()

        conn.execute("""
            INSERT INTO sessions (name, branch, directory, task, progress, pending,
                                  decisions, files_modified, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (name, branch, directory, task, progress, pending,
              decisions, files_modified, notes, created_at, now_iso()))
        migrated += 1

    conn.commit()

    # Also check for legacy session-context.md
    legacy = sessions_dir.parent / "session-context.md"
    if legacy.exists():
        content = legacy.read_text(encoding="utf-8", errors="replace")
        existing = conn.execute("SELECT id FROM sessions WHERE name = 'legacy-session'").fetchone()
        if not existing:
            task = _extract_section(content, "Current Task")
            conn.execute("""
                INSERT INTO sessions (name, task, notes, created_at, updated_at)
                VALUES ('legacy-session', ?, ?, ?, ?)
            """, (task, content, now_iso(), now_iso()))
            conn.commit()
            migrated += 1

    print(json.dumps({
        "status": "migrated",
        "migrated": migrated,
        "skipped": skipped,
        "db": str(get_db_path())
    }))


def _extract_field(content, pattern):
    """Extract a single-line field from markdown."""
    match = re.search(pattern, content)
    return match.group(1).strip() if match else None


def _extract_section(content, header):
    """Extract content under a markdown ## header."""
    pattern = rf"##\s+{re.escape(header)}\s*\n(.*?)(?=\n##\s|\Z)"
    match = re.search(pattern, content, re.DOTALL)
    return match.group(1).strip() if match else None


# --- STATS ---

def cmd_stats(conn, args):
    """Show database statistics."""
    total = conn.execute("SELECT COUNT(*) as c FROM sessions").fetchone()["c"]
    active = conn.execute("SELECT COUNT(*) as c FROM sessions WHERE archived = 0").fetchone()["c"]
    archived = conn.execute("SELECT COUNT(*) as c FROM sessions WHERE archived = 1").fetchone()["c"]
    consolidated = conn.execute("SELECT COUNT(*) as c FROM sessions WHERE consolidated = 1").fetchone()["c"]
    unconsolidated = conn.execute("SELECT COUNT(*) as c FROM sessions WHERE consolidated = 0 AND archived = 0").fetchone()["c"]
    consolidations = conn.execute("SELECT COUNT(*) as c FROM consolidations").fetchone()["c"]
    connections = conn.execute("SELECT COUNT(*) as c FROM session_connections").fetchone()["c"]

    avg_importance = conn.execute(
        "SELECT AVG(importance) as a FROM sessions WHERE archived = 0"
    ).fetchone()["a"] or 0

    top_topics = conn.execute("""
        SELECT topics FROM sessions WHERE archived = 0 AND topics != '[]'
        ORDER BY created_at DESC LIMIT 20
    """).fetchall()

    # Aggregate topics
    topic_counts = {}
    for row in top_topics:
        for t in json.loads(row["topics"] or "[]"):
            topic_counts[t] = topic_counts.get(t, 0) + 1

    top_5 = sorted(topic_counts.items(), key=lambda x: -x[1])[:5]

    db_size = get_db_path().stat().st_size if get_db_path().exists() else 0

    print(json.dumps({
        "total_sessions": total,
        "active": active,
        "archived": archived,
        "consolidated": consolidated,
        "unconsolidated": unconsolidated,
        "consolidations": consolidations,
        "connections": connections,
        "avg_importance": round(avg_importance, 2),
        "top_topics": top_5,
        "db_size_bytes": db_size,
        "db_path": str(get_db_path())
    }))


# --- INIT ---

def cmd_init(conn, args):
    """Initialize database (tables already created on connection)."""
    print(json.dumps({
        "status": "initialized",
        "db": str(get_db_path()),
        "tables": ["sessions", "consolidations", "session_connections"]
    }))


# --- MAIN ---

def main():
    parser = argparse.ArgumentParser(description="CodeAssist Session Database Manager")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    # save
    p_save = subparsers.add_parser("save", help="Save a session")
    p_save.add_argument("name", help="Session name")
    p_save.add_argument("--branch", help="Git branch")
    p_save.add_argument("--dir", help="Working directory")
    p_save.add_argument("--task", help="Current task description")
    p_save.add_argument("--progress", help="Completed items")
    p_save.add_argument("--pending", help="Remaining items")
    p_save.add_argument("--decisions", help="Key decisions")
    p_save.add_argument("--files", help="Files modified")
    p_save.add_argument("--notes", help="Additional notes")
    p_save.add_argument("--entities", help="Entities JSON array or comma-separated")
    p_save.add_argument("--topics", help="Topics JSON array or comma-separated")
    p_save.add_argument("--importance", help="Importance score 0.0-1.0")

    # resume
    p_resume = subparsers.add_parser("resume", help="Get session for resuming")
    p_resume.add_argument("name", help="Session name or partial match")

    # list
    p_list = subparsers.add_parser("list", help="List sessions")
    p_list.add_argument("--filter", help="Filter term")
    p_list.add_argument("--archived", action="store_true", help="Show archived")
    p_list.add_argument("--json", action="store_true", help="JSON output")

    # get
    p_get = subparsers.add_parser("get", help="Get a single session")
    p_get.add_argument("name", help="Session name")
    p_get.add_argument("--json", action="store_true", default=True)

    # archive
    p_archive = subparsers.add_parser("archive", help="Archive a session")
    p_archive.add_argument("name", help="Session name")

    # delete
    p_delete = subparsers.add_parser("delete", help="Delete a session")
    p_delete.add_argument("name", help="Session name")

    # consolidate
    p_consolidate = subparsers.add_parser("consolidate", help="Prepare consolidation")
    p_consolidate.add_argument("--dry-run", action="store_true")

    # consolidate-save
    p_consave = subparsers.add_parser("consolidate-save", help="Save consolidation result")
    p_consave.add_argument("--source-ids", required=True, help="JSON array of session IDs")
    p_consave.add_argument("--summary", required=True, help="Consolidation summary")
    p_consave.add_argument("--insight", help="Key insight")
    p_consave.add_argument("--connections", help="Connections JSON")

    # connections
    p_conn = subparsers.add_parser("connections", help="Show session connections")
    p_conn.add_argument("name", help="Session name")

    # search
    p_search = subparsers.add_parser("search", help="Search sessions")
    p_search.add_argument("query", help="Search query")
    p_search.add_argument("--limit", type=int, default=10)

    # migrate
    p_migrate = subparsers.add_parser("migrate", help="Migrate markdown sessions")
    p_migrate.add_argument("--from-dir", help="Directory with .md session files")

    # stats
    subparsers.add_parser("stats", help="Database statistics")

    # init
    subparsers.add_parser("init", help="Initialize database")

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        sys.exit(1)

    conn = get_connection()
    init_db(conn)

    commands = {
        "save": cmd_save,
        "resume": cmd_resume,
        "list": cmd_list,
        "get": cmd_get,
        "archive": cmd_archive,
        "delete": cmd_delete,
        "consolidate": cmd_consolidate,
        "consolidate-save": cmd_consolidate_save,
        "connections": cmd_connections,
        "search": cmd_search,
        "migrate": cmd_migrate,
        "stats": cmd_stats,
        "init": cmd_init,
    }

    try:
        commands[args.command](conn, args)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
