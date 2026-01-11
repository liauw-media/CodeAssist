# Resume Session

Resume work from a saved session context.

## Usage

```
/resume-session [name]
```

**Examples:**
- `/resume-session` - Shows list of available sessions to choose from
- `/resume-session auth-feature` - Resumes the "auth-feature" session
- `/resume-session main-0111-1430` - Resumes a specific timestamped session

## Execute

### Step 1: Check for Sessions Directory

```bash
if [ -d .claude/sessions ]; then
    echo "Sessions directory found"
else
    echo "No sessions directory found"
fi
```

If no sessions directory exists:
```
No saved sessions found.

To save your current session:
  /save-session [name]

Example:
  /save-session auth-feature
```

### Step 2: Determine Which Session to Resume

Parse `$ARGUMENTS` for a session name.

**If name provided:**
- Look for `.claude/sessions/{name}.md`
- If not found, show error with suggestions

**If no name provided:**
- List available sessions and ask user to choose

```bash
# List available sessions
ls -la .claude/sessions/*.md 2>/dev/null | grep -v index.md
```

Display session picker:
```
## Available Sessions

| # | Name | Saved | Branch | Task |
|---|------|-------|--------|------|
| 1 | auth-feature | 2025-01-11 14:30 | feature/auth | Implementing login |
| 2 | main-0110-0930 | 2025-01-10 09:30 | main | Bug fixes |
| 3 | api-refactor | 2025-01-09 16:45 | refactor/api | API cleanup |

Enter session number or name to resume:
```

### Step 3: Load Session Context

Read the selected session file `.claude/sessions/{name}.md` and parse:
- Saved timestamp
- CodeAssist version
- Branch name
- Current task
- Progress items
- Pending items
- Key decisions
- Modified files
- Notes

### Step 4: Display Session Context

```
## Resuming Session: {name}

**Saved:** [timestamp]
**Branch:** [branch from file]
**Version:** [version from file]

### Current Task
[task from context]

### Recent Progress
[progress items from context]

### Pending Work
[pending items from context]

### Key Decisions
[decisions from context]

### Files Modified
[files from context]
```

### Step 5: Verify Current State

Check if the environment matches the saved session:

```bash
# Check current branch
current_branch=$(git branch --show-current)
# Check git status for mentioned files
git status --short
```

**If branch differs:**
```
Note: You're on branch '{current}' but session was saved on '{saved}'.
Would you like to switch branches? (y/n)
```

**If files changed:**
```
Note: Some files have changed since session was saved:
- [file] - [status]
```

### Step 6: Offer Options

```
Ready to continue?

Based on your saved context, you were working on:
[brief summary of current task]

Next steps appear to be:
1. [first pending item]
2. [second pending item]

Options:
1. Continue with these tasks
2. Review full context first
3. Archive this session and start fresh
```

### Step 7: Handle User Choice

**If continue:**
- Mark session as "active" (rename to `{name}.active.md`)
- Display next steps

**If archive:**
```bash
# Move to archive
mkdir -p .claude/sessions/archive
mv .claude/sessions/{name}.md .claude/sessions/archive/{name}.$(date +%Y%m%d-%H%M%S).md
```

### Step 8: Cleanup

After resuming, optionally archive the session file:
```
Session resumed.

The session file has been kept at .claude/sessions/{name}.md
You can delete it with: rm .claude/sessions/{name}.md
Or archive later with: /session-archive {name}
```

## Output Format

```
## Session Resumed: {name}

**From:** [timestamp]
**Branch:** [branch]

### You Were Working On
[current task from context]

### Completed
- [recent progress items]

### Next Steps
- [ ] [pending item 1]
- [ ] [pending item 2]

### Key Context
[important decisions or notes]

---

Ready to continue. What would you like to work on?
```

## Migration from Old Format

If `.claude/session-context.md` exists (old format), offer to migrate:

```
Found legacy session file at .claude/session-context.md

Would you like to:
1. Migrate to new format (recommended)
2. Resume from legacy file
3. Delete legacy file and start fresh
```

Execute the session resume now.
