# Repository Security & Branch Protection Guide

*Complete guide to securing GitHub and GitLab repositories with branch protection, access controls, and security best practices*

---

## 📚 Overview

This guide covers how to secure your repositories and enforce proper workflows through branch protection rules, access controls, and security settings.

**Why Repository Security Matters**:
- ✅ **Prevent accidental pushes** to protected branches
- ✅ **Enforce code review** before merging
- ✅ **Require CI/CD checks** to pass
- ✅ **Control who can do what** with granular permissions
- ✅ **Protect production code** from unauthorized changes
- ✅ **Audit all changes** with required sign-offs

---

## 🎯 Branch Protection Strategies

### Strategy 1: Simple (Solo Developer)

**When to use**: Personal projects, rapid prototyping

**Protected branches**: `main`
- ❌ Direct commits allowed
- ❌ Force push allowed (be careful!)
- ❌ PR required: Optional

**Setup**: Minimal or no branch protection

---

### Strategy 2: GitHub/GitLab Flow (Small Teams)

**When to use**: 2-10 developers, continuous deployment

**Protected branches**: `main`
- ✅ Require PR/MR before merging
- ✅ Require 1 approval
- ✅ Require status checks to pass
- ❌ Allow force push: No
- ✅ Linear history (squash merges)

---

### Strategy 3: Git Flow (Large Teams, Production)

**When to use**: 10+ developers, staged releases

**Protected branches**: `main`, `develop`, `staging`
- ✅ Require PR/MR before merging
- ✅ Require 2 approvals (main), 1 approval (develop/staging)
- ✅ Require status checks to pass
- ✅ Require branch to be up to date
- ❌ Allow force push: No
- ✅ Enforce for administrators
- ✅ Code owner review required

---

## 🔐 GitHub Repository Security

### Step 1: Basic Repository Settings

**Go to**: Repository → Settings → General

```bash
# Via GitHub CLI
gh repo edit owner/repo --visibility private
gh repo edit owner/repo --enable-issues=true
gh repo edit owner/repo --enable-projects=false
gh repo edit owner/repo --enable-wiki=true
gh repo edit owner/repo --allow-squash-merge=true
gh repo edit owner/repo --allow-merge-commit=false
gh repo edit owner/repo --allow-rebase-merge=false
```

**Recommended settings**:
- ✅ **Visibility**: Private (for proprietary code)
- ✅ **Issues**: Enabled
- ✅ **Projects**: Optional
- ✅ **Wiki**: Enabled (for documentation)
- ✅ **Discussions**: Optional (for team communication)
- ✅ **Allow squash merging**: Yes
- ❌ **Allow merge commits**: No (keeps history clean)
- ❌ **Allow rebase merging**: No (prevents history rewriting)
- ✅ **Automatically delete head branches**: Yes

### Step 2: Branch Protection Rules

**Go to**: Repository → Settings → Branches → Add rule

#### Protect `main` Branch

**Via GitHub Web UI**:
1. Go to Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable the following:

**Via GitHub CLI**:
```bash
# Create branch protection rule for main
gh api repos/owner/repo/branches/main/protection \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks[strict]=true \
  -f required_status_checks[contexts][]=ci/test \
  -f required_status_checks[contexts][]=ci/lint \
  -f required_pull_request_reviews[required_approving_review_count]=2 \
  -f required_pull_request_reviews[dismiss_stale_reviews]=true \
  -f required_pull_request_reviews[require_code_owner_reviews]=true \
  -f enforce_admins=true \
  -f required_linear_history=true \
  -f allow_force_pushes[enabled]=false \
  -f allow_deletions[enabled]=false
```

**Branch protection settings for `main`**:

| Setting | Value | Purpose |
|---------|-------|---------|
| **Require pull request** | ✅ Yes | Force PR workflow |
| **Required approvals** | 2 | Multiple reviewers |
| **Dismiss stale reviews** | ✅ Yes | Re-review after changes |
| **Require code owner review** | ✅ Yes | Domain experts approve |
| **Require status checks** | ✅ Yes | CI/CD must pass |
| **Require branches up to date** | ✅ Yes | Prevent merge conflicts |
| **Require conversation resolution** | ✅ Yes | All comments addressed |
| **Require signed commits** | Optional | Extra security |
| **Require linear history** | ✅ Yes | Clean git history |
| **Enforce for admins** | ✅ Yes | No one bypasses |
| **Allow force pushes** | ❌ No | Prevent history rewriting |
| **Allow deletions** | ❌ No | Prevent branch deletion |

