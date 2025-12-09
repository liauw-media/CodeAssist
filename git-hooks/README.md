# Git Hooks

Optional git hooks for quality checks.

## Available Hooks

| Hook | Purpose |
|------|---------|
| `pre-commit` | Runs tests and linters before commit |
| `commit-msg` | Validates commit message format |

## Installation

Copy the hooks you want to `.git/hooks/`:

```bash
# Linux/macOS
cp git-hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

cp git-hooks/commit-msg .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
```

```bash
# Windows (Git Bash)
cp git-hooks/pre-commit .git/hooks/pre-commit

cp git-hooks/commit-msg .git/hooks/commit-msg
```

## What They Do

### pre-commit

Runs automatically before each commit:
- Runs `npm test` if package.json has a test script
- Runs `pest` or `phpunit` for PHP projects
- Runs `pytest` for Python projects
- Runs `npm run lint` if available

If any check fails, the commit is aborted.

### commit-msg

Validates commit messages:
- Minimum 10 character length
- Optional: Block AI co-author lines (uncomment in script)

## Bypass

To skip hooks for a single commit:

```bash
git commit --no-verify -m "message"
```

## Customization

Edit the hook scripts to fit your project needs. Common customizations:
- Add or remove test commands
- Change minimum commit message length
- Add custom validation rules
