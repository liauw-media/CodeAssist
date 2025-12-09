# Commit

Pre-commit checklist and commit.

## Context
$ARGUMENTS

## Execute

### Step 1: Check status

```bash
git status --short
git diff --stat
```

If no changes, report "Nothing to commit" and stop.

### Step 2: Pre-commit checklist

Before committing, verify:

- [ ] Changes are intentional (review the diff)
- [ ] No debug code left (console.log, dd(), print())
- [ ] No secrets or credentials in changes
- [ ] Tests pass (run if not recently run)

### Step 3: Stage changes

```bash
# Stage all changes, or specific files if provided
git add -A
# or
git add [specific files from $ARGUMENTS]
```

### Step 4: Create commit

Generate a commit message based on the changes:
- Use conventional commit format (feat:, fix:, docs:, refactor:, test:)
- Keep first line under 72 characters
- Add body if changes need explanation

```bash
git commit -m "[generated message]"
```

Do NOT add AI co-author attribution.

### Step 5: Verify

```bash
git log -1 --oneline
git status
```

## Output Format

```
## Commit

### Changes Committed
[list of files]

### Commit Message
[the commit message]

### Result
**Commit:** [hash]
**Branch:** [branch]

### Next Steps
[e.g., "Push with: git push" or "Create PR with: gh pr create"]
```

If no commit message provided in $ARGUMENTS, generate one from the changes.
If message provided, use it.

Execute the commit process now.
