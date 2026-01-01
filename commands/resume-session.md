# Resume Session

Resume work from a saved session context after a CodeAssist update or Claude restart.

## Execute

### Step 1: Check for Session Context

```bash
if [ -f .claude/session-context.md ]; then
    echo "Session context found"
    cat .claude/session-context.md
else
    echo "No session context found"
fi
```

If no context file exists:
```
No saved session context found.

This command is used after:
- Running /ca-update (which saves context before updating)
- Manually saving context with /save-session

To save your current session for later:
  /save-session
```

### Step 2: Load and Display Context

Read the session context file and display it:

```
## Resuming Session

**Saved:** [timestamp from file]
**Previous Version:** [version from file]

### Current Task
[task from context]

### Recent Progress
[progress from context]

### Pending Work
[pending items from context]

### Key Decisions
[decisions from context]

### Files Modified
[files from context]
```

### Step 3: Verify Current State

Check if files mentioned still exist and haven't changed unexpectedly:

```bash
# Check git status for mentioned files
git status --short
```

Report any discrepancies:
```
Note: Some files have changed since session was saved:
- [file] - [status]
```

### Step 4: Offer to Continue

```
Ready to continue?

Based on your saved context, you were working on:
[brief summary of current task]

Next steps appear to be:
1. [first pending item]
2. [second pending item]

Would you like to:
- Continue with these tasks
- Review the full context first
- Start fresh (archive this context)
```

### Step 5: Archive or Delete Context

After user confirms they're ready to continue:

```bash
# Archive the context (in case needed later)
mv .claude/session-context.md .claude/session-context.$(date +%Y%m%d-%H%M%S).md.bak

# Or just delete if user prefers
# rm .claude/session-context.md
```

Display:
```
Session resumed. Context archived to session-context.[timestamp].md.bak

Continuing with: [current task summary]
```

## Output Format

```
## Session Resumed

**From:** 2025-01-01 14:30:00
**CodeAssist:** 1.0.8 → 1.0.9

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

Execute the session resume now.
