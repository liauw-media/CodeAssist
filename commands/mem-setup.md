# Memory Setup

Set up persistent memory across Claude Code sessions using claude-mem.

## Task
$ARGUMENTS

## Memory Setup Protocol

You are setting up **claude-mem** - a persistent memory system for Claude Code.

**DO NOT just show instructions. Actually run the commands.**

### Step 1: Check Prerequisites

Run these checks in order:

```bash
# Check Node.js version (needs 18+)
node --version

# Check if bun is installed
bun --version 2>/dev/null || echo "BUN_NOT_FOUND"
```

**Requirements:**
- Node.js 18.0.0 or higher
- Bun runtime (will install if missing)
- Claude Code CLI available

### Step 2: Install Bun (if missing)

**Bun installs to `~/.bun` - NO ROOT/SUDO needed.**

If bun is not found, install it:

```bash
# This installs to ~/.bun (user directory, no root needed)
curl -fsSL https://bun.sh/install | bash
```

Then add to PATH for current session:

```bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

Verify installation:
```bash
bun --version
```

**If curl install fails**, try npm (also user-level if npm is configured correctly):
```bash
npm install -g bun
```

**Windows (PowerShell, no admin needed):**
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Step 2b: Troubleshooting Bun Install

**"Permission denied" errors:**
- Do NOT use sudo with the bun installer
- The installer writes to `~/.bun` which you own

**"bun: command not found" after install:**
- Add to PATH: `export PATH="$HOME/.bun/bin:$PATH"`
- Add to your shell profile (`~/.bashrc` or `~/.zshrc`):
  ```bash
  echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.bashrc
  echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc
  source ~/.bashrc
  ```

**Restricted VPS / Can't install bun:**

If you truly cannot install bun (network restrictions, read-only filesystem, etc.), claude-mem won't work. Use CodeAssist's built-in session management instead:

```
/save-session [name]    # Save current context
/resume-session [name]  # Resume later
```

This stores context in `.claude/sessions/` without external dependencies.

### Step 3: Add Marketplace

Check if marketplace is added:

```bash
claude plugin marketplace list
```

If `thedotmack/claude-mem` is not listed:

```bash
claude plugin marketplace add thedotmack/claude-mem
```

### Step 4: Install Plugin

```bash
claude plugin install claude-mem
```

### Step 5: Verify Installation

```bash
# Check plugin installed
ls ~/.claude/plugins/repos/ 2>/dev/null || dir "%USERPROFILE%\.claude\plugins\repos" 2>nul

# Verify bun is in PATH (hooks need this)
which bun || where bun
```

### Step 6: Report Results

**On Success:**

```
## Memory Setup Complete

**Status:** Installed successfully

**Prerequisites:**
- Node.js: ✓
- Bun: ✓ (installed to ~/.bun)
- Plugin: ✓

**Next Step:** Restart Claude Code to activate the plugin.

After restart:
- Web UI: http://localhost:37777
- Memory captures automatically during sessions
- Use <private> tags for sensitive content

### Quick Reference

| Action | How |
|--------|-----|
| View memory | http://localhost:37777 |
| Search memory | Ask Claude about past sessions |
| Exclude content | Wrap in `<private>` tags |
```

**On Bun Install Failure (restricted environment):**

```
## Memory Setup - Alternative Recommended

**Issue:** Bun cannot be installed in this environment.

**Why:** claude-mem requires Bun for lifecycle hooks. Without Bun, hooks fail with "bun: not found".

**Alternative:** Use CodeAssist's built-in session management:

| Command | Purpose |
|---------|---------|
| `/save-session [name]` | Save context to .claude/sessions/ |
| `/resume-session [name]` | Resume from saved session |
| `/session-list` | List all saved sessions |

This provides similar functionality without external dependencies:
- Works on any system with Claude Code
- No root/sudo needed
- No network dependencies
- Project-scoped storage

To save your current session:
/save-session
```

### Error Reference

| Error | Cause | Solution |
|-------|-------|----------|
| Node.js not found | Not installed | Install Node.js 18+ from nodejs.org |
| bun: not found | Not in PATH | `export PATH="$HOME/.bun/bin:$PATH"` |
| Permission denied | Used sudo | Don't use sudo, bun installs to ~/.bun |
| curl failed | Network restricted | Use `/save-session` instead |
| Hook errors | bun not in PATH | Restart terminal after bun install |

### Uninstalling

```bash
claude plugin uninstall claude-mem
```

**Execute all steps now. Offer `/save-session` alternative if bun install fails.**
