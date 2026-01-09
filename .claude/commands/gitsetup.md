# Git Setup

Set up git hooks to protect main branch and clean commit messages.

## Execute

### Step 1: Check Git Repository

```bash
git rev-parse --git-dir
```

If not a git repo, inform user and exit.

### Step 2: Create Hooks Directory

```bash
mkdir -p .git/hooks
```

### Step 3: Create Pre-Push Hook (Protect Main)

Create `.git/hooks/pre-push`:

```bash
#!/bin/bash
# Prevent direct push to main/master branch

protected_branches=("main" "master")
current_branch=$(git symbolic-ref HEAD 2>/dev/null | sed 's|refs/heads/||')

for branch in "${protected_branches[@]}"; do
    if [ "$current_branch" = "$branch" ]; then
        echo ""
        echo "ERROR: Direct push to '$branch' is blocked."
        echo ""
        echo "Use a feature branch instead:"
        echo "  git checkout -b feature/my-change"
        echo "  git push -u origin feature/my-change"
        echo ""
        echo "Then create a PR to merge into $branch."
        echo ""
        exit 1
    fi
done

exit 0
```

### Step 4: Create Commit-Msg Hook (Strip Claude Mentions)

Create `.git/hooks/commit-msg`:

```bash
#!/bin/bash
# Remove Claude Code signatures from commit messages

COMMIT_MSG_FILE="$1"

# Create temp file
TEMP_FILE=$(mktemp)

# Remove Claude Code signatures:
# - "🤖 Generated with [Claude Code](https://claude.com/claude-code)"
# - "Co-Authored-By: Claude ... <noreply@anthropic.com>"
# - Empty lines at the end

sed -E \
    -e '/^[[:space:]]*$/d' \
    -e '/Generated with \[Claude Code\]/d' \
    -e '/Generated with Claude Code/d' \
    -e '/Co-Authored-By:.*Claude.*@anthropic\.com/d' \
    -e '/Co-Authored-By:.*noreply@anthropic\.com/d' \
    "$COMMIT_MSG_FILE" > "$TEMP_FILE"

# Remove trailing blank lines
sed -i -e :a -e '/^\n*$/{$d;N;ba' -e '}' "$TEMP_FILE" 2>/dev/null || \
    sed -i '' -e :a -e '/^\n*$/{$d;N;ba' -e '}' "$TEMP_FILE" 2>/dev/null || true

# Only update if we actually removed something
if ! diff -q "$COMMIT_MSG_FILE" "$TEMP_FILE" > /dev/null 2>&1; then
    cat "$TEMP_FILE" > "$COMMIT_MSG_FILE"
    echo "Cleaned commit message (removed Claude Code signatures)"
fi

rm -f "$TEMP_FILE"
exit 0
```

### Step 5: Make Hooks Executable

```bash
chmod +x .git/hooks/pre-push
chmod +x .git/hooks/commit-msg
```

### Step 6: Verify Setup

```bash
echo "Git hooks installed:"
ls -la .git/hooks/pre-push .git/hooks/commit-msg
```

### Step 7: Report Success

Display:
```
Git Setup Complete

Hooks installed:
  .git/hooks/pre-push     - Blocks direct push to main/master
  .git/hooks/commit-msg   - Strips Claude Code mentions from commits

Protected branches: main, master

To bypass (emergency only):
  git push --no-verify
  git commit --no-verify

To uninstall:
  rm .git/hooks/pre-push .git/hooks/commit-msg
```

## Options

If user specifies `--uninstall`:
```bash
rm -f .git/hooks/pre-push .git/hooks/commit-msg
echo "Git hooks removed"
```

## Notes

- Hooks are local to this repository (not committed)
- Each developer needs to run /gitsetup after cloning
- Use `--no-verify` to bypass in emergencies
- Works on Linux, macOS, and Windows (Git Bash)