#### Protect `develop` Branch

```bash
gh api repos/owner/repo/branches/develop/protection \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks[strict]=true \
  -f required_status_checks[contexts][]=ci/test \
  -f required_pull_request_reviews[required_approving_review_count]=1 \
  -f required_pull_request_reviews[dismiss_stale_reviews]=true \
  -f enforce_admins=false \
  -f allow_force_pushes[enabled]=false
```

**Settings for `develop`**:
- Required approvals: 1 (less strict than main)
- Enforce for admins: No (allow emergency merges)

#### Protect `staging` Branch

Similar to `develop` but may have different CI/CD requirements.

### Step 3: Code Owners (CODEOWNERS)

Create `.github/CODEOWNERS`:

```
# Global owners (review all changes)
* @org/core-team

# Backend code
/backend/ @org/backend-team
/api/ @org/backend-team

# Frontend code
/frontend/ @org/frontend-team
/components/ @org/frontend-team

# Infrastructure
/docker/ @org/devops-team
/.github/ @org/devops-team
/gitlab/ @org/devops-team

# Documentation
/docs/ @org/documentation-team
*.md @org/documentation-team

# Specific critical files require admin approval
/package.json @org/admin
/composer.json @org/admin
/.env.example @org/admin
```

**How it works**:
- When a PR touches files, GitHub automatically requests review from code owners
- Code owner approval is required if enabled in branch protection
- Helps distribute review load across teams

### Step 4: Repository Roles & Permissions

**Go to**: Repository → Settings → Access → Collaborators

**Recommended role structure**:

| Role | Permissions | Who |
|------|-------------|-----|
| **Admin** | Full access, settings | Tech leads, DevOps |
| **Maintain** | Manage without destructive actions | Senior developers |
| **Write** | Push branches, create PRs | All developers |
| **Triage** | Manage issues and PRs | Community managers |
| **Read** | View and clone only | External collaborators |

**Set up teams** (Organization level):
```bash
# Create teams
gh api orgs/YOUR_ORG/teams -f name="backend-team" -f privacy="closed"
gh api orgs/YOUR_ORG/teams -f name="frontend-team" -f privacy="closed"
gh api orgs/YOUR_ORG/teams -f name="devops-team" -f privacy="closed"

# Add team to repository with specific role
gh api orgs/YOUR_ORG/teams/backend-team/repos/owner/repo \
  -X PUT \
  -f permission="push"
```

### Step 5: Security Features

**Go to**: Repository → Settings → Security

#### Enable Security Features:
- ✅ **Dependabot alerts**: Automatic vulnerability detection
- ✅ **Dependabot security updates**: Auto-PR for security fixes
- ✅ **Dependabot version updates**: Keep dependencies updated
- ✅ **Code scanning**: Automated code analysis (CodeQL)
- ✅ **Secret scanning**: Detect committed secrets

**Create `.github/dependabot.yml`**:
```yaml
version: 2
updates:
  # Enable version updates for npm
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10

  # Enable version updates for composer
  - package-ecosystem: "composer"
    directory: "/"
    schedule:
      interval: "weekly"

  # Enable version updates for pip
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"

  # Enable version updates for GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Step 6: Webhooks & Integrations

**Go to**: Repository → Settings → Webhooks

**Useful integrations**:
- Slack/Discord notifications
- CI/CD systems
- Project management tools (Jira, Linear)
- Code quality tools (SonarQube, CodeClimate)

### Step 7: Required Status Checks

**Configure in branch protection rules**

**Example: Require CI/CD to pass**:
```yaml
# .github/workflows/required-checks.yml
name: Required Checks

on:
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    name: ci/test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test

  lint:
    name: ci/lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run linter
        run: npm run lint
