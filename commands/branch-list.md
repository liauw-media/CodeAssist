# Branch List

List all active issue branches and worktrees.

## Execute

### Step 1: List Branches

```bash
# Local branches with issue pattern
git branch --list "feature/*" --list "fix/*" --list "hotfix/*"

# With last commit info
git branch -v --list "feature/*"
```

### Step 2: List Worktrees

```bash
git worktree list
```

### Step 3: Find Checklists

```bash
ls .claude/issue-*.md 2>/dev/null
```

### Step 4: Correlate Data

Match branches with:
- Their worktrees (if any)
- Their checklists (if any)
- Commit count since base
- Last activity date

### Step 5: Output Report

```
## Active Branches

| Branch | Issue | Worktree | Commits | Last Activity |
|--------|-------|----------|---------|---------------|
| feature/123-fix-login | #123 | ../project-123 | 3 | 2 hours ago |
| feature/456-add-export | #456 | (none) | 1 | 1 day ago |
| feature/789-refactor | #789 | ../project-789 | 5 | 3 days ago |

### Worktrees

| Path | Branch | Status |
|------|--------|--------|
| /path/to/project | main | (main repo) |
| /path/to/project-123 | feature/123-fix-login | clean |
| /path/to/project-789 | feature/789-refactor | 2 uncommitted |

### Checklists

| File | Issue | Progress |
|------|-------|----------|
| .claude/issue-123.md | #123 | 4/6 items |
| .claude/issue-456.md | #456 | 2/6 items |

### Stale Branches

Branches with no activity in 7+ days:
- feature/789-refactor (3 days) - consider completing or abandoning

### Commands

| Command | Purpose |
|---------|---------|
| `/branch-status` | Check current branch progress |
| `/branch-done` | Complete current branch |
| `git worktree remove [path]` | Remove a worktree |
| `git branch -d [name]` | Delete a branch |
```

Execute the listing now.
