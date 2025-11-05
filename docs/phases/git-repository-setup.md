# Git Repository Setup Phase

*Complete guide for initializing Git repositories with GitHub/GitLab integration*

---

## Overview

This phase covers:
1. Local Git initialization
2. Remote repository creation (GitHub/GitLab)
3. Branch strategy setup
4. Initial commit

**Prerequisites**: Git installed, gh/glab CLI (optional but recommended)

---

## Step 1: Local Git Initialization

**Check if Git is already initialized**:
```bash
git status 2>/dev/null
```

**IF Git not initialized**:

```bash
# Initialize Git repository
git init

# Set default branch to main
git branch -M main
```

---

## Step 2: Create .gitignore

**Create language-specific .gitignore**:

### Python
```gitignore
# OS
.DS_Store
Thumbs.db

# IDEs
.vscode/
.idea/
*.swp

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/
.venv

# Testing
.pytest_cache/
.coverage
htmlcov/
*.cover

# Django
*.log
db.sqlite3
media/
staticfiles/

# Env
.env
.env.local
```

### PHP/Laravel
```gitignore
# OS
.DS_Store
Thumbs.db

# IDEs
.vscode/
.idea/
*.swp

# Laravel
/vendor/
/node_modules/
/public/storage
/storage/*.key
/public/hot
.env
.env.backup
.phpunit.result.cache
Homestead.json
Homestead.yaml
npm-debug.log
yarn-error.log

# Testing
coverage/
```

### JavaScript/Node.js
```gitignore
# OS
.DS_Store
Thumbs.db

# IDEs
.vscode/
.idea/
*.swp

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Next.js
.next/
out/
build/
dist/

# Testing
coverage/
.nyc_output/
```

---

## Step 3: Initial Commit

```bash
# Add .gitignore
git add .gitignore

# Create initial commit (NO AI co-author attribution)
git commit -m "chore: initialize repository"
```

**IMPORTANT**: Never add AI co-author or "Generated with Claude Code" attribution.

---

## Step 4: Remote Repository Setup

**Agent Question**:
> "Create remote repository? Select hosting:"

**Options**:
```
□ GitHub
□ GitLab (gitlab.com or self-hosted)
□ Skip (local only)
```

### Option A: GitHub

**Prerequisites**:
```bash
# Check if gh CLI is installed
gh --version

# If not: https://cli.github.com/
```

**Authentication**:
```bash
gh auth login
gh auth status
```

**Create Repository**:

**Agent Questions**:
1. Repository name? (default: current directory name)
2. Public or private? (default: public)
3. Description? (use project purpose from initialization)

**Commands**:
```bash
# Create repository
gh repo create [project-name] --public --description "[description]" --source=. --remote=origin --push

# Or step by step:
gh repo create [project-name] --public --description "[description]"
git remote add origin [repo-url]
git push -u origin main
```

**Verify**:
```bash
gh repo view
git remote -v
```

---

### Option B: GitLab

**Prerequisites**:
```bash
# Check if glab CLI is installed
glab --version

# If not: https://gitlab.com/gitlab-org/cli
```

**Authentication**:
```bash
# For gitlab.com
glab auth login

# For self-hosted
glab auth login --hostname gitlab.example.com

# Check status
glab auth status
```

**Create Repository**:

**Agent Questions**:
1. GitLab instance? (gitlab.com or self-hosted URL)
2. Repository name? (default: current directory name)
3. Group/namespace? (optional, for organization projects)
4. Visibility? (public/private/internal, default: private)
5. Description?

**Commands**:
```bash
# Personal repository
glab repo create [project-name] --public --description "[description]"

# Group repository
glab repo create [group]/[project-name] --private --description "[description]"

# Add remote and push
git remote add origin [gitlab-url]
git push -u origin main
```

**Verify**:
```bash
glab repo view
git remote -v
```

---

## Step 5: Branch Strategy Setup

**Agent Question**:
> "Select branching strategy:"

**Options**:
```
1. Simple (Solo/Small Team) - main + feature branches
2. Git Flow (Team/Production) - main/develop/staging
3. GitHub Flow (CI/CD) - main + PR workflow
4. Custom
```

### Strategy 1: Simple

**Best For**: Solo developers, small teams, rapid iteration

**Structure**:
- `main` - stable, deployable code
- `feature/*` - feature development
- `hotfix/*` - urgent fixes

**Setup**:
```bash
git branch -M main
git push -u origin main
```

**Workflow Documentation** (add to `.claude/CLAUDE.md`):
```markdown
## Git Workflow: Simple Strategy

- **main**: Stable code, deploy from here
- Work in feature branches: `git checkout -b feature/task-name`
- Merge to main: `git checkout main && git merge feature/task-name`
- Push: `git push origin main`
```

