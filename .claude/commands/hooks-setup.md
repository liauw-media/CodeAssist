# Hooks Setup

Configure event-driven hooks for Claude Code automation.

## What Are Hooks?

Hooks are shell commands that run automatically when Claude performs certain actions:

- **PreToolUse**: Before a tool executes (can block dangerous operations)
- **PostToolUse**: After a tool completes (notifications, validation)
- **Notification**: On specific messages or patterns

## Setup Instructions

### 1. View Available Templates

```bash
cat .claude/templates/hooks.json
```

### 2. Merge Into Settings

Hooks go in `~/.claude/settings.json`. Merge the template:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "tool == 'Edit' && file_path matches '\\.tsx?$'",
        "hooks": [{"type": "command", "command": "echo '[Hook] TS file edited'"}]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "tool == 'Bash' && command matches 'rm -rf'",
        "hooks": [{"type": "command", "command": "echo '[SAFETY] Destructive command'"}]
      }
    ]
  }
}
```

### 3. Useful Hook Examples

**Security: Warn on secret file edits**
```json
{
  "matcher": "tool == 'Write' && file_path matches '\\.(env|key|pem)$'",
  "hooks": [{"type": "command", "command": "echo '[SECURITY] Sensitive file modified'"}]
}
```

**Quality: Run linter after Python edits**
```json
{
  "matcher": "tool == 'Edit' && file_path matches '\\.py$'",
  "hooks": [{"type": "command", "command": "ruff check ${file_path} || true"}]
}
```

**Safety: Block force push**
```json
{
  "matcher": "tool == 'Bash' && command matches 'push.*--force'",
  "hooks": [{"type": "command", "command": "echo 'BLOCKED: Force push requires manual confirmation' && exit 1"}]
}
```

**Database: Backup before destructive SQL**
```json
{
  "matcher": "tool == 'Bash' && command matches 'DROP|TRUNCATE|DELETE'",
  "hooks": [{"type": "command", "command": "./scripts/backup-database.sh"}]
}
```

## Hook Matcher Syntax

```
tool == 'Edit'                           # Exact tool match
file_path matches '\\.tsx?$'             # Regex on file path
command matches 'rm -rf'                 # Regex on command
message matches 'error|fail'             # Regex on output
```

## Context Window Warning

**Critical**: Too many hooks with complex matchers can impact performance. Keep hooks focused and minimal.

## Output Format

```
## Hooks Configuration

**Location:** ~/.claude/settings.json
**Template:** .claude/templates/hooks.json

### Recommended Hooks
1. Security warnings for sensitive files
2. Linter triggers for code edits
3. Safety blocks for destructive commands

### Installation
1. Copy template to settings.json
2. Customize matchers for your project
3. Test with low-risk operations first

### Next Steps
- Review `.claude/templates/hooks.json`
- Merge desired hooks into settings
- Restart Claude Code to apply
```
