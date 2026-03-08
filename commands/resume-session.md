# Resume Session

Resume work from a saved session in the SQLite database.

## Usage

```
/resume-session [name]
```

**Examples:**
- `/resume-session` - Shows list of available sessions to choose from
- `/resume-session auth-feature` - Resumes the "auth-feature" session
- `/resume-session main-0111-1430` - Resumes a specific timestamped session

## Execute

### Step 1: Check Database

```bash
python3 scripts/session-db.py stats
```

If no sessions exist:
```
No saved sessions found.

To save your current session: /save-session [name]
```

### Step 2: Determine Which Session to Resume

Parse `$ARGUMENTS` for a session name.

**If name provided:**

```bash
python3 scripts/session-db.py resume "{name}"
```

The script returns JSON with the session data, connected sessions, and relevant consolidations. If not found, it returns suggestions based on partial name matching.

**If no name provided:**

```bash
python3 scripts/session-db.py list --json
```

Display the session list and ask the user to choose.

### Step 3: Load and Display Session Context

Parse the JSON returned by `resume` and display:

```
## Resuming Session: {name}

**Saved:** {created_at}
**Branch:** {branch}
**Importance:** {importance}/1.0

### Current Task
{task}

### Completed
{progress items}

### Pending Work
{pending items}

### Key Decisions
{decisions}

### Files Modified
{files_modified}

### Notes
{notes}
```

### Step 4: Show Connections

If the session has connections to other sessions, display them:

```
### Related Sessions
| Session | Relationship | Strength |
|---------|-------------|----------|
| {connected_name} | {relationship} | {strength} |
```

### Step 5: Show Consolidation Insights

If there are relevant consolidations:

```
### Insights from Consolidation
{consolidation summary and insight}
```

### Step 6: Verify Current State

```bash
current_branch=$(git branch --show-current 2>/dev/null)
git status --short
```

**If branch differs:**
```
Note: You're on branch '{current}' but session was saved on '{saved}'.
Would you like to switch branches?
```

### Step 7: Present Next Steps

```
Ready to continue?

Based on your saved context, you were working on:
{brief summary of current task}

Next steps appear to be:
1. {first pending item}
2. {second pending item}

Options:
1. Continue with these tasks
2. Review full context first
3. Archive this session and start fresh
```

**If archive chosen:**
```bash
python3 scripts/session-db.py archive "{name}"
```

### Step 8: Search (if name not found)

If the provided name doesn't match any session, search:

```bash
python3 scripts/session-db.py search "{name}" --limit 5
```

Display search results and let the user pick.

## Migration from Old Format

If markdown session files exist but database is empty:

```bash
python3 scripts/session-db.py migrate
```

Execute the session resume now.
