# Session List

List all saved sessions from the SQLite database.

## Usage

```
/session-list [filter]
```

**Examples:**
- `/session-list` - Show all active sessions
- `/session-list auth` - Filter sessions containing "auth"
- `/session-list --archived` - Show archived sessions
- `/session-list --stats` - Show database statistics

## Execute

### Step 1: Parse Arguments

Parse `$ARGUMENTS`:
- If contains `--archived` → show archived sessions
- If contains `--stats` → show statistics
- Otherwise → use as filter term

### Step 2: Query Database

**Default (all active sessions):**
```bash
python3 scripts/session-db.py list --json
```

**With filter:**
```bash
python3 scripts/session-db.py list --filter "{term}" --json
```

**Archived:**
```bash
python3 scripts/session-db.py list --archived --json
```

**Statistics:**
```bash
python3 scripts/session-db.py stats
```

### Step 3: Display Results

Parse the JSON output and display as a formatted table:

```
## Saved Sessions ({count})

| Name | Branch | Importance | Task | Saved |
|------|--------|------------|------|-------|
| {name} | {branch} | {importance} | {task} | {date} |

### Quick Actions

Resume a session:
  /resume-session <name>

Search sessions:
  /session-list <keyword>

Consolidate knowledge:
  /consolidate

Save current session:
  /save-session [name]
```

### Step 4: Show Statistics (if --stats)

```
## Session Database Statistics

| Metric | Value |
|--------|-------|
| Total sessions | {total} |
| Active | {active} |
| Archived | {archived} |
| Consolidated | {consolidated} |
| Unconsolidated | {unconsolidated} |
| Consolidations | {count} |
| Connections | {count} |
| Avg importance | {avg} |
| Database size | {size} |

### Top Topics
1. {topic} ({count} sessions)
2. {topic} ({count} sessions)

### Actions
- `/consolidate` — Process {unconsolidated} unconsolidated sessions
- `/save-session` — Save current session
```

Execute the session list now.
