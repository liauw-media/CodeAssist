# Server Documentation System

Set up a documentation system that tracks changes and maintains server/project documentation with Claude Code hooks.

## When to Use

- Setting up a new server or development environment
- Need to track configuration changes over time
- Want automatic documentation of work sessions
- Maintaining changelog for infrastructure

## Directory Structure

```
~/docs/                        # User home directory (cross-platform)
├── changelog.md               # Global overview with system info and changelog
└── YYYY-MM-DD/
    ├── changes.md             # Daily quick change log (table format)
    └── *.md                   # Detailed topic files as needed
```

### Platform-Specific Paths

| Platform | Docs Location | Command Location |
|----------|---------------|------------------|
| Linux/macOS | `~/docs/` | `~/bin/docchange` or `/usr/local/bin/docchange` |
| Windows | `%USERPROFILE%\docs\` | `%USERPROFILE%\bin\docchange.ps1` |

## Setup Protocol

### Step 1: Create Directory Structure

**Linux/macOS:**
```bash
mkdir -p ~/docs ~/bin
```

**Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\docs", "$env:USERPROFILE\bin"
```

### Step 2: Create Global Changelog

Create `~/docs/changelog.md` with this template:

```markdown
# System Documentation

## Overview

| Property | Value |
|----------|-------|
| Hostname | `hostname-here` |
| IP | `x.x.x.x` |
| OS | `os-version` |
| Provider | `provider-name` |

## Services

| Service | Port | URL | Notes |
|---------|------|-----|-------|
| example | 8080 | http://localhost:8080 | Description |

## Users

| User | Purpose | Docker | Sudo |
|------|---------|--------|------|
| admin | Administration | Yes | Yes |

## Key Paths

| Path | Purpose |
|------|---------|
| ~/docs | Documentation |
| ~/projects | Project files |

## Quick Commands

```bash
docchange "Description of change"    # Log a change
```

## Changelog

| Date | Summary |
|------|---------|
<!-- New entries added above -->
```

### Step 3: Create docchange Command

**Linux/macOS (`~/bin/docchange`):**
```bash
#!/bin/bash
set -e

DOCS_DIR="$HOME/docs"
TODAY=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)
DAY_DIR="$DOCS_DIR/$TODAY"
CHANGES_FILE="$DAY_DIR/changes.md"

# Create daily directory if missing
mkdir -p "$DAY_DIR"

# Create changes.md with header if missing
if [ ! -f "$CHANGES_FILE" ]; then
    cat > "$CHANGES_FILE" << EOF
# Changes for $TODAY

| Time | Change |
|------|--------|
EOF
fi

# Append the change
echo "| $TIME | $1 |" >> "$CHANGES_FILE"
echo "Logged: $1"
```

Make executable:
```bash
chmod +x ~/bin/docchange
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
```

**Windows (`%USERPROFILE%\bin\docchange.ps1`):**
```powershell
param([Parameter(Mandatory=$true)][string]$Description)

$DocsDir = "$env:USERPROFILE\docs"
$Today = Get-Date -Format "yyyy-MM-dd"
$Time = Get-Date -Format "HH:mm"
$DayDir = "$DocsDir\$Today"
$ChangesFile = "$DayDir\changes.md"

# Create daily directory if missing
if (!(Test-Path $DayDir)) {
    New-Item -ItemType Directory -Force -Path $DayDir | Out-Null
}

# Create changes.md with header if missing
if (!(Test-Path $ChangesFile)) {
    @"
# Changes for $Today

| Time | Change |
|------|--------|
"@ | Set-Content $ChangesFile
}

# Append the change
"| $Time | $Description |" | Add-Content $ChangesFile
Write-Host "Logged: $Description"
```

Add to PATH (run once in PowerShell):
```powershell
# Create a batch wrapper for easier calling
@"
@echo off
powershell -ExecutionPolicy Bypass -File "%USERPROFILE%\bin\docchange.ps1" %*
"@ | Set-Content "$env:USERPROFILE\bin\docchange.cmd"

# Add to user PATH if not already present
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$binPath = "$env:USERPROFILE\bin"
if ($userPath -notlike "*$binPath*") {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$binPath", "User")
    Write-Host "Added $binPath to PATH. Restart terminal to use."
}
```

### Step 4: Set Up Claude Code Hook (Optional)

Create `.claude/hooks/post-tool-use.sh` (Linux/macOS) or `.claude/hooks/post-tool-use.ps1` (Windows) to auto-document significant changes.

**Linux/macOS:**
```bash
#!/bin/bash
# Auto-log file edits to documentation
TOOL="$1"
if [ "$TOOL" = "Edit" ] || [ "$TOOL" = "Write" ]; then
    # Hook can trigger docchange for significant edits
    # Customize based on your needs
    :
fi
```

**Windows:**
```powershell
param($Tool)
# Auto-log file edits to documentation
if ($Tool -eq "Edit" -or $Tool -eq "Write") {
    # Hook can trigger docchange for significant edits
    # Customize based on your needs
}
```

## Usage

### Log a Change Manually

```bash
docchange "Installed nginx and configured reverse proxy"
docchange "Updated firewall rules for port 443"
docchange "Created backup script in ~/bin/backup.sh"
```

### Create Detailed Documentation

For complex changes, create a detailed file:

```bash
# Linux/macOS
cat > ~/docs/$(date +%Y-%m-%d)/nginx-setup.md << 'EOF'
# Nginx Setup

## Installation
...

## Configuration
...
EOF

# Then log the summary
docchange "Set up nginx - see nginx-setup.md for details"
```

### View Recent Changes

```bash
# Linux/macOS
cat ~/docs/$(date +%Y-%m-%d)/changes.md

# Windows PowerShell
Get-Content "$env:USERPROFILE\docs\$(Get-Date -Format 'yyyy-MM-dd')\changes.md"
```

## Checklist

- [ ] Created ~/docs directory
- [ ] Created changelog.md with system overview
- [ ] Installed docchange command
- [ ] Verified docchange works: `docchange "Test entry"`
- [ ] (Optional) Set up Claude Code hook for auto-documentation

## Tips

1. **Be specific**: "Updated nginx config for SSL" > "Changed config"
2. **Link details**: Reference detailed .md files for complex changes
3. **Daily review**: End of day, review changes.md and update changelog.md summary
4. **Cross-platform**: Use `~/` paths in documentation, they expand correctly on all platforms

## Integration with Claude Code

When working with Claude Code, ask it to:
- Run `docchange "description"` after significant changes
- Create detailed documentation files for complex setups
- Update the main changelog.md periodically

Example prompt:
```
After completing this task, run docchange with a summary of what was changed.
```
