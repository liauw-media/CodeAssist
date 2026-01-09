# Save Session

Manually save your current session context for later resumption.

Use this before:
- Ending a work session
- Switching to a different task
- Taking a break

## Execute

### Step 1: Gather Context

Collect information about the current session:

1. **Current task** - What is the user working on?
2. **Progress** - What was accomplished?
3. **Pending** - What still needs to be done?
4. **Decisions** - What important decisions were made?
5. **Files** - What files were modified?

### Step 2: Create Context File

Write to `.claude/session-context.md`:

```markdown
# Session Context

Saved: [current timestamp]
Version: [current CodeAssist version from .claude/VERSION]

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

### Step 3: Confirm Save

Display:
```
Session Context Saved

File: .claude/session-context.md
Time: [timestamp]

Saved:
- Current task: [brief summary]
- Progress: [N] items completed
- Pending: [N] items remaining

To resume later:
1. Start a new Claude session: claude
2. Run: /resume-session
```

## Output Format

```
Session saved to .claude/session-context.md

Summary:
- Task: [current task]
- Progress: [completed count]
- Pending: [pending count]

Resume with: /resume-session
```

Execute the session save now.
