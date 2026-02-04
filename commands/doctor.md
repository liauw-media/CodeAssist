# Doctor

Run health checks on the CodeAssist installation and project environment.

## Arguments

- `$ARGUMENTS` - Optional: pass `--fix` to auto-repair missing directories

## Execute

Run the following health checks and report results in a table. For each check, report OK, MISSING, or WARNING.

### 1. Core Structure

Check these paths exist relative to the project root:

```
.claude/                  → directory exists?
.claude/VERSION           → file exists? Read and display version
.claude/CLAUDE.md         → file exists?
.claude/rules/            → directory exists?
.claude/commands/         → directory exists?
commands/                 → directory exists?
```

### 2. Skills Validation

```bash
# Count SKILL.md files
find skills/ -name "SKILL.md" 2>/dev/null | wc -l

# Check each SKILL.md has frontmatter (starts with ---)
find skills/ -name "SKILL.md" -exec head -1 {} \; 2>/dev/null
```

Report: X skills found, Y with valid frontmatter.

### 3. Scripts Check

Check these files exist:

```
scripts/ralph-runner.ts    → exists?
scripts/safe-test.sh       → exists?
scripts/node_modules/      → exists? (warn if missing: "Run: cd scripts && npm install")
```

### 4. Git Health

```bash
# HEAD state
git rev-parse --is-inside-work-tree 2>/dev/null

# Check for detached HEAD
git symbolic-ref HEAD 2>/dev/null || echo "DETACHED HEAD"

# Remote configured?
git remote -v 2>/dev/null | head -1

# Working tree clean?
git status --porcelain 2>/dev/null | wc -l
```

### 5. Tool Availability

Check each tool is available:

```bash
git --version 2>/dev/null
node --version 2>/dev/null
npm --version 2>/dev/null
gh --version 2>/dev/null
glab --version 2>/dev/null
```

Report: available or not found for each.

### 6. MCP Servers

```
.mcp.json                 → file exists?
```

If it exists, read it and list configured server names.

### 7. Session Files

```bash
# Count session files
ls .claude/sessions/ 2>/dev/null | wc -l
```

## Auto-Fix (--fix flag)

If `$ARGUMENTS` contains `--fix`, automatically create missing directories:

```bash
mkdir -p .claude/rules
mkdir -p .claude/commands
mkdir -p .claude/sessions
mkdir -p commands
mkdir -p skills
```

Report what was created.

## Output Format

```
## CodeAssist Health Check

**Version:** [version from .claude/VERSION or UNKNOWN]

### Results

| Check | Status | Details |
|-------|--------|---------|
| Core structure | OK/WARN | X/Y paths found |
| Skills | OK/WARN | X skills, Y valid frontmatter |
| Scripts | OK/WARN | details |
| Git health | OK/WARN | branch, remote status |
| Tools | OK/WARN | X/Y tools available |
| MCP servers | OK/WARN | X servers configured |
| Sessions | OK/INFO | X session files |

### Issues Found

[List any MISSING or WARNING items with fix suggestions]

### Summary

[X checks passed, Y warnings, Z missing]
[If --fix was used: "Auto-fixed: created X directories"]
```

Run the health checks now. If `$ARGUMENTS` contains `--fix`, apply auto-fixes first, then report.
