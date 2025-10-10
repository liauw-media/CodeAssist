# Git Branching Strategy Guide

*Complete guide to managing branches, PRs/MRs, and AI agent workflows for GitHub & GitLab*

---

## Overview

This guide explains how to handle branches (`main`, `develop`, `staging`), pull requests (GitHub) / merge requests (GitLab), and AI agent collaboration in different team setups.

**Terminology Note**:
- **GitHub** uses "Pull Requests" (PRs)
- **GitLab** uses "Merge Requests" (MRs)
- This guide uses "PR/MR" to refer to both
- Commands are provided for both platforms

---

## 🎯 Choose Your Strategy

### Quick Decision Matrix

| Scenario | Strategy | Branches | PR Required? |
|----------|----------|----------|--------------|
| Solo dev, rapid prototyping | **Simple** | `main` + feature branches | Optional |
| Small team (2-5), web app | **GitHub Flow** | `main` + feature branches | Yes |
| Team (5+), staged releases | **Git Flow** | `main`, `develop`, `staging`, features | Yes |
| Enterprise, multiple environments | **Git Flow Extended** | `main`, `develop`, `staging`, `qa`, features | Yes |

---

## Strategy 1: Simple (Solo/Small Projects)

### Branch Structure

```
main (stable, deployable)
  ├── feature/task-1
  ├── feature/task-2
  └── hotfix/bug-fix
```

### Setup

```bash
git branch -M main
git push -u origin main
```

### Daily Workflow

#### AI Agent Working on Task

```bash
# Agent creates feature branch
git checkout -b feature/add-authentication

# Agent commits code
git add .
git commit -m "feat: add JWT authentication - closes #5"

# Agent pushes branch
git push origin feature/add-authentication
```

#### User Merges (No PR)

```bash
# User reviews changes
git diff main..feature/add-authentication

# Merge directly to main
git checkout main
git merge feature/add-authentication
git push origin main

# Delete feature branch
git branch -d feature/add-authentication
git push origin --delete feature/add-authentication
```

### Pros/Cons

✅ **Pros**:
- Fast iteration
- Minimal overhead
- Good for solo developers

❌ **Cons**:
- No code review gate
- Can break main easily
- Not suitable for teams

---

## Strategy 2: GitHub Flow (Continuous Deployment)

### Branch Structure

```
main (always deployable, auto-deploys)
  ├── feature/task-1 (short-lived, 1-2 days)
  ├── feature/task-2
  └── hotfix/critical-bug
```

### Setup

```bash
# Initialize main branch
git branch -M main
git push -u origin main

# Set up branch protection (requires PR)
gh api repos/{owner}/{repo}/branches/main/protection \
  -X PUT \
  -f required_pull_request_reviews[required_approving_review_count]=1 \
  -f required_status_checks[strict]=true \
  -f enforce_admins=false

# Install pre-push hook to prevent direct pushes
cat > .git/hooks/pre-push <<'EOF'
#!/bin/bash
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ]; then
    echo "❌ ERROR: Direct push to 'main' is not allowed!"
    echo "Please use: git checkout -b feature/name && git push origin feature/name"
    exit 1
fi
exit 0
EOF
chmod +x .git/hooks/pre-push
```

### Daily Workflow

#### AI Agent Working on Task

```bash
# Agent creates feature branch from main
git checkout main
git pull origin main
git checkout -b feature/add-authentication

# Agent commits code (multiple commits OK)
git add .
git commit -m "feat: add JWT middleware"
git commit -m "feat: add auth endpoints"
git commit -m "test: add auth tests - closes #5"

# Agent pushes branch
git push origin feature/add-authentication

# Agent DOES NOT create PR - user does this
```

#### User Creates PR & Merges

```bash
# User creates PR
gh pr create --base main --head feature/add-authentication \
  --title "feat: Add JWT authentication" \
  --body "## Summary
Implements JWT authentication for API endpoints.

Closes #5

## Changes
- Added JWT middleware
- Created auth endpoints (login, register, refresh)
- Added comprehensive tests

## Testing
- [x] Unit tests pass
- [x] Integration tests pass
- [x] Manual testing completed"

# CI/CD runs tests automatically

# User reviews PR on GitHub
gh pr view 12 --web

# User merges via GitHub UI or CLI
gh pr merge 12 --squash --delete-branch

# Pull latest main
git checkout main
git pull origin main
```

### Pre-push Hook Protection

The pre-push hook prevents accidents:

```bash
# This will be blocked by hook
git checkout main
git push origin main
# ❌ ERROR: Direct push to 'main' is not allowed!

# Correct workflow
git checkout -b feature/new-feature
git push origin feature/new-feature
# ✅ Success
```

### Pros/Cons