```

**Add these check names to branch protection**:
- `ci/test`
- `ci/lint`

---

## 🔐 GitLab Repository Security

### Step 1: Basic Project Settings

**Go to**: Project → Settings → General

```bash
# Via GitLab CLI
glab repo edit owner/repo --visibility private
glab repo edit owner/repo --issues-enabled=true
glab repo edit owner/repo --wiki-enabled=true
glab repo edit owner/repo --merge-method=ff
```

**Recommended settings**:
- ✅ **Visibility**: Private
- ✅ **Issues**: Enabled
- ✅ **Merge Requests**: Enabled
- ✅ **Wiki**: Enabled
- ✅ **CI/CD**: Enabled
- ✅ **Merge method**: Fast-forward merge
- ✅ **Squash commits on merge**: Optional
- ✅ **Delete source branch on merge**: Yes

### Step 2: Protected Branches

**Go to**: Settings → Repository → Protected Branches

#### Protect `main` Branch

**Via GitLab Web UI**:
1. Go to Settings → Repository → Protected Branches
2. Select branch: `main`
3. Configure protections

**Via GitLab CLI**:
```bash
# Protect main branch
glab api projects/:id/protected_branches --method POST \
  -f name=main \
  -f push_access_level=40 \
  -f merge_access_level=40 \
  -f allow_force_push=false \
  -f code_owner_approval_required=true

# Set merge request approvals
glab api projects/:id --method PUT \
  -f approvals_before_merge=2 \
  -f reset_approvals_on_push=true \
  -f disable_overriding_approvers_per_merge_request=false
```

**Branch protection settings for `main`**:

| Setting | Value | Purpose |
|---------|-------|---------|
| **Allowed to merge** | Maintainers only | Control who can merge |
| **Allowed to push** | No one | Force MR workflow |
| **Allowed to force push** | ❌ No | Prevent history rewriting |
| **Code owner approval** | ✅ Required | Domain experts approve |
| **Required approvals** | 2 | Multiple reviewers |

**Access levels** (GitLab):
- `0` = No access
- `30` = Developer
- `40` = Maintainer
- `50` = Owner

#### Protect `develop` Branch

```bash
glab api projects/:id/protected_branches --method POST \
  -f name=develop \
  -f push_access_level=40 \
  -f merge_access_level=30 \
  -f allow_force_push=false
```

**Settings for `develop`**:
- Allowed to merge: Developers + Maintainers
- Allowed to push: Maintainers only
- Required approvals: 1

### Step 3: Code Owners (CODEOWNERS)

Create `CODEOWNERS` file in root or `docs/` directory:

```
# Global owners
* @org/core-team

# Backend
/backend/ @org/backend-team
/api/ @org/backend-team

# Frontend
/frontend/ @org/frontend-team

# Infrastructure
/.gitlab-ci.yml @org/devops-team
/docker/ @org/devops-team

# Documentation
/docs/ @org/documentation-team
*.md @org/documentation-team
```

**Enable code owner approvals**:
```bash
glab api projects/:id --method PUT \
  -f code_owner_approval_required=true
```

### Step 4: Project Roles & Permissions

**Go to**: Project → Members

**GitLab role structure**:

| Role | Permissions | Who |
|------|-------------|-----|
| **Owner** | Full access | Project owners |
| **Maintainer** | Manage project, settings | Tech leads |
| **Developer** | Push branches, create MRs | All developers |
| **Reporter** | View code, create issues | Stakeholders |
| **Guest** | View issues only | External viewers |

**Add team members**:
```bash
# Add user to project
glab api projects/:id/members --method POST \
  -f user_id=USER_ID \
  -f access_level=30

# Add group to project
glab api projects/:id/share --method POST \
  -f group_id=GROUP_ID \
  -f group_access=30
```

### Step 5: Merge Request Approvals

**Go to**: Settings → Merge Requests → Approval Rules

**Create approval rules**:
```bash
# Create approval rule
glab api projects/:id/approval_rules --method POST \
  -f name="Backend Team Approval" \
  -f approvals_required=1 \
  -f rule_type="regular" \
  -f user_ids[]=USER_ID \
  -f protected_branch_ids[]=BRANCH_ID
```

**Approval settings**:
- **Approvals required**: 2 (main), 1 (develop)
- **Prevent approval by author**: ✅ Yes
- **Prevent approval by commit author**: ✅ Yes
- **Prevent editing approval rules in merge requests**: ✅ Yes
- **Reset approvals on new commits**: ✅ Yes
- **Remove all approvals when source branch is rebased**: ✅ Yes

### Step 6: Security Features

**Go to**: Settings → Security & Compliance

#### Enable Security Features:
- ✅ **Dependency scanning**: Detect vulnerable dependencies
- ✅ **Container scanning**: Scan Docker images
- ✅ **SAST** (Static Application Security Testing)
- ✅ **Secret detection**: Find committed secrets
- ✅ **License compliance**: Track open source licenses

**Add to `.gitlab-ci.yml`**:
```yaml
include:
  - template: Security/Dependency-Scanning.gitlab-ci.yml
  - template: Security/SAST.gitlab-ci.yml
  - template: Security/Secret-Detection.gitlab-ci.yml

