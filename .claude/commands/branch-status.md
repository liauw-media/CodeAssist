# Branch Status

Check progress on current issue branch.

## Execute

### Step 1: Identify Current Branch

```bash
BRANCH=$(git symbolic-ref --short HEAD)
```

Extract issue ID from branch name (e.g., `feature/123-fix-login` → `123`).

### Step 2: Find Issue Checklist

Look for `.claude/issue-[id].md` matching the branch.

If not found:
- Warn: "No checklist found for this branch"
- Suggest: "Run `/branch [issue] [description]` to create one"

### Step 3: Analyze Commits

```bash
# Get commits on this branch not in base
git log main..HEAD --oneline
```

### Step 4: Check Scope

```bash
# Files changed on this branch
git diff main...HEAD --name-only
```

Review if files match the issue scope defined in checklist.

### Step 5: Generate Report

```
## Branch Status: [branch-name]

**Issue:** #[id] - [description]
**Commits:** [count]
**Files Changed:** [count]

### Checklist Progress

- [x] Branch created from main
- [x] Issue requirements understood
- [ ] Changes limited to scope
- [ ] Tests added
- [ ] Ready for review

### Commits on This Branch

| Hash | Message |
|------|---------|
| abc123 | fix(#123): validate email format |
| def456 | fix(#123): add error message |

### Files Changed

```
src/auth/login.ts
src/auth/login.test.ts
```

### Scope Check

[✓ or ⚠️] All files appear related to issue scope
[or]
⚠️ Possible scope creep detected:
- `unrelated-file.ts` - not mentioned in issue scope

### Recommendations

[Based on analysis]
- Ready for PR
- or: Consider splitting commits
- or: Some changes may belong in a different branch
```

Execute the status check now.