✅ **Pros**:
- Always deployable main branch
- Code review enforced
- Clean git history
- Automatic CI/CD integration
- Great for continuous deployment

❌ **Cons**:
- No staging environment
- Can't batch features for release
- Every merge goes to production

---

## Strategy 3: Git Flow (Teams & Production Apps)

### Branch Structure

```
main (production, tagged releases)
  ↑
  PR (release/v1.0.0)
  ↑
staging (pre-production testing) [OPTIONAL]
  ↑
  PR (feature merge)
  ↑
develop (integration, latest features)
  ↑
  PR (feature merge)
  ↑
feature/* (development)

hotfix/* → main (emergency fixes)
```

### Setup

```bash
# Create branch structure
git branch -M main
git checkout -b develop
git push -u origin main
git push -u origin develop

# Optional: Create staging branch
git checkout -b staging
git push -u origin staging

# Protect all main branches
gh api repos/{owner}/{repo}/branches/main/protection \
  -X PUT \
  -f required_pull_request_reviews[required_approving_review_count]=2 \
  -f enforce_admins=true \
  -f required_status_checks[strict]=true

gh api repos/{owner}/{repo}/branches/develop/protection \
  -X PUT \
  -f required_pull_request_reviews[required_approving_review_count]=1

# Install pre-push hook
cat > .git/hooks/pre-push <<'EOF'
#!/bin/bash
PROTECTED_BRANCHES="main develop staging"
CURRENT_BRANCH=$(git branch --show-current)

for BRANCH in $PROTECTED_BRANCHES; do
    if [ "$CURRENT_BRANCH" = "$BRANCH" ]; then
        echo "❌ ERROR: Direct push to '$BRANCH' is not allowed!"
        echo "Use PR workflow: git checkout -b feature/name"
        exit 1
    fi
done
exit 0
EOF
chmod +x .git/hooks/pre-push
```

### Daily Workflow

#### AI Agent Working on Feature

```bash
# Agent creates feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/user-notifications

# Agent commits code
git add .
git commit -m "feat: add email notification system - closes #15"

# Agent pushes branch
git push origin feature/user-notifications

# Agent DOES NOT create PR
```

#### User Creates PR to Develop

```bash
# User creates PR to develop
gh pr create --base develop --head feature/user-notifications \
  --title "feat: Add user notification system" \
  --body "## Summary
Implements email notification system for user events.

Closes #15

## Changes
- Email service integration
- Notification templates
- Background job processing

## Testing
- [x] Unit tests pass
- [x] Integration tests pass
- [ ] Needs QA review"

# Team reviews PR
# User merges to develop after approval
gh pr merge 20 --squash --delete-branch
```

#### Release Workflow (Develop → Staging → Main)

```bash
# When develop is ready for release
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# Version bump and final tweaks
# Update version numbers in package.json, etc.
git commit -m "chore: bump version to 1.2.0"

# Push release branch
git push origin release/v1.2.0

# Create PR to staging (optional)
gh pr create --base staging --head release/v1.2.0 \
  --title "Release v1.2.0 to Staging" \
  --body "## Release v1.2.0

### Features
- User notifications (#15)
- Dark mode (#18)
- Performance improvements (#22)

### Bug Fixes
- Fixed login issue (#17)

Deploying to staging for QA testing."

# After staging testing passes, PR to main
gh pr create --base main --head release/v1.2.0 \
  --title "Release v1.2.0" \
  --body "## Release v1.2.0

✅ QA testing passed on staging

### Features
- User notifications
- Dark mode
- Performance improvements

### Bug Fixes
- Fixed login issue"

# After PR approved and merged to main
git checkout main
git pull origin main
git tag v1.2.0
git push origin v1.2.0

# Merge back to develop
git checkout develop
git merge main
git push origin develop

# Delete release branch
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

#### Hotfix Workflow (Emergency Production Fix)

```bash
# Critical bug found in production
git checkout main
git pull origin main
git checkout -b hotfix/critical-auth-bug

# Fix the bug
git add .
git commit -m "fix: resolve critical authentication bypass - closes #99"

# Push hotfix branch
git push origin hotfix/critical-auth-bug

# Create PR to main (expedited review)
gh pr create --base main --head hotfix/critical-auth-bug \
  --title "HOTFIX: Critical authentication bypass" \
  --body "## Critical Security Fix

Fixes authentication bypass vulnerability.

Closes #99

**Urgency**: HIGH - Security issue
**Testing**: Manual testing completed, unit tests added" \
  --label "hotfix,security"

# After merge to main
git checkout main
git pull origin main
git tag v1.2.1
git push origin v1.2.1

# Merge hotfix back to develop
git checkout develop
git merge main
git push origin develop

