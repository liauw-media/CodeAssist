# Status

Show current project status.

## Execute

Run these commands and report the results:

```bash
# Current branch
git branch --show-current

# Git status
git status --short

# Recent commits
git log --oneline -5

# Uncommitted changes summary
git diff --stat
```

## Output Format

```
## Project Status

**Branch:** [branch name]
**Status:** [clean / X uncommitted files]

### Uncommitted Changes
[list files or "Working tree clean"]

### Recent Commits
[last 5 commits]

### Suggested Next Steps
[based on status - e.g., "Ready to commit" or "Review changes first"]
```

Run the commands now and provide the status report.
