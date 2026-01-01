# Branch Done

Complete work on current branch, verify checklist, prepare for merge.

## Execute

### Step 1: Verify Clean State

```bash
git status --porcelain
```

If uncommitted changes exist:
- Ask user to commit or stash
- Do NOT proceed

### Step 2: Load Checklist

Read `.claude/issue-[id].md` for current branch.

### Step 3: Run Verification

**Automated checks:**
```bash
# All tests pass
./scripts/safe-test.sh || npm test || pytest

# No merge conflicts with base
git fetch origin
git merge-base --is-ancestor origin/main HEAD && echo "Up to date" || echo "Needs rebase"
```

**Checklist review:**
Go through each item in the checklist and verify completion.

### Step 4: Commit Summary

```bash
# Show all commits on this branch
git log main..HEAD --oneline

# Show total changes
git diff main...HEAD --stat
```

### Step 5: Scope Verification

Ask user to confirm:

```
## Scope Verification

This branch contains [X] commits touching [Y] files.

**Intended scope:** [from checklist]

**Actual changes:**
- [file list]

Is everything in scope?
- If YES: proceed to PR
- If NO: suggest splitting branch
```

### Step 6: Prepare PR

If all checks pass:

```bash
# Push branch
git push -u origin [branch-name]

# Create PR (if using gh/glab)
gh pr create --title "[Issue ID]: [description]" --body "..."
# or
glab mr create --title "[Issue ID]: [description]" --description "..."
```

### Step 7: Cleanup Worktree (if applicable)

If this branch was in a worktree:

```
The worktree at [path] can be removed after merge:

git worktree remove [path]
```

### Step 8: Output

```
## Branch Complete

**Branch:** [name]
**Commits:** [count]
**Files:** [count]
**Tests:** ✓ Passing

### PR Created
[URL]

### Next Steps

1. Get code review
2. Address feedback (if any)
3. Merge PR
4. Delete branch: `git branch -d [name]`
5. Remove worktree (if used): `git worktree remove [path]`

### Checklist Archived

Moved `.claude/issue-[id].md` to `.claude/done/issue-[id].md`
```

Execute the completion workflow now.