# Delete hotfix branch
git branch -d hotfix/critical-auth-bug
git push origin --delete hotfix/critical-auth-bug
```

### Pros/Cons

✅ **Pros**:
- Staged releases (QA on staging)
- Multiple features batched per release
- Clear production vs development separation
- Hotfix workflow for emergencies
- Great for teams and production apps

❌ **Cons**:
- More complex workflow
- Merge conflicts possible
- Slower release cycle
- Requires discipline

---

## AI Agent Guidelines

### What AI Agents WILL Do

✅ **Allowed Actions**:
- Create feature branches
- Commit code with proper messages
- Push feature branches to remote
- Update TASKS.md status
- Reference issue numbers (`closes #N`)
- Run tests locally
- Fix linting errors

### What AI Agents WILL NOT Do

❌ **Forbidden Actions**:
- Create Pull Requests (user responsibility)
- Merge PRs (requires human approval)
- Push directly to `main`, `develop`, or `staging`
- Delete branches (user decides when)
- Approve PRs (requires human review)
- Deploy to production (manual process)
- Bypass branch protection rules

### Why User Creates PRs

**Code Review Control**: You should review all code before it merges:
- Verify logic correctness
- Check for security issues
- Ensure tests are adequate
- Review commit history
- Confirm issue tracking

**Quality Gate**: PR creation is a deliberate quality checkpoint.

---

## Common Scenarios

### Scenario 1: AI Finishes Feature, User Wants to Test Before PR

```bash
# Agent pushes feature branch
git push origin feature/new-dashboard

# User pulls feature branch locally
git fetch origin
git checkout feature/new-dashboard

# User tests locally
npm run dev  # or python manage.py runserver

# If issues found, tell agent to fix
# If good, user creates PR
gh pr create --base develop --head feature/new-dashboard
```

### Scenario 2: Multiple AIs Working on Different Features

```bash
# AI Agent 1
git checkout develop
git checkout -b feature/authentication
git push origin feature/authentication

# AI Agent 2
git checkout develop
git checkout -b feature/payment-integration
git push origin feature/payment-integration

# User reviews and merges in order
gh pr create --base develop --head feature/authentication
gh pr merge 10 --squash
gh pr create --base develop --head feature/payment-integration
gh pr merge 11 --squash
```

### Scenario 3: Urgent Hotfix While Feature in Progress

```bash
# Feature in progress
git branch
# * feature/new-feature

# Save work
git add .
git commit -m "wip: partial implementation"
git push origin feature/new-feature

# Switch to hotfix
git checkout main
git checkout -b hotfix/critical-bug
# ... fix bug ...
git commit -m "fix: critical bug"
git push origin hotfix/critical-bug

# Create PR for hotfix (expedited review)
gh pr create --base main --head hotfix/critical-bug --label "hotfix"

# Return to feature work
git checkout feature/new-feature
# Continue development...
```

---

## Branch Protection Configuration

### GitHub Branch Protection Settings

**Via GitHub CLI**:
```bash
# Protect main branch
gh api repos/{owner}/{repo}/branches/main/protection \
  -X PUT \
  -f required_pull_request_reviews[required_approving_review_count]=2 \
  -f enforce_admins=true \
  -f required_status_checks[strict]=true \
  -f required_linear_history=true \
  -f allow_force_pushes=false

# Protect develop branch
gh api repos/{owner}/{repo}/branches/develop/protection \
  -X PUT \
  -f required_pull_request_reviews[required_approving_review_count]=1 \
  -f required_status_checks[strict]=true
```

**Main Branch** (Production):
- ✅ Require pull request reviews (2 approvers)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Enforce for administrators
- ✅ Require linear history (squash merges)
- ❌ Allow force pushes (never!)

**Develop Branch** (Integration):
- ✅ Require pull request reviews (1 approver)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ❌ Enforce for administrators (allow emergency merges)

**Staging Branch** (Optional):
- ✅ Require pull request reviews (1 approver)
- ✅ Require status checks to pass

### GitLab Branch Protection Settings

**Via GitLab CLI**:
```bash
# Protect main branch
glab api projects/:id/protected_branches --method POST \
  -f name=main \
  -f push_access_level=40 \
  -f merge_access_level=30 \
  -f allow_force_push=false

# Protect develop branch
glab api projects/:id/protected_branches --method POST \
  -f name=develop \
  -f push_access_level=40 \
  -f merge_access_level=30

# Set required approvals for main
glab api projects/:id --method PUT \
  -f approvals_before_merge=2
```

**Via Web UI**: **Settings → Repository → Protected Branches**

**Main Branch** (Production):
- **Allowed to merge**: Maintainers
- **Allowed to push**: No one
- **Allowed to force push**: No
- **Required approvals**: 2
- **Code owner approval**: Yes (if CODEOWNERS file exists)

