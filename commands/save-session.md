# Save Session

Save your current session context with an optional name for later resumption.

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
# Get branch name
branch=$(git branch --show-current 2>/dev/null || echo "main")
# Generate: branch-MMDD-HHMM (e.g., feature-auth-0111-1430)
name="${branch}-$(date +%m%d-%H%M)"
```

### Step 2: Ensure Sessions Directory Exists

```bash
mkdir -p .claude/sessions
```

### Step 3: Gather Context

Collect information about the current session:

1. **Current task** - What is the user working on?
2. **Progress** - What was accomplished?
3. **Pending** - What still needs to be done?
4. **Decisions** - What important decisions were made?
5. **Files** - What files were modified?

### Step 4: Create Session File

Write to `.claude/sessions/{name}.md`:

```markdown
# Session: {name}

Saved: [current timestamp]
Version: [current CodeAssist version from .claude/VERSION]
Branch: [current git branch]
Directory: [current working directory]

## Current Task

[Summarize the main task/goal the user is working on]

## Recent Progress

[List what was accomplished]
- [item 1]
- [item 2]

## Pending Work

[What still needs to be done]
- [ ] [item 1]
- [ ] [item 2]

## Key Decisions

[Important decisions that should be remembered]
- [decision 1]
- [decision 2]

## Files Modified

[Files that were changed in this session]
- `path/to/file` - [what was changed]

## Notes

[Any other context for resuming later]
```

### Step 5: Update Session Index

Append to `.claude/sessions/index.md` (create if doesn't exist):

```markdown
| Session | Saved | Branch | Task |
|---------|-------|--------|------|
| [{name}](./{name}.md) | [timestamp] | [branch] | [brief task] |
```

### Step 6: Claude-mem Integration (Optional)

If claude-mem is available (check for port 37777), offer to sync:

```
Claude-mem detected. Would you like to also save this context to persistent memory?
This makes it searchable across all future sessions.
```

If yes, create a memory-friendly summary that claude-mem can capture.

### Step 7: Confirm Save

Display:
```
## Session Saved

**Name:** {name}
**File:** .claude/sessions/{name}.md
**Time:** [timestamp]

### Summary
- **Task:** [brief summary]
- **Progress:** [N] items completed
- **Pending:** [N] items remaining

### Resume Later
```bash
/resume-session {name}
```

### View All Sessions
```bash
/session-list
```
```

## Output Format

```
Session "{name}" saved to .claude/sessions/{name}.md

Summary:
- Task: [current task]
- Progress: [completed count]
- Pending: [pending count]

Resume with: /resume-session {name}
List all: /session-list
```

Execute the session save now.
