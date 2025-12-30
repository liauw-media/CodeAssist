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
| Linux/macOS | `~/docs/` | `~/bin/docchange` |
| Windows (Git Bash) | `~/docs/` | `~/bin/docchange` (bash script) |
| Windows (CMD/PS) | `%USERPROFILE%\docs\` | `%USERPROFILE%\bin\docchange.cmd` |

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

#### Linux/macOS (`~/bin/docchange`)

```bash
#!/bin/bash
# docchange - Log a change to daily documentation
# Usage: docchange "Description of change"

set -e

# Validate input
if [ -z "$1" ]; then
    echo "Usage: docchange \"Description of change\"" >&2
    exit 1
fi

# Configuration
DOCS_DIR="$HOME/docs"
TODAY=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)
DAY_DIR="$DOCS_DIR/$TODAY"
CHANGES_FILE="$DAY_DIR/changes.md"

# Sanitize input - escape pipe characters to prevent table breakage
DESCRIPTION="${1//|/¦}"

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
echo "| $TIME | $DESCRIPTION |" >> "$CHANGES_FILE"

echo -e "\e[32mLogged: $DESCRIPTION\e[0m"
```

Make executable and add to PATH:
```bash
chmod +x ~/bin/docchange
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

#### Windows - Bash Script for Git Bash (`~/bin/docchange`)

Claude Code runs in Git Bash, so this script provides **2.7x faster** performance than PowerShell.

```bash
#!/bin/bash
# docchange - Log a change to daily documentation
# Usage: docchange "Description of change"
#
# Optimized for Git Bash on Windows (used by Claude Code)
# For native Windows CMD, use docchange.cmd instead.

set -e

# Validate input
if [ -z "$1" ]; then
    echo "Usage: docchange \"Description of change\"" >&2
    exit 1
fi

# Configuration
DOCS_DIR="$USERPROFILE/docs"
TODAY=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)
DAY_DIR="$DOCS_DIR/$TODAY"
CHANGES_FILE="$DAY_DIR/changes.md"

# Sanitize input - escape pipe characters to prevent table breakage
DESCRIPTION="${1//|/¦}"

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
echo "| $TIME | $DESCRIPTION |" >> "$CHANGES_FILE"

echo -e "\e[32mLogged: $DESCRIPTION\e[0m"
```

Make executable:
```bash
chmod +x ~/bin/docchange
```

#### Windows - PowerShell Script (`%USERPROFILE%\bin\docchange.ps1`)

Used by the CMD wrapper for native Windows environments.

```powershell
<#
.SYNOPSIS
    Log a change to the daily documentation changelog.
.DESCRIPTION
    Appends a timestamped entry to ~/docs/YYYY-MM-DD/changes.md
.PARAMETER Description
    The change description to log
.EXAMPLE
    docchange "Updated nginx configuration"
#>
param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Description
)

$ErrorActionPreference = "Stop"

# Configuration
$DocsDir = "$env:USERPROFILE\docs"
$Today = Get-Date -Format "yyyy-MM-dd"
$Time = Get-Date -Format "HH:mm"
$DayDir = "$DocsDir\$Today"
$ChangesFile = "$DayDir\changes.md"

# Sanitize input - escape pipe characters to prevent table breakage
$Description = $Description -replace '\|', '¦'

# Create daily directory if missing
if (!(Test-Path $DayDir)) {
    New-Item -ItemType Directory -Force -Path $DayDir | Out-Null
}

# Create changes.md with header if missing
if (!(Test-Path $ChangesFile)) {
    $header = @"
# Changes for $Today

| Time | Change |
|------|--------|
"@
    # Use .NET for UTF8 without BOM (works on PS 5.1+)
    [System.IO.File]::WriteAllText($ChangesFile, $header + "`n", [System.Text.UTF8Encoding]::new($false))
}

# Append with file locking to prevent corruption from concurrent writes
$entry = "| $Time | $Description |`n"
$maxRetries = 3
$retryCount = 0

while ($retryCount -lt $maxRetries) {
    try {
        $stream = [System.IO.File]::Open(
            $ChangesFile,
            [System.IO.FileMode]::Append,
            [System.IO.FileAccess]::Write,
            [System.IO.FileShare]::Read
        )
        $writer = [System.IO.StreamWriter]::new($stream, [System.Text.UTF8Encoding]::new($false))
        $writer.Write($entry)
        $writer.Close()
        $stream.Close()
        break
    }
    catch [System.IO.IOException] {
        $retryCount++
        if ($retryCount -ge $maxRetries) {
            throw "Could not write to $ChangesFile after $maxRetries attempts: $_"
        }
        Start-Sleep -Milliseconds 100
    }
}

Write-Host "Logged: $Description" -ForegroundColor Green
```

#### Windows - CMD Wrapper (`%USERPROFILE%\bin\docchange.cmd`)

```batch
@echo off
REM docchange - Log a change to daily documentation
REM Usage: docchange "Description of change"
powershell -ExecutionPolicy RemoteSigned -NoProfile -File "%USERPROFILE%\bin\docchange.ps1" %*
```

### Step 4: Add to PATH (Windows)

Run once in PowerShell:
```powershell
$binPath = "$env:USERPROFILE\bin"
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$binPath*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$binPath", "User")
    Write-Host "Added $binPath to PATH. Restart terminal to use."
}
```

### Step 5: Set Up Claude Code Hook (Optional)

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

## Security Features

| Feature | Benefit |
|---------|---------|
| Input sanitization | Pipe chars `\|` replaced with `¦` to prevent table breakage |
| UTF8 without BOM | Prevents encoding issues with other tools |
| File locking (PS) | Prevents corruption from concurrent writes |
| RemoteSigned policy | More secure than Bypass while allowing local scripts |
| -NoProfile flag | Faster startup, avoids profile interference |

## Performance

| Environment | Script | Time |
|-------------|--------|------|
| Git Bash (Claude Code) | `~/bin/docchange` (bash) | ~0.19s |
| Windows CMD/PowerShell | `docchange.cmd` | ~0.50s |

Claude Code uses Git Bash, so the bash script is automatically used for best performance.

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
# Linux/macOS/Git Bash
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
# Linux/macOS/Git Bash
cat ~/docs/$(date +%Y-%m-%d)/changes.md

# Windows PowerShell
Get-Content "$env:USERPROFILE\docs\$(Get-Date -Format 'yyyy-MM-dd')\changes.md"
```

## Checklist

- [ ] Created ~/docs directory
- [ ] Created changelog.md with system overview
- [ ] Installed docchange bash script (all platforms)
- [ ] Installed docchange.ps1 and docchange.cmd (Windows only)
- [ ] Added ~/bin to PATH
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
