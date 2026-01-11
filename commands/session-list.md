# Session List

List all saved sessions for the current project.

## Usage

```
/session-list [filter]
```

**Examples:**
- `/session-list` - Show all sessions
- `/session-list auth` - Filter sessions containing "auth"
- `/session-list --archived` - Show archived sessions

## Execute

### Step 1: Check for Sessions

```bash
if [ -d .claude/sessions ]; then
    session_count=$(ls -1 .claude/sessions/*.md 2>/dev/null | grep -v index.md | wc -l)
    echo "Found $session_count sessions"
else
    echo "No sessions directory"
fi
```

If no sessions exist:
```
No saved sessions found.

To save your current session:
  /save-session [name]

Examples:
  /save-session             # Auto-name from branch
  /save-session auth-work   # Custom name
```

### Step 2: Parse Session Files

For each `.md` file in `.claude/sessions/` (excluding index.md):

1. Extract session name from filename
2. Read first few lines to get:
   - Saved timestamp
   - Branch name
   - Current task (first line of "## Current Task" section)

### Step 3: Display Sessions

```
## Saved Sessions

| Name | Saved | Branch | Task |
|------|-------|--------|------|
| auth-feature | 2025-01-11 14:30 | feature/auth | Implementing OAuth login |
| main-0110-0930 | 2025-01-10 09:30 | main | Bug fixes for release |
| api-refactor | 2025-01-09 16:45 | refactor/api | Cleaning up API endpoints |

**Total:** 3 sessions

### Quick Actions

Resume a session:
  /resume-session <name>

Delete a session:
  rm .claude/sessions/<name>.md

Archive all old sessions:
  /session-cleanup
```

### Step 4: Show Archived Sessions (if requested)

If `--archived` flag or filter includes "archived":

```bash
ls -la .claude/sessions/archive/*.md 2>/dev/null
```

```
## Archived Sessions

| Name | Archived | Original Date |
|------|----------|---------------|
| old-feature.20250108-143022 | 2025-01-08 | 2025-01-07 |

To restore: mv .claude/sessions/archive/<name>.md .claude/sessions/
```

### Step 5: Filter Results (if filter provided)

If `$ARGUMENTS` contains a filter term (not a flag):
- Only show sessions where name, branch, or task contains the filter
- Case-insensitive matching

```
## Sessions matching "auth"

| Name | Saved | Branch | Task |
|------|-------|--------|------|
| auth-feature | 2025-01-11 14:30 | feature/auth | Implementing OAuth login |

Found 1 session matching "auth"
```

## Output Format

```
## Saved Sessions (3)

| Name | Saved | Branch | Task |
|------|-------|--------|------|
| auth-feature | Jan 11, 14:30 | feature/auth | OAuth login |
| main-0110-0930 | Jan 10, 09:30 | main | Bug fixes |
| api-refactor | Jan 09, 16:45 | refactor/api | API cleanup |

Commands:
  /resume-session <name>  - Resume a session
  /save-session [name]    - Save current session
```

Execute the session list now.
