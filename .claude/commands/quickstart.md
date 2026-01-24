# Quickstart

Interactive onboarding for new CodeAssist users. Handles essential setup automatically.

## Execute

### Step 1: Verify Installation

```bash
cat .claude/VERSION 2>/dev/null || echo "NOT INSTALLED"
```

If not installed:
```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

### Step 2: Add .claude to .gitignore

Check and add if missing:

```bash
if [ -f .gitignore ]; then
    if ! grep -q "^\.claude" .gitignore 2>/dev/null; then
        echo ".claude/" >> .gitignore
        echo "Added .claude/ to .gitignore"
    else
        echo ".claude/ already in .gitignore"
    fi
else
    echo ".claude/" > .gitignore
    echo "Created .gitignore with .claude/"
fi
```

### Step 3: Set Up Git Hooks

Install hooks to protect main branch and strip Claude mentions from commits:

```bash
# Create hooks directory
mkdir -p .git/hooks

# Pre-push hook (protect main/master)
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash
protected_branches=("main" "master")
current_branch=$(git symbolic-ref HEAD 2>/dev/null | sed 's|refs/heads/||')

for branch in "${protected_branches[@]}"; do
    if [ "$current_branch" = "$branch" ]; then
        echo "ERROR: Direct push to '$branch' blocked. Use a feature branch."
        exit 1
    fi
done
exit 0
EOF

# Commit-msg hook (strip Claude mentions)
cat > .git/hooks/commit-msg << 'EOF'
#!/bin/bash
COMMIT_MSG_FILE="$1"
TEMP_FILE=$(mktemp)

sed -E \
    -e '/Generated with \[Claude Code\]/d' \
    -e '/Generated with Claude Code/d' \
    -e '/Co-Authored-By:.*Claude.*@anthropic\.com/d' \
    -e '/Co-Authored-By:.*noreply@anthropic\.com/d' \
    "$COMMIT_MSG_FILE" > "$TEMP_FILE"

if ! diff -q "$COMMIT_MSG_FILE" "$TEMP_FILE" > /dev/null 2>&1; then
    cat "$TEMP_FILE" > "$COMMIT_MSG_FILE"
fi
rm -f "$TEMP_FILE"
exit 0
EOF

# Make executable
chmod +x .git/hooks/pre-push .git/hooks/commit-msg
echo "Git hooks installed (main protection + Claude mention stripping)"
```

### Step 4: Detect Project Type

Check for framework indicators:

```bash
# Laravel
[ -f artisan ] && echo "LARAVEL"

# React/Next.js
[ -f package.json ] && grep -q "react\|next" package.json 2>/dev/null && echo "REACT"

# Python/Django
[ -f manage.py ] || [ -f requirements.txt ] && echo "PYTHON"

# PHP
[ -f composer.json ] && echo "PHP"
```

### Step 5: Recommend Commands

Based on detected framework:

**Laravel:**
```
/laravel [task]  - Laravel-specific help
/test            - Run tests with database backup
/backup          - Manual database backup
/db [task]       - Database operations
```

**React/Next.js:**
```
/react [task]    - React/Next.js help
/test            - Run tests
/e2e [flow]      - End-to-end testing
/review          - Code review
```

**Python/Django:**
```
/python [task]   - Django/FastAPI help
/test            - Run tests
/security        - Security audit
```

**Everyone:**
```
/status          - Git status, branch, commits
/branch [id] [desc] - Create feature branch
/review          - Code review before commit
/commit          - Pre-commit checks + commit
/guide           - What to do next
/mentor [topic]  - Critical feedback
```

### Step 6: Offer Demo

Ask if they want to:
1. Run `/status` to see project state
2. Run `/guide` for suggestions
3. Explore the codebase

## Output Format

```
## CodeAssist Setup Complete

**Version:** [version]
**Project:** [detected framework]

### Setup Completed
- [x] .claude/ added to .gitignore
- [x] Git hooks installed (main protection + commit cleaning)

### Your Key Commands

| Command | What it does |
|---------|--------------|
| /status | Git status and branch info |
| /[framework] [task] | Framework-specific help |
| /test | Run tests safely |
| /review | Code review |
| /commit | Pre-commit checks + commit |

### Try Now

Run `/status` to see your project state.

### Need Help?

- `/guide` - Contextual suggestions
- `/mentor [topic]` - Direct answers
- [docs/INDEX.md](docs/INDEX.md) - Full documentation
```

Run the quickstart now. Execute all setup steps automatically, then present the summary.
