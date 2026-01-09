# Branch

Create a focused branch for a single issue with optional worktree for parallel work.

## Arguments
$ARGUMENTS

## Execute

### Step 1: Parse Arguments

Extract from arguments:
- **Issue ID**: Number or identifier (e.g., `123`, `PROJ-456`)
- **Description**: Brief description of the work
- **Worktree flag**: `--worktree` or `-w` to create separate worktree

Examples:
```
/branch 123 fix login validation
/branch PROJ-456 add user export --worktree
/branch 789 -w refactor auth
```

### Step 2: Validate Current State

```bash
# Check for uncommitted changes
git status --porcelain
```

If there are uncommitted changes:
- STOP and warn user
- Suggest: commit, stash, or discard changes first
- Do NOT proceed until working tree is clean

### Step 3: Create Branch

```bash
# Get current branch (usually main/master)
BASE_BRANCH=$(git symbolic-ref --short HEAD)

# Create branch name
# Format: feature/[issue-id]-[short-description]
BRANCH_NAME="feature/[issue-id]-[kebab-case-description]"

# Create and switch to branch
git checkout -b $BRANCH_NAME
```

### Step 4: Create Worktree (if requested)

If `--worktree` or `-w` flag provided:

```bash
# Determine worktree path
# Pattern: ../[repo-name]-[issue-id]/
WORKTREE_PATH="../$(basename $(pwd))-[issue-id]"

# Create worktree with the branch
git worktree add $WORKTREE_PATH $BRANCH_NAME

# Report location
echo "Worktree created at: $WORKTREE_PATH"
```

### Step 5: Create Issue Checklist

Create `.claude/issue-[id].md` with:

```markdown
# Issue [ID]: [Description]

Branch: [branch-name]
Created: [date]
Base: [base-branch]

## Scope

**This branch should ONLY contain changes for:**
- [describe the specific issue]

**Out of scope (create separate branches):**
- Unrelated refactoring
- Other bug fixes found along the way
- "While I'm here" improvements

## Checklist

### Before Starting
- [ ] Branch created from latest [base-branch]
- [ ] Issue requirements understood
- [ ] Scope defined above
- [ ] **Mentor Review**: `/mentor review requirements for #[ID]`
  - Requirements clear? Approach sound? Potential issues?

### During Work
- [ ] Changes limited to issue scope
- [ ] Each commit focused on one logical change
- [ ] Tests added/updated for changes
- [ ] No unrelated files modified
- [ ] Mentor advice from initial review incorporated

### Before PR
- [ ] All checklist items complete
- [ ] Tests passing
- [ ] **Mentor Review**: `/mentor review implementation for #[ID]`
  - Blind spots? Edge cases? Ready for team review?
- [ ] Commits logical and well-messaged (max 3-5)

## Mentor Reviews

### Initial Review (before starting)
```
/mentor review requirements for #[ID]: [brief description]
```
**Findings:** [paste mentor feedback]
**Action taken:** [how you addressed concerns]

### Final Review (before PR)
```
/mentor review my implementation for #[ID]
```
**Findings:** [paste mentor feedback]
**Action taken:** [how you addressed concerns]

## Commits

Track commits for this issue:

| Commit | Description | Files |
|--------|-------------|-------|
| (none yet) | | |

## Notes

[Add notes as you work]
```

### Step 6: Output Summary

```
## Branch Created

**Branch:** feature/[id]-[description]
**Base:** [base-branch]
**Worktree:** [path or "No (use --worktree to create)"]

### Checklist Created
`.claude/issue-[id].md`

### Workflow

1. Work on this issue ONLY
2. Make small, focused commits
3. Run `/branch-status` to check progress
4. Run `/branch-done` when complete

### Rules

- ONE issue per branch
- Commit messages reference issue: "fix(#123): description"
- Found another issue? Create a new branch for it
- Keep commits small and logical

### Commands

| Command | Purpose |
|---------|---------|
| `/branch-status` | Check issue checklist progress |
| `/branch-done` | Complete branch, create PR |
| `/branch-list` | List all active branches/worktrees |
```

Execute the branch creation now.