stages:
  - test
  - security
  - deploy
```

### Step 7: Required Pipelines

**Go to**: Settings → Merge Requests

**Configure merge checks**:
- ✅ **Pipelines must succeed**: Required
- ✅ **All threads must be resolved**: Required
- ❌ **Prevent adding new commits**: Optional

**Merge request settings**:
```bash
glab api projects/:id --method PUT \
  -f only_allow_merge_if_pipeline_succeeds=true \
  -f only_allow_merge_if_all_discussions_are_resolved=true
```

---

## 🛡️ Pre-Push Hooks (Local Enforcement)

### Create Pre-Push Hook

**`.git/hooks/pre-push`**:

```bash
#!/bin/bash

# Pre-push hook to prevent direct pushes to protected branches

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

# Protected branches
PROTECTED_BRANCHES="main develop staging production"

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Detect platform (GitHub or GitLab)
REMOTE_URL=$(git config --get remote.origin.url)
if echo "$REMOTE_URL" | grep -q "gitlab"; then
    PLATFORM="GitLab"
    PR_COMMAND="glab mr create"
else
    PLATFORM="GitHub"
    PR_COMMAND="gh pr create"
fi

# Check if pushing to protected branch
for BRANCH in $PROTECTED_BRANCHES; do
    if [ "$CURRENT_BRANCH" = "$BRANCH" ]; then
        echo -e "${RED}╔════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║  ⚠️  PROTECTED BRANCH PUSH BLOCKED  ⚠️         ║${NC}"
        echo -e "${RED}╚════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${YELLOW}You attempted to push directly to: ${RED}$BRANCH${NC}"
        echo -e "${YELLOW}This branch is protected and requires a PR/MR workflow.${NC}"
        echo ""
        echo -e "${GREEN}✅ Correct workflow:${NC}"
        echo ""
        echo -e "  1. Create a feature branch:"
        echo -e "     ${GREEN}git checkout -b feature/your-feature-name${NC}"
        echo ""
        echo -e "  2. Commit your changes:"
        echo -e "     ${GREEN}git add .${NC}"
        echo -e "     ${GREEN}git commit -m 'feat: description'${NC}"
        echo ""
        echo -e "  3. Push feature branch:"
        echo -e "     ${GREEN}git push origin feature/your-feature-name${NC}"
        echo ""
        echo -e "  4. Create PR/MR on $PLATFORM:"
        echo -e "     ${GREEN}$PR_COMMAND --base $BRANCH${NC}"
        echo ""
        echo -e "${YELLOW}────────────────────────────────────────────────${NC}"
        echo -e "${YELLOW}Emergency bypass (USE WITH EXTREME CAUTION):${NC}"
        echo -e "  ${RED}git push --no-verify origin $BRANCH${NC}"
        echo -e "${YELLOW}Always document why bypass was necessary!${NC}"
        echo -e "${YELLOW}────────────────────────────────────────────────${NC}"
        echo ""
        exit 1
    fi
done

# All good - allow push
echo -e "${GREEN}✅ Push allowed to branch: $CURRENT_BRANCH${NC}"
exit 0
```

**Make executable**:
```bash
chmod +x .git/hooks/pre-push
```

**Install for all developers** (add to setup scripts):
```bash
# In your setup script
cp hooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

---

## 📋 Security Checklist

### GitHub Repository Security Checklist

- [ ] Repository visibility set (private for proprietary code)
- [ ] Branch protection enabled for `main`
- [ ] Branch protection enabled for `develop` (if using Git Flow)
- [ ] Required approvals configured (2 for main, 1 for develop)
- [ ] Required status checks configured
- [ ] CODEOWNERS file created and enforced
- [ ] Teams and roles configured
- [ ] Dependabot enabled (alerts + security updates)
- [ ] Code scanning enabled (CodeQL)
- [ ] Secret scanning enabled
- [ ] Pre-push hooks distributed to team
- [ ] Squash merge only (clean history)
- [ ] Auto-delete head branches enabled
- [ ] Signed commits enforced (optional)
- [ ] Linear history enforced

### GitLab Project Security Checklist

