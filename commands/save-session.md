# Save Session

Save your current session context to the SQLite database for later resumption.

## Usage

```
/save-session [name]
```

**Examples:**
- `/save-session` - Auto-generates name from branch + timestamp
- `/save-session auth-feature` - Saves as "auth-feature"
- `/save-session bugfix-123` - Saves as "bugfix-123"

## Execute

### Step 1: Determine Session Name

Parse `$ARGUMENTS` for a session name.

**If name provided:** Use the provided name (sanitize: lowercase, replace spaces with dashes)

**If no name provided:** Generate from current branch + short timestamp:
```bash
branch=$(git branch --show-current 2>/dev/null || echo "main")
name="${branch}-$(date +%m%d-%H%M)"
echo "Session name: $name"
```

### Step 2: Gather Context

Collect information about the current session by reviewing your conversation context:

1. **Current task** — What is the user working on? (1-2 sentences)
2. **Progress** — What was accomplished? (bullet list)
3. **Pending** — What still needs to be done? (bullet list)
4. **Decisions** — What important decisions were made?
5. **Files modified** — What files were changed? (one per line)
6. **Entities** — Extract key identifiers: file paths, function names, issue numbers, component names, API endpoints
7. **Topics** — Categorize: what areas does this session cover? (e.g., auth, database, frontend, CI/CD, refactoring)
8. **Importance** — Rate 0.0-1.0 based on impact:
   - 0.1-0.3: Minor fixes, typos, formatting
   - 0.4-0.6: Standard features, bug fixes
   - 0.7-0.8: Architecture decisions, security changes
   - 0.9-1.0: Breaking changes, critical fixes, production incidents

### Step 3: Save to Database

```bash
python3 scripts/session-db.py save "{name}" \
  --branch "$(git branch --show-current 2>/dev/null || echo main)" \
  --dir "$(pwd)" \
  --task "{task summary}" \
  --progress "{progress items}" \
  --pending "{pending items}" \
  --decisions "{decisions}" \
  --files "{files modified, one per line}" \
  --notes "{additional context}" \
  --entities '{entities as JSON array}' \
  --topics '{topics as JSON array}' \
  --importance {score}
```

**Note:** The script auto-detects connections to related sessions based on shared entities, files, and branch names.

### Step 4: Confirm Save

Display the result from the script, then show:

```
## Session Saved

**Name:** {name}
**Database:** .claude/sessions/sessions.db
**Importance:** {score}/1.0

### Summary
- **Task:** {brief summary}
- **Progress:** {N} items completed
- **Pending:** {N} items remaining
- **Entities:** {count} tracked
- **Topics:** {topics list}
- **Connections:** {N} related sessions found

### Resume Later
  /resume-session {name}

### View All Sessions
  /session-list

### Consolidate Knowledge
  /consolidate
```

## Migration

If markdown session files exist in `.claude/sessions/` but haven't been migrated:

```bash
python3 scripts/session-db.py migrate
```

Execute the session save now.
