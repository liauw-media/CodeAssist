# CA-Update

Check for CodeAssist updates and see what's new.

> Prefixed with `ca-` to avoid conflicts with Claude Code built-in commands.

## Execute

### Step 1: Check Versions

```bash
# Current version
CURRENT=$(cat .claude/VERSION 2>/dev/null || echo "unknown")
echo "Current: $CURRENT"

# Latest version
LATEST=$(curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/.claude/VERSION 2>/dev/null || echo "unknown")
echo "Latest:  $LATEST"
```

### Step 2: Compare and Report

If versions match:
```
✓ You're on the latest version ($CURRENT)
```

If update available:
```
Update available: $CURRENT → $LATEST
```

### Step 3: Fetch What's New

If update available, fetch and summarize the changelog:

```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/CHANGELOG.md 2>/dev/null | head -100
```

Summarize the key changes between current and latest version.

### Step 4: Show Update Options

```
## How to Update

**Option 1: Auto-update (recommended)**
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash

**Option 2: Pin to specific version**
VERSION=1.0.9 curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

### Step 5: Offer to Update Now

Ask user:
```
Would you like me to run the update now?
- Yes: Save context and update
- No: Just show the info
```

If yes, proceed to Step 6.

### Step 6: Save Session Context

Before updating, save the current session context so work can be resumed after restart.

**Create `.claude/session-context.md` with this structure:**

```markdown
# Session Context

Saved: [current timestamp]
Previous Version: [version before update]

## Current Task

[Summarize what the user was working on - be specific about files, features, bugs]

## Recent Progress

[List what was accomplished in this session]
- [completed item 1]
- [completed item 2]

## Pending Work

[What still needs to be done]
- [ ] [pending item 1]
- [ ] [pending item 2]

## Key Decisions

[Important decisions made during this session that should be remembered]

## Files Modified

[List files that were changed]
- `path/to/file1` - [what was changed]
- `path/to/file2` - [what was changed]

## Notes

[Any other context that would help resume work]
```

Write this context file before proceeding.

### Step 7: Run Update

```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

Verify:
```bash
echo "Updated to: $(cat .claude/VERSION)"
```

### Step 8: Inform User to Restart

After successful update, display:

```
CodeAssist Updated

Version: [old] → [new]

RESTART REQUIRED

New skills and commands only load when Claude starts fresh.

To continue your work:
1. Exit this session (Ctrl+C or /exit)
2. Start fresh: claude
3. Run: /resume-session

Session context saved to .claude/session-context.md
```

**Important:** Do NOT continue working after update - old skills are still loaded.

## Output Format

```
## CodeAssist Update Check

**Current:** 1.0.8
**Latest:**  1.0.9

### What's New

- `/resume-session` - Resume work after update
- Session context preservation during updates

### Update Command

curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash

Run update now? [Yes/No]
```

Execute the update check now.