**Develop Branch** (Integration):
- **Allowed to merge**: Developers + Maintainers
- **Allowed to push**: No one
- **Required approvals**: 1
- **Allow to force push**: No

**Staging Branch** (Optional):
- **Allowed to merge**: Developers + Maintainers
- **Allowed to push**: No one
- **Required approvals**: 1

**Access Levels** (GitLab):
- `0` = No access
- `30` = Developer
- `40` = Maintainer
- `50` = Owner

---

## Integration with TASKS.md

### Syncing Tasks with Branches

```markdown
## TASKS.md

- [ ] **Add user authentication**
  - Status: In Progress
  - Branch: `feature/authentication`
  - PR: [#12](https://github.com/org/repo/pull/12)
  - Started: 2025-01-21 10:00
  - Assignee: Claude AI

- [ ] **Add payment integration**
  - Status: Pending
  - Branch: Not started
  - Issue: [#15](https://github.com/org/repo/issues/15)
```

### Post-commit Hook Updates TASKS.md

```bash
# .git/hooks/post-commit
#!/bin/bash

# Update TASKS.md with current branch
CURRENT_BRANCH=$(git branch --show-current)
LAST_COMMIT=$(git log -1 --pretty=%B)

# Extract issue number from commit message
ISSUE=$(echo "$LAST_COMMIT" | grep -oP '(?<=closes #)\d+')

if [ -n "$ISSUE" ]; then
    # Mark task as completed in TASKS.md
    sed -i "s/- \[ \] \*\*.*#$ISSUE.*/- [x] **Task completed** - closes #$ISSUE/" TASKS.md
fi
```

---

## GitLab-Specific Features

### Merge Request Templates

Create `.gitlab/merge_request_templates/default.md`:

```markdown
## Summary
<!-- Brief description of changes -->

## Related Issues
Closes #

## Changes
-
-

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guide
- [ ] Documentation updated
- [ ] TASKS.md updated
- [ ] No breaking changes (or documented)
```

### GitLab CI/CD Integration

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - echo "Running tests..."
    - npm test # or pytest, phpunit, etc.
  only:
    - merge_requests
    - main
    - develop

build:
  stage: build
  script:
    - echo "Building application..."
    - npm run build
  only:
    - main
    - develop

deploy_staging:
  stage: deploy
  script:
    - echo "Deploying to staging..."
  only:
    - staging
  when: manual

deploy_production:
  stage: deploy
  script:
    - echo "Deploying to production..."
  only:
    - main
  when: manual
```

### GitLab CLI Commands Quick Reference

```bash
# Merge Requests
glab mr create --title "feat: Add feature" --description "Description"
glab mr list
glab mr view 123
glab mr merge 123
glab mr approve 123
glab mr close 123

# Issues
glab issue create --title "Bug report"
glab issue list
glab issue view 45
glab issue close 45

# CI/CD
glab ci view
glab ci trace
glab ci list

# Repository
glab repo view
glab repo clone user/repo
```

---

## Summary

| Strategy | Best For | Complexity | PR/MR Required | Branches |
|----------|----------|------------|----------------|----------|
| **Simple** | Solo, prototypes | Low | Optional | `main` + features |
| **GitHub/GitLab Flow** | Small teams, CI/CD | Medium | Yes | `main` + features |
| **Git Flow** | Teams, staged releases | High | Yes | `main`, `develop`, `staging` |

**Recommendation**: Start with **GitHub/GitLab Flow** for most projects. It's a good balance of simplicity and safety.

**Platform Choice**:
- **GitHub**: Better for open source, larger community, GitHub Actions
- **GitLab**: Better for self-hosted, built-in CI/CD, enterprise features
- Both work equally well with these branching strategies

---

## Quick Reference

### Feature Workflow (Git Flow)

```bash
git checkout develop && git pull
git checkout -b feature/task-name
# ... code ...
git commit -m "feat: description - closes #N"
git push origin feature/task-name
# User creates PR: gh pr create --base develop
```

### Hotfix Workflow

```bash
git checkout main && git pull
git checkout -b hotfix/bug-name
# ... fix ...
git commit -m "fix: description"
git push origin hotfix/bug-name
# User creates PR: gh pr create --base main --label hotfix
```

### Release Workflow

```bash
git checkout develop && git pull
git checkout -b release/v1.0.0
# ... version bump ...
git commit -m "chore: prepare v1.0.0"
git push origin release/v1.0.0
# User creates PR: gh pr create --base main
# After merge: git tag v1.0.0 && git push --tags
```

---

*Use this guide as a reference when setting up your project's branching strategy.*