- [ ] Project visibility set (private for proprietary code)
- [ ] Protected branches configured (`main`, `develop`)
- [ ] Merge request approvals configured
- [ ] Code owner approvals enabled
- [ ] CODEOWNERS file created
- [ ] Project roles assigned
- [ ] Approval rules created
- [ ] Pipeline success required for merge
- [ ] Security scanning templates included
- [ ] Dependency scanning enabled
- [ ] SAST enabled
- [ ] Secret detection enabled
- [ ] Pre-push hooks distributed to team
- [ ] Fast-forward merge configured
- [ ] Delete source branch on merge enabled

---

## 🔧 Automation Scripts

### Check Branch Protection Status

**GitHub**:
```bash
#!/bin/bash
# check-github-protection.sh

REPO="owner/repo"

echo "Checking branch protection for: $REPO"
echo ""

# Check main branch
echo "=== Main Branch ==="
gh api repos/$REPO/branches/main/protection | jq '
{
  "Required PRs": .required_pull_request_reviews.required_approving_review_count,
  "Dismiss stale reviews": .required_pull_request_reviews.dismiss_stale_reviews,
  "Code owner review": .required_pull_request_reviews.require_code_owner_reviews,
  "Status checks required": (.required_status_checks.contexts | length),
  "Enforce for admins": .enforce_admins.enabled,
  "Linear history": .required_linear_history.enabled,
  "Force push allowed": .allow_force_pushes.enabled
}'
```

**GitLab**:
```bash
#!/bin/bash
# check-gitlab-protection.sh

PROJECT_ID="123"

echo "Checking branch protection for project: $PROJECT_ID"
echo ""

# Check main branch
echo "=== Main Branch ==="
glab api projects/$PROJECT_ID/protected_branches/main | jq '
{
  "Push access": .push_access_levels[0].access_level_description,
  "Merge access": .merge_access_levels[0].access_level_description,
  "Force push allowed": .allow_force_push,
  "Code owner approval": .code_owner_approval_required
}'

# Check approval settings
echo ""
echo "=== Approval Settings ==="
glab api projects/$PROJECT_ID | jq '
{
  "Approvals required": .approvals_before_merge,
  "Reset on push": .reset_approvals_on_push,
  "Prevent author approval": .merge_requests_author_approval,
  "Pipeline success required": .only_allow_merge_if_pipeline_succeeds
}'
```

---

## 📚 Best Practices

### General
1. ✅ **Start strict, relax if needed** - Easier to remove rules than add them
2. ✅ **Document bypass procedures** - For emergencies only
3. ✅ **Review protection rules quarterly** - Adapt as team grows
4. ✅ **Use CODEOWNERS** - Distribute review responsibility
5. ✅ **Require CI/CD** - Never merge failing code
6. ✅ **Train team on workflows** - Everyone follows same process
7. ✅ **Audit regularly** - Review who has what access

### GitHub-Specific
1. ✅ Use runner groups for self-hosted runners
2. ✅ Never use self-hosted runners for public repos
3. ✅ Enable Dependabot for all repositories
4. ✅ Use environments for deployment approvals

### GitLab-Specific
1. ✅ Use group/project runners appropriately
2. ✅ Enable security scanning templates
3. ✅ Use approval rules for different paths
4. ✅ Configure pipeline success requirement

---

## 🆘 Emergency Procedures

### Bypass Branch Protection (GitHub)

**When**: Production is down, critical security fix needed

```bash
# 1. Create emergency bypass (admin only)
gh api repos/owner/repo/branches/main/protection \
  -X PUT \
  -f enforce_admins=false

# 2. Push fix
git push origin main

# 3. IMMEDIATELY re-enable protection
gh api repos/owner/repo/branches/main/protection \
  -X PUT \
  -f enforce_admins=true

# 4. Create follow-up PR documenting the bypass
```

**Always**:
- Document in issue: Why bypass was necessary
- Create follow-up PR: Explain the emergency
- Review in post-mortem: How to prevent future bypasses

### Bypass Branch Protection (GitLab)

```bash
# 1. Temporarily unprotect (maintainer only)
glab api projects/:id/protected_branches/main --method DELETE

# 2. Push fix
git push origin main

# 3. IMMEDIATELY re-protect
glab api projects/:id/protected_branches --method POST \
  -f name=main \
  -f push_access_level=40 \
  -f merge_access_level=40

# 4. Document in merge request
```

---

*Secure repositories = secure code = secure products!*
