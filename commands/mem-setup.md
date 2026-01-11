# Memory Setup

Set up persistent memory across Claude Code sessions using claude-mem.

## Task
$ARGUMENTS

## Memory Setup Protocol

You are setting up **claude-mem** - a persistent memory system for Claude Code.

**DO NOT just show instructions. Actually run the commands.**

### Step 1: Check Prerequisites

Run these checks:

```bash
# Check Node.js version (needs 18+)
node --version

# Check if marketplace already added
claude plugin marketplace list
```

**Requirements:**
- Node.js 18.0.0 or higher
- Claude Code CLI available

If Node.js is missing or too old, stop and tell the user to install Node.js 18+.

### Step 2: Add Marketplace

If `thedotmack/claude-mem` is not in the marketplace list, add it:

```bash
claude plugin marketplace add thedotmack/claude-mem
```

### Step 3: Install Plugin

Install the claude-mem plugin:

```bash
claude plugin install claude-mem
```

### Step 4: Verify Installation

Check the plugin is installed:

```bash
# List installed plugins
ls ~/.claude/plugins/repos/ 2>/dev/null || dir "%USERPROFILE%\.claude\plugins\repos" 2>nul
```

### Step 5: Report Success

After successful installation, show:

```
## Memory Setup Complete

**Status:** Installed successfully

**Next Step:** Restart Claude Code to activate the plugin.

After restart:
- Web UI: http://localhost:37777
- Memory captures automatically during sessions
- Use <private> tags for sensitive content

### Privacy Tags Example

```markdown
<private>
DATABASE_PASSWORD=secret
API_KEY=sk-xxx
</private>
```

### Quick Commands

| Action | How |
|--------|-----|
| View memory | http://localhost:37777 |
| Search memory | Ask Claude about past sessions |
| Exclude content | Wrap in `<private>` tags |
```

### Error Handling

| Error | Solution |
|-------|----------|
| Node.js not found | Install Node.js 18+ from nodejs.org |
| Marketplace add fails | Check internet connection |
| Plugin install fails | Try `claude plugin marketplace update` first |
| Already installed | Skip to restart step |

### Uninstalling

If needed later:

```bash
claude plugin uninstall claude-mem
```

**Execute all steps now. Do not just show instructions - run the actual commands.**