---

### Strategy 2: Git Flow

**Best For**: Teams, production apps, staged releases

**Structure**:
- `main` - production-ready code
- `develop` - integration branch
- `feature/*` - new features
- `release/*` - release preparation
- `hotfix/*` - production fixes

**Setup**:
```bash
# Create branches
git branch -M main
git checkout -b develop
git push -u origin main
git push -u origin develop

# Optional: Create staging
git checkout -b staging
git push -u origin staging
```

**Workflow Documentation** (add to `.claude/CLAUDE.md`):
```markdown
## Git Workflow: Git Flow

### Branches
- **main**: Production code only
- **develop**: Active development, integration
- **staging**: Pre-production testing (optional)
- **feature/***: New features (`git checkout -b feature/task-name develop`)
- **release/***: Release prep (`git checkout -b release/v1.0.0 develop`)
- **hotfix/***: Emergency fixes (`git checkout -b hotfix/critical-bug main`)

### Flow
1. Feature: develop → feature/x → develop (PR)
2. Release: develop → release/x → main + develop (PR)
3. Hotfix: main → hotfix/x → main + develop (PR)
```

---

### Strategy 3: GitHub Flow

**Best For**: Continuous deployment, agile teams

**Structure**:
- `main` - always deployable
- `feature/*` - feature branches, PR to main

**Setup**:
```bash
git branch -M main
git push -u origin main

# Enable branch protection on GitHub/GitLab
gh repo edit --enable-issues=true --enable-wiki=false
gh api repos/:owner/:repo/branches/main/protection -X PUT --input protection-rules.json
```

**Workflow Documentation** (add to `.claude/CLAUDE.md`):
```markdown
## Git Workflow: GitHub Flow

1. Always branch from `main`
2. Create descriptive branch: `git checkout -b feature/user-auth`
3. Commit often with clear messages
4. Open Pull Request early (for feedback)
5. Merge to `main` after approval
6. Deploy immediately from `main`
7. Delete feature branch after merge
```

---

## Step 6: Branch Protection Rules

**For GitHub**:
```bash
# Via gh CLI (create protection-rules.json first)
gh api repos/:owner/:repo/branches/main/protection -X PUT --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["ci/tests"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1
  },
  "restrictions": null
}
EOF
```

**For GitLab**:
```bash
# Via glab CLI
glab api projects/:id/protected_branches -X POST -f name=main -f push_access_level=40 -f merge_access_level=30
```

---

## Step 7: Documentation

**Update `.claude/CLAUDE.md`** with Git workflow:

```markdown
## Git Repository

- **Hosting**: [GitHub/GitLab]
- **Repository**: [org/repo-name]
- **Main Branch**: main
- **Strategy**: [Simple/Git Flow/GitHub Flow]

## Branching Strategy

[Include strategy-specific documentation from above]

## Commit Message Format

Use Conventional Commits:
- `feat(scope): add new feature`
- `fix(scope): resolve bug`
- `docs(scope): update documentation`
- `test(scope): add tests`
- `chore(scope): maintenance tasks`

**NEVER add AI co-author attribution in commits.**
```

---

## Quick Reference Commands

### Daily Workflow

```bash
# Start new feature
git checkout -b feature/my-feature

# Commit changes
git add .
git commit -m "feat: add feature description"

# Push to remote
git push -u origin feature/my-feature

# Create PR (GitHub)
gh pr create --title "feat: Add feature" --body "Description"

# Create MR (GitLab)
glab mr create --title "feat: Add feature" --description "Description"

# Merge and cleanup
git checkout main
git pull origin main
git branch -d feature/my-feature
```

---

## Troubleshooting

### Remote already exists
```bash
git remote remove origin
git remote add origin [new-url]
```

### Push rejected
```bash
git pull --rebase origin main
git push origin main
```

### gh/glab CLI not found
**GitHub**: https://cli.github.com/
**GitLab**: https://gitlab.com/gitlab-org/cli

**Alternative**: Create repositories manually via web UI, then:
```bash
git remote add origin [url]
git push -u origin main
```

---

## Next Steps

After Git repository setup:
1. ✅ Configure [Pre-commit Hooks](./pre-commit-hooks-setup.md)
2. ✅ Set up [Task Management System](./task-management-setup.md)
3. ✅ Initialize [Database Backup System](../database-backup-strategy.md)

---

*See [Git Branching Strategy Guide](../git-branching-strategy-guide.md) for advanced workflows.*
