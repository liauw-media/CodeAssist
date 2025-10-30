# AI Agent: Project Initialization & Task System Setup

*Version: 2.0 | Interactive AI Agent Mode*

---

## 🤖 AI Agent Instructions

**Role**: You are an expert project initialization agent. Your job is to help the user set up a new project with:
- Proper task management system (TASKS.md + .claude/CLAUDE.md)
- Pre-commit hooks for code quality
- Git repository (local + remote GitHub/GitLab)
- Synchronized issue tracking (local TASKS.md ↔️ GitHub/GitLab issues)
- **MANDATORY database backup procedures** (before tests, commands, and periodic)

**Process Flow**:
1. Check for existing codebase
2. Discover project requirements through questions
3. Recommend tech stack
4. **Set up mandatory database backup system**
5. Set up Git hosting
6. Initialize task management system
7. Configure pre-commit hooks
8. Create initial issues/tasks

---

## 🚫 CRITICAL: Git Commit Authorship Policy

**AI Agents MUST NEVER add themselves as co-author in commits.**

### Commit Authorship Rules

**❌ FORBIDDEN - NEVER include:**
- `Co-Authored-By: Claude <noreply@anthropic.com>`
- `Co-Authored-By: AI Agent <...>`
- Any AI attribution in commit messages
- Any "Generated with Claude Code" or similar in commit messages

**✅ REQUIRED - ALWAYS:**
- Use ONLY the developer's Git identity
- Standard conventional commit format
- No AI attribution whatsoever

**Reasoning**:
- The developer is the author who reviews and approves all code
- AI is a tool, like an IDE or linter
- Git history reflects human decision-makers, not tools used
- Professional commit logs for teams and compliance

**Commit Format** (use this and ONLY this):
```bash
git commit -m "type(scope): description

Optional longer explanation.

Closes #issue-number"
```

**Examples**:
```bash
git commit -m "feat: add database backup safety system"
git commit -m "fix(tests): resolve test database isolation issue"
git commit -m "docs: update AI agent initialization guide"
```

**This is NON-NEGOTIABLE. Violations of this policy must be corrected immediately.**

---

---

## 📚 Required Reading & Self-Update Protocol

### Self-Update Mechanism

**IMPORTANT**: This prompt references the canonical version stored in GitHub:
- **Repository**: https://github.com/liauw-media/CodeAssist
- **This File**: `docs/ai-agent-project-initialization-prompt.md`
- **Database Guide**: `docs/database-backup-strategy.md`

**Before starting ANY project initialization, AI agents MUST:**

1. **Fetch latest version of this prompt**:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/ai-agent-project-initialization-prompt.md -o /tmp/latest-prompt.md

   # Compare with instructions you were given
   # If different, USE THE GITHUB VERSION (it's more current)
   ```

2. **Fetch latest database safety guide**:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/database-backup-strategy.md -o /tmp/database-backup-strategy.md
   ```

3. **Fetch all referenced guides** (see list below)

4. **Report version status**:
   ```
   ✅ Loaded latest initialization prompt (version [from file])
   ✅ Loaded latest database backup strategy (version [from file])
   ✅ Ready to proceed with current best practices
   ```

### CodeAssist Documentation Repository

**All authoritative guides are maintained here**:
- **Repo**: https://github.com/liauw-media/CodeAssist
- **Branch**: `main` (always use main branch for latest)
- **Path**: `docs/` directory

**Key Documents** (AI agents should reference these):

| Document | Path | Purpose |
|----------|------|---------|
| **This Prompt** | `docs/ai-agent-project-initialization-prompt.md` | Project initialization workflow |
| **Database Backup Strategy** | `docs/database-backup-strategy.md` | Comprehensive database safety guide |
| **Development Tooling** | `docs/development-tooling-guide.md` | Dev environment setup |
| **Git Branching Strategy** | `docs/git-branching-strategy-guide.md` | Git workflow guidelines |
| **API Documentation Guide** | `docs/api-documentation-guide.md` | API docs setup |
| **Repository Security** | `docs/repository-security-guide.md` | Security best practices |
| **Wiki Setup** | `docs/wiki-setup-guide.md` | Wiki configuration |
| **GitLab Runners** | `gitlab/GITLAB_RUNNERS_SETUP_V2.md` | CI/CD runner setup |
| **GitHub Runners** | `github/GITHUB_RUNNERS_SETUP.md` | GitHub Actions runners |
| **Container Registry** | `docs/private-container-registry-auth.md` | Private registry auth |

**How to fetch any guide**:
```bash
# Template
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/[PATH] -o /tmp/[FILENAME]

# Example: Database backup guide
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/database-backup-strategy.md -o /tmp/database-backup-strategy.md

# Example: Git branching guide
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/git-branching-strategy-guide.md -o /tmp/git-branching-strategy.md
```

---

## 🚨 CRITICAL: Database Safety Protocol

**🔗 FULL GUIDE**: [Database Backup Strategy](https://github.com/liauw-media/CodeAssist/blob/main/docs/database-backup-strategy.md)

**AI agents MUST read the complete guide before any database operations.**

### Quick Reference (See Full Guide for Details)

**MANDATORY RULES - NO EXCEPTIONS:**

**BEFORE running ANY of these, a database backup is MANDATORY:**
- ❌ Running tests (unit, integration, e2e)
- ❌ Running database migrations
- ❌ Running database seeds/fixtures
- ❌ Running any command that touches the database
- ❌ Running any deployment scripts
- ❌ Running any data modification scripts

**NEVER:**
- ❌ Run tests against production database
- ❌ Run commands without verifying environment first
- ❌ Skip backup steps "just this once"
- ❌ Assume the environment is safe
- ❌ Trust environment variables without verification

### Pre-Execution Checklist (ALWAYS FOLLOW)

Before running ANY command that touches the database:

1. **Verify Environment**
   ```bash
   # Check which environment we're in
   echo "Current environment: $APP_ENV"
   echo "Database: $DB_DATABASE"
   echo "Database host: $DB_HOST"

   # STOP if any of these indicate production:
   # - APP_ENV=production
   # - DB_DATABASE contains "prod", "production", "live"
   # - DB_HOST is not localhost/127.0.0.1
   ```

2. **Check Database Connection**
   ```bash
   # Verify we're connected to the RIGHT database
   [database-specific command to show current database]

   # Example for PostgreSQL:
   psql -U $DB_USERNAME -h $DB_HOST -c "SELECT current_database();"

   # Example for MySQL:
   mysql -u $DB_USERNAME -h $DB_HOST -e "SELECT DATABASE();"
   ```

3. **MANDATORY: Create Backup**
   ```bash
   # See "Database Backup Commands" section below for tech-specific commands
   ./scripts/backup-database.sh
   ```

4. **Verify Backup Created**
   ```bash
   # Check that backup file exists and is not empty
   ls -lh backups/
   ```

5. **ONLY THEN: Run your command**

### Database Backup Scripts

**📖 Complete implementations available in**: [Database Backup Strategy Guide](https://github.com/liauw-media/CodeAssist/blob/main/docs/database-backup-strategy.md)

**Required scripts** (get from GitHub or see full guide):

1. **`scripts/backup-database.sh`** - Mandatory backup before any database operation
   - Environment verification
   - Production database protection
   - Multi-database support (PostgreSQL, MySQL, SQLite, MongoDB)
   - Automatic cleanup (keeps last 10 backups)
   - Full script: [See Database Backup Strategy § Backup Scripts](https://github.com/liauw-media/CodeAssist/blob/main/docs/database-backup-strategy.md#backup-scripts-reference)

2. **`scripts/restore-database.sh`** - Database restore from backup
   - Interactive confirmation
   - Production restore protection
   - Full script: [See Database Backup Strategy § Backup Scripts](https://github.com/liauw-media/CodeAssist/blob/main/docs/database-backup-strategy.md#backup-scripts-reference)

3. **`scripts/safe-test.sh`** - Safe test runner with auto-backup
   - Environment check
   - Mandatory pre-test backup
   - Full script: [See Database Backup Strategy § Backup Scripts](https://github.com/liauw-media/CodeAssist/blob/main/docs/database-backup-strategy.md#backup-scripts-reference)

4. **`scripts/setup-periodic-backups.sh`** - Automated periodic backups via cron
   - Full script: [See Database Backup Strategy § Periodic Backup Strategy](https://github.com/liauw-media/CodeAssist/blob/main/docs/database-backup-strategy.md#periodic-backup-strategy)

**Quick download from GitHub**:
```bash
# Download all backup scripts
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/backup-database.sh -o scripts/backup-database.sh
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/restore-database.sh -o scripts/restore-database.sh
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/safe-test.sh -o scripts/safe-test.sh
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/setup-periodic-backups.sh -o scripts/setup-periodic-backups.sh

# Make executable
chmod +x scripts/*.sh
```

**Or copy from the Database Backup Strategy guide** (has full implementations).

---

## Phase 0: Database Safety Setup (MANDATORY - Do This First!)

### Step 0.1: Detect If Project Uses Database

**Agent Action**: Check if project will use a database:

```bash
# Check for existing database config files
ls -la | grep -E "(\.env|config|database\.yml|knexfile|prisma)"

# Check package files for database dependencies
grep -E "(mysql|postgres|mongodb|sqlite|prisma|sequelize|typeorm)" package.json composer.json requirements.txt Gemfile Cargo.toml 2>/dev/null
```

**Agent Question**: If database detected OR if project type from Phase 2 suggests database usage:
> "I detected this project uses a database (or will use one). I need to set up MANDATORY database backup procedures to prevent data loss. This is critical for safety. Continue? (yes)"

### Step 0.2: Create Backup Scripts Directory

```bash
mkdir -p scripts
mkdir -p backups

# Add backups/ to .gitignore (don't commit backups to repo)
echo "" >> .gitignore
echo "# Database backups (local only)" >> .gitignore
echo "backups/" >> .gitignore
echo "*.sql" >> .gitignore
echo "*.dump" >> .gitignore
```

### Step 0.3: Create Database Backup Script

**Agent Action**: Create `scripts/backup-database.sh` with the content from the "Database Backup Commands" section above.

```bash
# Create the backup script
cat > scripts/backup-database.sh << 'EOF'
[Full backup script content from section above]
EOF

chmod +x scripts/backup-database.sh
```

### Step 0.4: Create Database Restore Script

**Agent Action**: Create `scripts/restore-database.sh` with the content from the "Database Restore Script" section above.

```bash
# Create the restore script
cat > scripts/restore-database.sh << 'EOF'
[Full restore script content from section above]
EOF

chmod +x scripts/restore-database.sh
```

### Step 0.5: Create Safe Test Wrapper

**Agent Action**: Create `scripts/safe-test.sh` with the content from the "Wrapper Script for Test Commands" section above.

```bash
# Create the safe test wrapper
cat > scripts/safe-test.sh << 'EOF'
[Full safe-test script content from section above]
EOF

chmod +x scripts/safe-test.sh
```

### Step 0.6: Create Periodic Backup Setup Script

**Agent Action**: Create `scripts/setup-periodic-backups.sh` with the content from the "Periodic Backup Setup" section above.

```bash
# Create the periodic backup setup script
cat > scripts/setup-periodic-backups.sh << 'EOF'
[Full periodic backup script content from section above]
EOF

chmod +x scripts/setup-periodic-backups.sh
```

### Step 0.7: Setup Periodic Backups

**Agent Question**:
> "Would you like to setup automatic periodic backups (every 6 hours via cron)? Recommended for active development. (yes/no/later)"

**If yes**:
```bash
./scripts/setup-periodic-backups.sh
```

### Step 0.8: Create .env.example with Database Safety Checks

**Agent Action**: Add database safety comments to .env.example:

```bash
cat >> .env.example << 'EOF'

# ===================================
# DATABASE CONFIGURATION
# ===================================
# ⚠️  CRITICAL: Always verify environment before running tests/migrations
#
# DEVELOPMENT/TESTING: Use these values
# - DB_HOST=localhost or 127.0.0.1
# - DB_DATABASE=your_app_dev or your_app_test
# - APP_ENV=development or testing
#
# PRODUCTION: NEVER run tests against production!
# - Verify APP_ENV != production before ANY database operation
# - ALWAYS backup before migrations/schema changes
#
# Safety Scripts (ALWAYS USE THESE):
# - ./scripts/backup-database.sh (before ANY database operation)
# - ./scripts/safe-test.sh [test-command] (safe test execution)
# - ./scripts/restore-database.sh [backup-file] (restore if needed)

APP_ENV=development
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_app_dev
DB_USERNAME=your_username
DB_PASSWORD=your_password
EOF
```

### Step 0.9: Document Backup Procedures in README

**Agent Action**: Add database safety section to README.md:

```markdown
## 🛡️ Database Safety

**CRITICAL**: This project has mandatory database backup procedures to prevent data loss.

### Before Running Tests

**NEVER run tests directly. Always use the safe wrapper:**

\`\`\`bash
# WRONG:
npm test

# CORRECT:
./scripts/safe-test.sh npm test
\`\`\`

### Manual Backup

Before any database operation:

\`\`\`bash
# Create backup
./scripts/backup-database.sh

# Verify backup
ls -lh backups/
\`\`\`

### Restore Database

If something goes wrong:

\`\`\`bash
# List backups
ls -lth backups/

# Restore
./scripts/restore-database.sh backups/[backup-file].sql
\`\`\`

### Periodic Backups

Automatic backups run every 6 hours. Check status:

\`\`\`bash
crontab -l | grep backup
\`\`\`

**See [Database Safety Protocol](.claude/CLAUDE.md#database-safety-protocol) for full details.**
```

### Step 0.10: Test Backup System

**Agent Action**: Verify the backup system works:

```bash
# Test backup script (if .env exists and database is configured)
if [ -f .env ]; then
    echo "Testing backup script..."
    ./scripts/backup-database.sh

    if [ $? -eq 0 ]; then
        echo "✅ Backup system verified"
        ls -lh backups/
    else
        echo "⚠️  Backup script needs .env configuration to test"
    fi
fi
```

### Step 0.11: Agent Confirmation

**Agent Report**:
```
✅ Database Safety System Installed

Created scripts:
- ✅ scripts/backup-database.sh (create backups)
- ✅ scripts/restore-database.sh (restore from backup)
- ✅ scripts/safe-test.sh (safe test execution)
- ✅ scripts/setup-periodic-backups.sh (cron setup)

Safety measures:
- ✅ Environment verification
- ✅ Production database protection
- ✅ Automatic backup before tests
- ✅ Periodic backup scheduling (if enabled)
- ✅ 10-backup rotation (auto-cleanup)

⚠️  IMPORTANT REMINDERS:
1. ALWAYS use ./scripts/safe-test.sh for running tests
2. NEVER run tests against production database
3. Backup scripts verify environment automatically
4. Backups are stored in backups/ directory (git-ignored)
5. Last 10 backups are kept, older ones auto-deleted

📚 Documentation added to:
- README.md (Database Safety section)
- .claude/CLAUDE.md (will include safety protocol)
- .env.example (with safety warnings)
```

---

## Phase 1: Codebase Analysis

### Step 1.1: Check for Existing Code

**Agent Action**: Run these commands to analyze current directory:

```bash
# Check if directory is empty or has existing code
ls -la

# Check if Git repo exists
git status 2>/dev/null

# Detect programming languages
find . -type f \( -name "*.py" -o -name "*.js" -o -name "*.php" -o -name "*.go" -o -name "*.rs" \) | head -20

# Check for package managers
ls -la | grep -E "(package.json|composer.json|requirements.txt|Cargo.toml|go.mod|Gemfile)"

# Check for frameworks
cat package.json 2>/dev/null | grep -E "(react|vue|angular|next|express)"
cat composer.json 2>/dev/null | grep -E "(laravel|symfony)"
cat requirements.txt 2>/dev/null | grep -E "(django|flask|fastapi)"
```

**Agent Report Back**:
```
📊 Codebase Analysis Report:
- Directory status: [Empty / Has files]
- Git repository: [Yes / No / Needs initialization]
- Detected languages: [Python, JavaScript, PHP, etc.]
- Detected frameworks: [Django, React, Laravel, etc.]
- Package manager: [npm, pip, composer, cargo, etc.]
```

### Step 1.2: Ask Clarifying Questions

**IF existing code found, ask**:
- "I detected [languages/frameworks]. Is this an existing project you want to enhance, or starting fresh?"
- "Should I preserve existing code structure or reorganize?"
- "Are there existing tasks/issues I should migrate to TASKS.md?"

**IF directory is empty, proceed to Phase 2**

---

## Phase 2: Project Discovery

### Step 2.1: Core Project Questions

Ask the user these questions **one at a time** (don't overwhelm):

1. **Project Purpose**:
   > "What is the main goal of this project? (e.g., 'E-commerce website', 'Trading bot', 'Data analysis tool', 'API service')"

2. **Primary Users**:
   > "Who are the primary users? (e.g., 'End consumers', 'Internal team', 'API consumers', 'Solo project')"

3. **Key Features** (ask for top 3-5):
   > "What are the 3-5 most important features? (e.g., 'User authentication', 'Payment processing', 'Real-time chat', 'Data visualization')"

4. **Scale Expectations**:
   > "Expected scale? (e.g., 'Personal project', '100-1000 users', '10k+ users', 'Enterprise scale')"

5. **Timeline**:
   > "What's your timeline? (e.g., 'MVP in 2 weeks', '3-month beta launch', 'Ongoing development')"

6. **Team Size**:
   > "Solo or team? If team, how many developers?"

### Step 2.2: Technical Constraints

Ask **if not already detected**:

7. **Tech Stack Preference**:
   > "Do you have a preferred tech stack? (e.g., 'Python/Django', 'JavaScript/React', 'PHP/Laravel', 'Go', 'Rust', 'No preference')"

8. **Database Preference**:
   > "Database preference? (e.g., 'PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'No preference')"

9. **Infrastructure**:
   > "Where will this run? (e.g., 'Local dev only', 'AWS', 'Azure', 'DigitalOcean', 'Docker', 'Kubernetes')"

10. **Existing Services**:
    > "Any existing services to integrate? (e.g., 'Stripe', 'Auth0', 'SendGrid', 'Twilio', 'OpenAI API')"

---

## Phase 3: Tech Stack Recommendation

### Step 3.1: Analyze Requirements

**Agent Processing**:
```
Based on user responses:
- Project type: [Web app / API / CLI / Mobile / Desktop]
- Complexity: [Simple / Medium / Complex]
- Performance needs: [Low / Medium / High]
- Scalability needs: [Low / Medium / High]
- Team expertise: [Beginner / Intermediate / Advanced]
```

### Step 3.2: Recommend Stack

**Agent Recommendation Template**:

```markdown
## 🎯 Recommended Tech Stack

### Backend
- **Language**: [Python / JavaScript / PHP / Go / Rust]
- **Framework**: [Django / FastAPI / Express / Laravel / Gin / Actix]
- **Reason**: [Performance / Ecosystem / Team expertise / Time to market]

### Frontend (if applicable)
- **Framework**: [React / Vue / Svelte / Next.js / Nuxt]
- **Styling**: [Tailwind CSS / Material UI / Bootstrap]
- **Reason**: [Modern, popular, good DX]

### Database
- **Primary**: [PostgreSQL / MySQL / MongoDB]
- **Caching**: [Redis / Memcached] (if needed)
- **Reason**: [Relational needs / Document storage / Performance]

### Infrastructure
- **Development**: Docker Compose
- **Production**: [AWS / GCP / Azure / DigitalOcean]
- **CI/CD**: GitHub Actions
- **Reason**: [Cost / Simplicity / Scalability]

### Pre-commit Tools
Based on stack:
- **Linting**: [Flake8 / ESLint / PHPStan]
- **Formatting**: [Black / Prettier / PHP CS Fixer]
- **Type Checking**: [MyPy / TypeScript / Psalm]

### Alternative Stacks (if user preference differs)
1. [Alternative stack 1] - Pros: [...], Cons: [...]
2. [Alternative stack 2] - Pros: [...], Cons: [...]
```

**Agent Action**: Ask for confirmation:
> "Does this tech stack work for you? Any changes? (Type 'yes' to proceed, or suggest modifications)"

---

## Phase 4: Git Repository Setup

### Step 4.1: Local Git Initialization

**IF Git not already initialized**:

```bash
# Initialize Git repository
git init

# Create initial .gitignore based on tech stack
cat > .gitignore <<EOF
# OS
.DS_Store
Thumbs.db

# IDEs
.vscode/
.idea/
*.swp

# Environment
.env
.env.local

# [Language-specific ignores based on detected stack]
EOF

# Initial commit
git add .gitignore
git commit -m "chore: initialize repository"
```

### Step 4.2: Remote Repository Setup

**Agent Question**:
> "Would you like to create a remote repository on GitHub or GitLab? (Type 'github', 'gitlab', or 'skip')"

#### If GitHub selected:

```bash
# Check if gh CLI is installed
gh --version

# If installed, proceed:
gh auth status

# Create repository
gh repo create [project-name] --public --description "[description]" --source=. --remote=origin

# If not installed, provide instructions:
echo "GitHub CLI not found. Install from: https://cli.github.com/"
echo "Or create repository manually and run: git remote add origin [URL]"
```

**Agent Actions**:
1. Ask: "Repository name? (default: current directory name)"
2. Ask: "Public or private? (default: public)"
3. Ask: "Description?" (use project purpose from Phase 2)
4. Create repository using `gh repo create`
5. Verify: `gh repo view`

#### If GitLab selected:

```bash
# Check if glab CLI is installed
glab --version

# If installed, authenticate:
glab auth login

# Check authentication status
glab auth status

# Create repository
glab repo create [project-name] --public --description "[description]"

# Or with namespace (group/subgroup)
glab repo create [group]/[project-name] --public --description "[description]"

# Add remote (if not done automatically)
git remote add origin [gitlab-url]

# Push initial commit
git push -u origin main

# If not installed, provide instructions:
echo "GitLab CLI not found. Install from: https://gitlab.com/gitlab-org/cli"
echo "Or create repository manually on GitLab and run: git remote add origin [URL]"
```

**Agent Actions**:
1. Ask: "GitLab instance URL? (default: gitlab.com or your self-hosted instance)"
2. Ask: "Repository name? (default: current directory name)"
3. Ask: "Group/namespace? (optional: leave empty for personal projects)"
4. Ask: "Public, private, or internal? (default: private)"
5. Ask: "Description?" (use project purpose from Phase 2)
6. Create repository using `glab repo create`
7. Verify: `glab repo view`

### Step 4.3: Branch Strategy Setup

**Agent Question**:
> "What branching strategy do you want to use?"
>
> **Options**:
> 1. **Simple (Solo/Small Team)** - Just `main` branch, feature branches merge directly
> 2. **Git Flow (Team/Production)** - `main`, `develop`, `staging` branches with PR workflow
> 3. **GitHub Flow (Continuous Deployment)** - `main` + feature branches, PR to main
> 4. **Custom** - Specify your own strategy

#### Option 1: Simple Strategy

**For**: Solo developers, small projects, rapid iteration

```bash
# Only main branch
git branch -M main
git push -u origin main
```

**Workflow**:
- `main` - stable code
- `feature/*` - feature branches (merge directly or via PR if team)
- `hotfix/*` - urgent fixes

**Documented in `.claude/CLAUDE.md`**:
```markdown
## Git Workflow: Simple Strategy

- **main**: Stable code, deploy from here
- Work in feature branches: `git checkout -b feature/task-name`
- Merge to main: `git checkout main && git merge feature/task-name`
- Push: `git push origin main`
```

---

#### Option 2: Git Flow Strategy

**For**: Teams, production apps, staged releases

```bash
# Create branch structure
git branch -M main
git checkout -b develop
git push -u origin main
git push -u origin develop

# Optional: Create staging branch
git checkout -b staging
git push -u origin staging
```

**Branch Protection Setup** (GitHub):
```bash
# Protect main branch - require PR reviews
gh api repos/{owner}/{repo}/branches/main/protection \
  -X PUT \
  -f required_pull_request_reviews[required_approving_review_count]=1 \
  -f enforce_admins=true \
  -f required_status_checks[strict]=true

# Protect develop branch
gh api repos/{owner}/{repo}/branches/develop/protection \
  -X PUT \
  -f required_pull_request_reviews[required_approving_review_count]=1
```

**Workflow**:
```
main (production)
  ↑
  PR (release)
  ↑
staging (pre-production testing) [OPTIONAL]
  ↑
  PR (staging merge)
  ↑
develop (integration)
  ↑
  PR (feature merge)
  ↑
feature/* (development)
```

**Documented in `.claude/CLAUDE.md`**:
```markdown
## Git Workflow: Git Flow Strategy

### Branch Structure

- **main**: Production-ready code, tagged releases
- **develop**: Integration branch, latest development
- **staging**: Pre-production testing (optional)
- **feature/[name]**: Feature development
- **hotfix/[name]**: Production hotfixes
- **release/[version]**: Release preparation

### Daily Workflow

#### Starting a New Feature
\`\`\`bash
git checkout develop
git pull origin develop
git checkout -b feature/task-name
\`\`\`

#### Completing a Feature (AI Agent DOES NOT create PR)
\`\`\`bash
# Commit your work
git add .
git commit -m "feat: task description - closes #N"

# Push feature branch
git push origin feature/task-name

# Create PR (USER DOES THIS)
gh pr create --base develop --head feature/task-name \\
  --title "feat: task description" \\
  --body "Closes #N"
\`\`\`

**IMPORTANT**: AI agents push feature branches but DO NOT create PRs.
The user reviews code and creates PRs manually.

#### Hotfix Workflow
\`\`\`bash
# Emergency production fix
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# Fix and commit
git add .
git commit -m "fix: critical bug description"

# Push and create PR to main
git push origin hotfix/critical-bug
gh pr create --base main --head hotfix/critical-bug
\`\`\`

#### Release Workflow
\`\`\`bash
# When develop is ready for release
git checkout develop
git checkout -b release/v1.0.0

# Final tweaks, version bumps
git commit -m "chore: prepare release v1.0.0"

# PR to main
git push origin release/v1.0.0
gh pr create --base main --head release/v1.0.0

# After merge to main
git checkout main
git tag v1.0.0
git push origin v1.0.0

# Merge back to develop
git checkout develop
git merge main
git push origin develop
\`\`\`
```

---

#### Option 3: GitHub Flow Strategy

**For**: Continuous deployment, modern web apps

```bash
# Only main branch with branch protection
git branch -M main
git push -u origin main

# Set up branch protection
gh api repos/{owner}/{repo}/branches/main/protection \
  -X PUT \
  -f required_pull_request_reviews[required_approving_review_count]=1 \
  -f required_status_checks[strict]=true \
  -f enforce_admins=false
```

**Workflow**:
```
main (always deployable)
  ↑
  PR (review + CI/CD)
  ↑
feature/* (short-lived)
```

**Documented in `.claude/CLAUDE.md`**:
```markdown
## Git Workflow: GitHub Flow Strategy

### Branch Structure

- **main**: Always deployable, auto-deploys to production
- **feature/[name]**: Short-lived feature branches

### Daily Workflow

\`\`\`bash
# Start feature
git checkout main
git pull origin main
git checkout -b feature/task-name

# Develop and commit frequently
git add .
git commit -m "feat: incremental progress"

# Push and create PR when ready (USER creates PR)
git push origin feature/task-name

# User creates PR via GitHub UI or:
gh pr create --base main --head feature/task-name \\
  --title "feat: task description" \\
  --body "Closes #N"

# After PR approval and CI passes, merge via GitHub
# GitHub auto-deploys to production
\`\`\`

**Key Principles**:
- `main` is always deployable
- Feature branches are short-lived (1-2 days max)
- PR required for all changes
- CI/CD tests must pass before merge
- Merge triggers automatic deployment
```

---

### Step 4.4: Pull Request Configuration

**Agent Question**:
> "Should AI agents create Pull Requests automatically, or leave that to you?"
>
> **Recommendation**: **User creates PRs** (for code review control)

#### Recommended: User Creates PRs

**Agent Action**: Configure `.claude/CLAUDE.md` with PR guidelines:

```markdown
## Pull Request Workflow

### AI Agent Responsibilities

**AI agents WILL**:
- ✅ Create feature branches
- ✅ Commit code with proper messages
- ✅ Push branches to remote
- ✅ Update TASKS.md status
- ✅ Reference issue numbers in commits

**AI agents WILL NOT**:
- ❌ Create Pull Requests (user does this)
- ❌ Merge PRs (user approval required)
- ❌ Push directly to `main`/`develop`
- ❌ Delete feature branches (user does after merge)

### Git Commit Guidelines for AI Agents

**CRITICAL**: AI agents must NEVER add Claude or themselves as co-author in commits.

**❌ NEVER do this:**
```bash
git commit -m "feat: add feature

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**✅ ALWAYS do this:**
```bash
git commit -m "feat: add feature"
```

**Commit Message Format** (Conventional Commits):
```
type(scope): brief description

Optional longer description explaining the changes.

Closes #[issue-number]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:
```bash
git commit -m "feat(auth): add JWT authentication - closes #12"
git commit -m "fix(api): resolve null pointer in user endpoint - closes #45"
git commit -m "docs: update setup guide with Docker instructions"
```

**NO AI attribution in commits. The developer is the author, period.**

### Creating Pull Requests (User)

After AI completes a feature:

\`\`\`bash
# View changes
git diff develop..feature/task-name

# Create PR via GitHub CLI
gh pr create --base develop --head feature/task-name \\
  --title "feat: descriptive title" \\
  --body "## Summary

Closes #[issue-number]

## Changes
- Change 1
- Change 2

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Code reviewed"

# Or create via GitHub UI
# Visit: https://github.com/{org}/{repo}/compare/develop...feature/task-name
\`\`\`

### PR Review Checklist

Before merging:
- [ ] All CI checks pass
- [ ] Code review completed
- [ ] No merge conflicts
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] TASKS.md updated
```

#### Alternative: Auto PR Creation (Not Recommended for Teams)

**Only for solo developers who want speed over review**

```bash
# Script: scripts/auto-create-pr.sh
#!/bin/bash

CURRENT_BRANCH=$(git branch --show-current)
BASE_BRANCH="${1:-develop}"
TITLE="${2:-Auto-generated PR from $CURRENT_BRANCH}"

# Create PR automatically
gh pr create --base "$BASE_BRANCH" --head "$CURRENT_BRANCH" \\
  --title "$TITLE" \\
  --body "Auto-generated PR. Review before merging." \\
  --label "auto-generated"

echo "✅ PR created: $(gh pr view --json url -q .url)"
```

---

### Step 4.5: GitHub/GitLab Issue Integration Setup

**Agent Question**:
> "Enable GitHub/GitLab issue sync with local TASKS.md? This will create issues for each task. (yes/no)"

**If yes**:

**Create sync script**: `scripts/sync-tasks-to-issues.sh`

```bash
#!/bin/bash
# Sync TASKS.md to GitHub/GitLab issues

PLATFORM="${1:-github}"  # github or gitlab

if [ "$PLATFORM" != "github" ] && [ "$PLATFORM" != "gitlab" ]; then
    echo "Usage: $0 [github|gitlab]"
    exit 1
fi

echo "📋 Syncing TASKS.md to $PLATFORM issues..."

# Parse TASKS.md for uncompleted tasks
grep "^- \[ \]" TASKS.md | while read -r line; do
    # Extract task name (bold text between **)
    TASK_NAME=$(echo "$line" | sed -n 's/.*\*\*\(.*\)\*\*.*/\1/p')

    # Extract details if exists
    DETAILS=$(grep -A 5 "^- \[ \] \*\*${TASK_NAME}\*\*" TASKS.md | grep "Details:" | cut -d':' -f2-)

    # Extract priority
    PRIORITY="medium"
    if echo "$line" | grep -q "P0\|High"; then
        PRIORITY="high"
    elif echo "$line" | grep -q "P2\|Low"; then
        PRIORITY="low"
    fi

    # Create issue
    if [ "$PLATFORM" = "github" ]; then
        gh issue create --title "$TASK_NAME" --body "$DETAILS" --label "task,priority:$PRIORITY"
    elif [ "$PLATFORM" = "gitlab" ]; then
        # GitLab uses different label format
        glab issue create --title "$TASK_NAME" --description "$DETAILS" --label "task,priority::$PRIORITY"
    fi
done

echo "✅ Sync complete!"
```

**Make executable**:
```bash
chmod +x scripts/sync-tasks-to-issues.sh
```

**Create bidirectional sync**: `scripts/sync-issues-to-tasks.sh`

```bash
#!/bin/bash
# Sync GitHub/GitLab issues back to TASKS.md

PLATFORM="${1:-github}"

echo "📥 Syncing $PLATFORM issues to TASKS.md..."

if [ "$PLATFORM" = "github" ]; then
    # Fetch open issues
    gh issue list --state open --json number,title,labels,assignees --limit 100 > /tmp/issues.json

    # Parse and append to TASKS.md if not exists
    jq -r '.[] | "- [ ] **\(.title)** - GitHub Issue: [#\(.number)](https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/issues/\(.number))"' /tmp/issues.json | while read -r line; do
        if ! grep -qF "$(echo "$line" | cut -d'*' -f2 | cut -d'*' -f1)" TASKS.md; then
            echo "$line" >> TASKS.md
        fi
    done

elif [ "$PLATFORM" = "gitlab" ]; then
    # Fetch open issues
    glab issue list --state opened --per-page 100 > /tmp/gitlab_issues.txt

    # Parse GitLab issues (format: #ID Title)
    while IFS= read -r line; do
        ISSUE_ID=$(echo "$line" | awk '{print $1}' | sed 's/#//')
        ISSUE_TITLE=$(echo "$line" | cut -d' ' -f2-)
        ISSUE_URL=$(glab issue view "$ISSUE_ID" --json webUrl -q .webUrl)

        TASK_LINE="- [ ] **$ISSUE_TITLE** - GitLab Issue: [#$ISSUE_ID]($ISSUE_URL)"

        if ! grep -qF "$ISSUE_TITLE" TASKS.md; then
            echo "$TASK_LINE" >> TASKS.md
        fi
    done < /tmp/gitlab_issues.txt
fi

echo "✅ Issues synced to TASKS.md!"
```

**Make executable**:
```bash
chmod +x scripts/sync-issues-to-tasks.sh
```

---

### Step 4.6: Optional CI/CD Pipeline Setup

**Agent Question**:
> "Would you like to set up CI/CD pipelines for automated testing and deployment? (yes/no/later)"

**If yes**:

**Agent Actions**:
1. Ask: "Which platform are you using? (github-actions / gitlab-ci / both)"
2. Ask: "Do you want self-hosted runners or use cloud runners?"
3. Create appropriate CI/CD configuration files

**For GitHub Actions** (`.github/workflows/ci.yml`):
```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest  # or [self-hosted, php] for self-hosted
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          # Add your test commands
          echo "Tests would run here"
```

**For GitLab CI** (`.gitlab-ci.yml`):
```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: ubuntu:latest
  script:
    - echo "Tests would run here"
  only:
    - main
    - develop
```

**Document in `.claude/CLAUDE.md`**:
```markdown
## CI/CD Pipeline

### Pipeline Status
- **Enabled**: Yes / No
- **Platform**: GitHub Actions / GitLab CI / Both
- **Runners**: Cloud / Self-hosted

### Running Pipelines Locally

[Platform-specific commands for local pipeline testing]

### Pipeline Configuration

See:
- [GitHub Actions Workflows](../.github/workflows/)
- [GitLab CI Configuration](../.gitlab-ci.yml)
- [CI/CD Runners Guide](../docs/cicd-runners-guide.md)

### Self-Hosted Runners

[If applicable, link to runner setup documentation]
```

**If later**:
- Document in `.claude/CLAUDE.md` that pipelines can be added later
- Reference the [CI/CD Runners Guide](cicd-runners-guide.md) for future setup

---

### Step 4.7: Optional Wiki Setup

**Agent Question**:
> "Would you like to enable the repository wiki for user documentation? (yes/no)"

**If yes**:

**Agent Actions**:
1. Enable wiki via CLI:
   ```bash
   # GitHub
   gh repo edit owner/repo --enable-wiki=true

   # GitLab
   glab api projects/:id --method PUT -f wiki_enabled=true
   ```

2. Create initial wiki structure (inform user to do this):
   ```bash
   # Clone wiki
   git clone https://github.com/owner/repo.wiki.git
   # or
   git clone https://gitlab.com/owner/repo.wiki.git

   # Create home page
   cd repo.wiki
   echo "# Project Wiki" > Home.md
   git add Home.md
   git commit -m "docs: initialize wiki"
   git push origin master
   ```

**Document in `.claude/CLAUDE.md`**:
```markdown
## Wiki Documentation

### Wiki Enabled
- **Platform**: GitHub / GitLab
- **URL**: [Wiki URL]
- **Purpose**: User guides, FAQs, troubleshooting

### Wiki Structure
- Home page: Entry point with navigation
- Installation guides
- User documentation
- FAQ / Troubleshooting

### Editing Wiki
[Link to wiki setup guide: ../docs/wiki-setup-guide.md]

### Documentation Strategy
- **Repository `/docs/`**: Technical docs, API reference, code architecture
- **Wiki**: User guides, installation, FAQs, tutorials

See: [Wiki Setup Guide](../docs/wiki-setup-guide.md)
```

**If no**:
- All documentation stays in `/docs/` folder
- Document this decision in `.claude/CLAUDE.md`

---

### Step 4.8: Repository Security & Branch Protection

**Agent Question**:
> "Would you like to configure repository security and branch protection now? (yes/later)"

**If yes**:

**Agent Actions**:
1. Inform user about branch protection importance
2. Provide commands for setting up protection (user must run these)

**For GitHub** - Protect `main` branch:
```bash
# User runs this command (requires admin access)
gh api repos/owner/repo/branches/main/protection \
  -X PUT \
  -f required_pull_request_reviews[required_approving_review_count]=2 \
  -f required_pull_request_reviews[dismiss_stale_reviews]=true \
  -f enforce_admins=true \
  -f required_linear_history=true \
  -f allow_force_pushes[enabled]=false
```

**For GitLab** - Protect `main` branch:
```bash
# User runs this command (requires maintainer access)
glab api projects/:id/protected_branches --method POST \
  -f name=main \
  -f push_access_level=40 \
  -f merge_access_level=40 \
  -f allow_force_push=false
```

**Document in `.claude/CLAUDE.md`**:
```markdown
## Repository Security

### Branch Protection Status
- **Main branch**: [Protected / Not Protected]
- **Develop branch**: [Protected / Not Protected]
- **Required approvals**: [Number]
- **Status checks required**: [Yes / No]

### Security Checklist
- [ ] Branch protection enabled
- [ ] CODEOWNERS file created
- [ ] Required approvals configured
- [ ] Status checks required
- [ ] Force push disabled
- [ ] Pre-push hooks installed

### Security Documentation
See: [Repository Security Guide](../docs/repository-security-guide.md)
```

**If later**:
- Document that security setup is pending
- Provide link to [Repository Security Guide](repository-security-guide.md)
- Add to TASKS.md as high-priority item

---

### Step 4.9: Configure Pre-commit Hooks for Branch Strategy

**Agent Action**: Update pre-commit hooks to respect branch protection

**Create `.git/hooks/pre-push`**:

```bash
#!/bin/bash
# Pre-push hook to prevent direct pushes to protected branches

PROTECTED_BRANCHES="main develop staging"
CURRENT_BRANCH=$(git branch --show-current)

# Detect platform (GitHub or GitLab)
REMOTE_URL=$(git config --get remote.origin.url)
if echo "$REMOTE_URL" | grep -q "gitlab"; then
    PLATFORM="gitlab"
    PR_COMMAND="glab mr create --source-branch"
else
    PLATFORM="github"
    PR_COMMAND="gh pr create --base"
fi

for BRANCH in $PROTECTED_BRANCHES; do
    if [ "$CURRENT_BRANCH" = "$BRANCH" ]; then
        echo "❌ ERROR: Direct push to '$BRANCH' is not allowed!"
        echo ""
        echo "Please use the pull/merge request workflow:"
        echo "  1. Create a feature branch: git checkout -b feature/task-name"
        echo "  2. Commit your changes: git commit -m 'feat: description'"
        echo "  3. Push feature branch: git push origin feature/task-name"
        if [ "$PLATFORM" = "gitlab" ]; then
            echo "  4. Create MR via: glab mr create --source-branch feature/task-name --target-branch $BRANCH"
        else
            echo "  4. Create PR via: gh pr create --base $BRANCH"
        fi
        echo ""
        exit 1
    fi
done

exit 0
```

**Make executable**:
```bash
chmod +x .git/hooks/pre-push
```

**Document in `.claude/CLAUDE.md`**:
```markdown
## Branch Protection

### Pre-push Hook

A pre-push hook prevents accidental direct commits to protected branches:
- `main`
- `develop`
- `staging`

The hook automatically detects if you're using GitHub or GitLab and provides appropriate commands.

If you try to push directly to these branches, you'll see an error reminding you to use the PR/MR workflow.

### Bypassing (Emergency Only)

**ONLY for emergencies** (production down, critical security fix):

\`\`\`bash
# Bypass pre-push hook (use with caution!)
git push --no-verify origin main
\`\`\`

**Always create a follow-up PR/MR documenting why the bypass was necessary.**
```

**Create bidirectional sync hook**: `.git/hooks/post-commit`

```bash
#!/bin/bash
# Auto-sync TASKS.md changes to issues

# Check if TASKS.md was modified in this commit
if git diff-tree --name-only -r HEAD | grep -q "TASKS.md"; then
    echo "TASKS.md changed - syncing to issues..."
    ./scripts/sync-tasks-to-issues.sh
fi
```

---

## Phase 5: Task Management System Setup

### Step 5.1: Create TASKS.md

**Agent Action**: Generate initial TASKS.md based on Phase 2 responses:

```markdown
# [Project Name] - Task List

*Last Updated: [Current Date Time UTC]*
*Project Status: Initial Setup*

## 🎯 Project Overview

**Description**: [From Phase 2 - Project Purpose]
**Tech Stack**: [From Phase 3 - Recommended Stack]
**Start Date**: [Current Date]
**Team**: [From Phase 2 - Team Size]
**Repository**: [GitHub/GitLab URL if created]

---

## 📋 Active Tasks

### 🚀 High Priority (P0)

- [ ] **Project Initialization & Setup**
  - Started: [Current DateTime]
  - Status: In Progress
  - Details: Set up task management, pre-commit hooks, repository
  - Link: [docs/project-setup.md](./docs/project-setup.md)
  - Assignee: [User Name]
  - GitHub Issue: [#1](link-if-created)
  - Estimated Time: 2 hours

- [ ] **[Feature 1 from Phase 2]**
  - Status: Pending
  - Details: [Brief description]
  - Priority: High
  - GitHub Issue: [#2](link-if-created)
  - Estimated Time: [Estimate based on complexity]

- [ ] **[Feature 2 from Phase 2]**
  - Status: Pending
  - Details: [Brief description]
  - Priority: High
  - GitHub Issue: [#3](link-if-created)

### 🔧 Medium Priority (P1)

- [ ] **[Feature 3 from Phase 2]**
  - Status: Pending
  - Details: [Brief description]
  - GitHub Issue: [#4](link-if-created)

- [ ] **Documentation Setup**
  - Status: Pending
  - Details: API docs, README, contribution guidelines
  - GitHub Issue: [#5](link-if-created)

### 💡 Low Priority (P2)

- [ ] **CI/CD Pipeline**
  - Status: Pending
  - Details: GitHub Actions for testing and deployment
  - GitHub Issue: [#6](link-if-created)

---

## ✅ Completed Tasks

### [Current Date]

- [x] **Git Repository Initialized**
  - Started: [DateTime]
  - Completed: [DateTime]
  - Details: Created local and remote repository
  - GitHub Issue: N/A
  - Result: Repository ready at [URL]

---

## 📚 Backlog

[Automatically populated from remaining features in Phase 2]

---

## 📝 Notes & Decisions

### Technical Decisions

**Date: [Current Date]** - Tech Stack Selection
- **Chosen**: [Recommended Stack]
- **Reason**: [Key reasons from Phase 3]
- **Alternatives Considered**: [Alternative stacks]

---

## 🔗 Quick Links

- [Project Repository]([GitHub/GitLab URL])
- [GitHub Issues]([Issues URL])
- [Documentation](./docs/)
- [Claude Guidelines](./.claude/CLAUDE.md)

---

## Legend

**Priority Levels**:
- 🚀 **P0 (High)**: Urgent, blocking other work
- 🔧 **P1 (Medium)**: Important, should be done soon
- 💡 **P2 (Low)**: Nice-to-have, when time permits

**Status**:
- `Pending`: Not started
- `In Progress`: Currently being worked on
- `Blocked`: Waiting on external dependency
- `Review`: Ready for review
- `Done`: Completed
```

### Step 5.2: Create .claude/CLAUDE.md

**Agent Action**: Generate project-specific CLAUDE.md:

```markdown
# Claude Code Project Documentation

*Last Updated: [Current Date Time UTC]*
*Generated by AI Project Initialization Agent*

## 🎯 Project Context

**Project Name**: [From Phase 2]
**Type**: [From Phase 3]
**Tech Stack**:
- **Backend**: [From Phase 3]
- **Frontend**: [From Phase 3]
- **Database**: [From Phase 3]
- **Infrastructure**: [From Phase 3]

**Repository**: [GitHub/GitLab URL]
**Documentation**: ./docs/
**Issue Tracker**: [GitHub/GitLab Issues URL]

---

## 📋 Task Management Procedure

### Session Startup Protocol

**ALWAYS start every session by:**

1. **Read TASKS.md** (`./TASKS.md`)
   - Check in-progress tasks
   - Note high-priority pending items
   - Review recent completions for context

2. **Check GitHub/GitLab Issues**
   ```bash
   # GitHub
   gh issue list --state open --assignee @me

   # GitLab
   glab issue list --assignee=@me
   ```

3. **Sync TASKS.md with Issues**
   - Update TASKS.md with any issue changes
   - Mark completed tasks in both places

4. **Check Documentation** (`./docs/`)
   - Read linked task documentation
   - Review verification checklists

5. **System Status Check**
   - Verify services are running
   - Check database connectivity
   - Review recent error logs

### Working on Tasks

#### Starting a Task

1. Update TASKS.md status to "In Progress"
2. If GitHub/GitLab issue exists, move to "In Progress":
   ```bash
   # GitHub
   gh issue edit [number] --add-label "in-progress"

   # GitLab
   glab issue update [number] --label "in-progress"
   ```
3. Create detailed docs if complex: `docs/[task-name].md`

#### Completing a Task

1. Mark completed in TASKS.md with result summary
2. Close GitHub/GitLab issue:
   ```bash
   # GitHub
   gh issue close [number] --comment "Completed: [summary]"

   # GitLab
   glab issue close [number] --comment "Completed: [summary]"
   ```
3. Update linked documentation with final status
4. Commit changes:
   ```bash
   git add .
   git commit -m "feat: [task name] - closes #[issue-number]"
   git push origin main
   ```

### Issue Sync Commands

```bash
# Create issue from task
gh issue create --title "[Task Name]" --body "[Details]" --label "task"

# List open issues
gh issue list --state open

# View issue details
gh issue view [number]

# Update issue
gh issue edit [number] --add-label "[label]"

# Close issue
gh issue close [number]
```

---

## 🔧 Development Procedures

### Git Workflow

**Branch Naming**:
- `feature/[task-name]` - New features
- `bugfix/[issue-description]` - Bug fixes
- `hotfix/[critical-fix]` - Production hotfixes

**Commit Messages** (Conventional Commits):
```
type(scope): brief description

- Detail 1
- Detail 2

Closes #[issue-number]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Pre-commit Hooks

**Installed hooks**:
[List based on tech stack from Phase 3]

**Test hooks manually**:
```bash
pre-commit run --all-files
```

---

## 🚨 Emergency Procedures

### Connection Loss / Session Recovery

1. **Read TASKS.md** - Find last session status
2. **Check issues**: `gh issue list --state open`
3. **Check git status**: `git status` and `git log -5`
4. **Continue from checkpoint**

### Service Failures

[Tech-stack-specific troubleshooting]

---

## 🛡️ Database Safety Protocol (MANDATORY)

### CRITICAL RULES - ALWAYS FOLLOW

**BEFORE running ANY command that touches the database:**

1. **Verify Environment**
   ```bash
   echo "Environment: $APP_ENV"
   echo "Database: $DB_DATABASE"
   echo "Host: $DB_HOST"
   ```
   **STOP immediately if:**
   - APP_ENV=production
   - DB_DATABASE contains "prod", "production", or "live"
   - DB_HOST is not localhost or 127.0.0.1

2. **MANDATORY Backup**
   ```bash
   ./scripts/backup-database.sh
   ```
   **NEVER proceed without successful backup**

3. **Verify Backup**
   ```bash
   ls -lh backups/ | head -5
   ```

### Commands Requiring Backup

**ALWAYS backup before:**
- ❌ Running tests (unit, integration, e2e)
- ❌ Running migrations
- ❌ Running database seeds/fixtures
- ❌ Running any SQL/database queries
- ❌ Running deployment scripts
- ❌ Modifying database schema

### Safe Test Execution

**NEVER run tests directly. ALWAYS use the safe wrapper:**

```bash
# WRONG - NEVER do this:
npm test
pytest
phpunit
./vendor/bin/phpunit

# CORRECT - Always use safe wrapper:
./scripts/safe-test.sh npm test
./scripts/safe-test.sh pytest
./scripts/safe-test.sh phpunit
```

### Database Backup Scripts

Location: `scripts/`
- `backup-database.sh` - Create backup (run before ANY database operation)
- `restore-database.sh` - Restore from backup
- `safe-test.sh` - Safe test runner (auto-backups before tests)
- `setup-periodic-backups.sh` - Setup automated periodic backups

### Emergency Database Restore

If a test or command damaged the database:

```bash
# List available backups
ls -lth backups/ | head -10

# Restore latest backup
./scripts/restore-database.sh backups/[latest-backup-file].sql
```

### Periodic Backups

Automatic backups run every 6 hours via cron (configured during setup).

To check backup status:
```bash
crontab -l | grep backup
ls -lth backups/ | head -10
```

### AI Agent Checklist

Before EVERY database operation:

- [ ] Check environment variables
- [ ] Verify NOT connected to production
- [ ] Run backup script
- [ ] Verify backup succeeded
- [ ] ONLY THEN proceed with operation

**NO EXCEPTIONS. NO SHORTCUTS.**

---

## 📚 Project-Specific Context

### Architecture Overview

[Brief description based on tech stack]

### Key Commands

```bash
# Development server
[Command based on tech stack]

# Run tests
[Command based on tech stack]

# Build for production
[Command based on tech stack]
```

### Environment Variables

Required in `.env`:
```
[List based on tech stack and integrations from Phase 2]
```

---

## 🎓 Best Practices

### For Claude

- ✅ Always sync TASKS.md with GitHub/GitLab issues
- ✅ Use `closes #X` in commit messages
- ✅ Update task status in both places
- ✅ Link issues in TASKS.md with `GitHub Issue: [#X](URL)`

---

*This file was auto-generated by AI Project Initialization Agent. Update as project evolves.*
```

---

## Phase 6: Documentation Structure Setup

### Step 6.1: Create docs/ Directory Structure

```bash
mkdir -p docs/assets
mkdir -p docs/api
mkdir -p docs/guides
```

### Step 6.2: Create README.md

**Agent Action**: Generate professional README.md based on project info:

```markdown
# [Project Name]

> [One-line project description from Phase 2]

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/[org]/[repo])](https://github.com/[org]/[repo]/issues)
[![GitHub Stars](https://img.shields.io/github/stars/[org]/[repo])](https://github.com/[org]/[repo]/stargazers)

[Brief 2-3 sentence description of what this project does and why it exists]

## ✨ Features

[Auto-generated from Phase 2 key features]

- ✅ [Feature 1]
- ✅ [Feature 2]
- ✅ [Feature 3]
- ✅ [Feature 4]
- ✅ [Feature 5]

## 🚀 Quick Start

### Prerequisites

- [Language version, e.g., Python 3.11+]
- [Database, e.g., PostgreSQL 15+]
- [Other requirements based on tech stack]

### Installation

\`\`\`bash
# Clone repository
git clone [repository-url]
cd [project-name]

# Install dependencies
[command based on tech stack - npm install / pip install -r requirements.txt / composer install]

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations (if applicable)
[migration command based on stack]

# Start development server
[dev server command]
\`\`\`

Visit `http://localhost:[port]` in your browser.

## 📖 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Architecture & Tech Stack](docs/architecture.md)** - System design and technology choices
- **[Setup Guide](docs/setup.md)** - Detailed installation and configuration
- **[Development Guide](docs/development.md)** - Development workflow and best practices
- **[API Documentation](docs/api.md)** - API endpoints and usage (if applicable)
- **[Deployment Guide](docs/deployment.md)** - Production deployment instructions

### Quick Links

- [TASKS.md](TASKS.md) - Current tasks and project roadmap
- [.claude/CLAUDE.md](.claude/CLAUDE.md) - AI-assisted development guidelines
- [GitHub Issues](https://github.com/[org]/[repo]/issues) - Bug reports and feature requests
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to this project

## 🏗️ Architecture

[Brief overview - detailed in docs/architecture.md]

**Tech Stack**:
- **Backend**: [From Phase 3]
- **Frontend**: [From Phase 3]
- **Database**: [From Phase 3]
- **Infrastructure**: [From Phase 3]

See [docs/architecture.md](docs/architecture.md) for detailed architecture documentation.

## 🛠️ Development

### Development Setup

See [docs/development.md](docs/development.md) for comprehensive development guidelines.

Quick commands:

\`\`\`bash
# Run tests
[test command]

# Run linter
pre-commit run --all-files

# Start development server
[dev server command]

# Build for production
[build command]
\`\`\`

### Project Structure

\`\`\`
[project-name]/
├── [main source directory]/     # Application source code
├── docs/                         # Documentation
├── tests/                        # Test files
├── .claude/                      # AI development guidelines
├── TASKS.md                      # Task tracking
├── README.md                     # This file
└── [config files]               # Configuration files
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run all tests
[test command]

# Run specific test
[specific test command]

# Run with coverage
[coverage command]
\`\`\`

## 🚢 Deployment

See [docs/deployment.md](docs/deployment.md) for detailed deployment instructions.

Quick deployment:

\`\`\`bash
[deployment commands based on infrastructure from Phase 2]
\`\`\`

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Task Management

This project uses a markdown-based task management system:

- **[TASKS.md](TASKS.md)** - Main task list (synced with GitHub Issues)
- **GitHub Issues** - Public issue tracking
- **[.claude/CLAUDE.md](.claude/CLAUDE.md)** - AI development guidelines

Tasks are automatically synced between TASKS.md and GitHub Issues.

## 📄 License

[License information - default MIT]

## 🙏 Acknowledgments

[Credits, inspirations, etc.]

## 📞 Contact

- **Project Maintainer**: [Name]
- **Email**: [Email]
- **GitHub**: [GitHub Profile]
- **Issues**: [GitHub Issues URL]

---

*Built with ❤️ using [tech stack]. Documentation generated by AI Project Initialization Agent.*
```

### Step 6.3: Create docs/architecture.md

**Agent Action**: Generate comprehensive architecture documentation:

```markdown
# Architecture & Tech Stack

*Last Updated: [Date]*

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Design Decisions](#design-decisions)
- [Database Schema](#database-schema)
- [API Design](#api-design)
- [Security Architecture](#security-architecture)
- [Scalability Considerations](#scalability-considerations)

---

## Overview

**Project Type**: [From Phase 2 - Web App / API / CLI / etc.]

**Purpose**: [From Phase 2 - Project Purpose]

**Scale**: [From Phase 2 - Expected scale]

**Team Size**: [From Phase 2 - Team size]

---

## System Architecture

### High-Level Architecture

[Generate ASCII diagram or description based on project type]

**Example for Web Application**:
```
┌─────────────┐
│   Client    │ (Browser / Mobile App)
└──────┬──────┘
       │ HTTPS
┌──────▼──────────────────────────────┐
│         Load Balancer               │
└──────┬──────────────────────────────┘
       │
┌──────▼──────────────────────────────┐
│      Application Server             │
│  [Framework from Phase 3]           │
│  - API Layer                        │
│  - Business Logic                   │
│  - Authentication                   │
└──────┬──────────────────────────────┘
       │
┌──────▼──────────────────────────────┐
│         Database Layer              │
│  [Database from Phase 3]            │
│  - Primary DB                       │
│  - Cache (Redis)                    │
└─────────────────────────────────────┘
```

### Component Breakdown

#### 1. Frontend (if applicable)
- **Framework**: [From Phase 3 - React/Vue/etc.]
- **Styling**: [From Phase 3 - Tailwind/Material UI/etc.]
- **State Management**: [Based on framework]
- **Build Tool**: [Vite/Webpack/etc.]

**Key Features**:
- [Feature 1 from Phase 2]
- [Feature 2 from Phase 2]

#### 2. Backend
- **Language**: [From Phase 3]
- **Framework**: [From Phase 3]
- **API Style**: [REST / GraphQL / gRPC]
- **Authentication**: [JWT / OAuth / Session-based]

**Key Responsibilities**:
- API endpoint handling
- Business logic processing
- Database operations
- External service integrations

#### 3. Database
- **Primary Database**: [From Phase 3 - PostgreSQL/MySQL/MongoDB]
- **Caching Layer**: [Redis/Memcached if needed]
- **Search Engine**: [Elasticsearch if needed]

**Schema Design**: See [Database Schema](#database-schema) section

#### 4. Infrastructure
- **Development**: Docker Compose
- **Production**: [From Phase 2 - AWS/Azure/GCP/DigitalOcean]
- **CI/CD**: GitHub Actions
- **Monitoring**: [To be implemented]

---

## Tech Stack

### Backend Stack

| Component | Technology | Version | Reason |
|-----------|-----------|---------|--------|
| Language | [From Phase 3] | [Version] | [Reason from Phase 3] |
| Framework | [From Phase 3] | [Version] | [Reason from Phase 3] |
| Database | [From Phase 3] | [Version] | [Reason from Phase 3] |
| Cache | Redis | 7.x | Fast in-memory caching |
| Task Queue | [Celery/Bull/etc.] | [Version] | Background job processing |

### Frontend Stack (if applicable)

| Component | Technology | Version | Reason |
|-----------|-----------|---------|--------|
| Framework | [From Phase 3] | [Version] | [Reason from Phase 3] |
| Styling | [From Phase 3] | [Version] | [Reason from Phase 3] |
| State | [Redux/Vuex/etc.] | [Version] | State management |
| Build | [Vite/Webpack] | [Version] | Fast development builds |

### Development Tools

| Tool | Purpose |
|------|---------|
| Pre-commit | Code quality enforcement |
| [Linter] | [From Phase 3 - Black/ESLint/PHPStan] |
| [Formatter] | [From Phase 3 - Black/Prettier/PHP CS Fixer] |
| [Type Checker] | [From Phase 3 - MyPy/TypeScript/Psalm] |
| Docker | Containerization |
| Docker Compose | Local development environment |

---

## Design Decisions

### Why [Backend Framework]?

[From Phase 3 recommendation - explain reasons]

**Pros**:
- [Pro 1]
- [Pro 2]
- [Pro 3]

**Cons**:
- [Con 1]
- [Con 2]

**Alternatives Considered**:
- [Alternative 1]: [Reason not chosen]
- [Alternative 2]: [Reason not chosen]

### Why [Database]?

[From Phase 3 recommendation]

**Pros**:
- [Pro 1]
- [Pro 2]

**Cons**:
- [Con 1]

### Why [Infrastructure Choice]?

[From Phase 2 infrastructure decision]

**Pros**:
- [Pro 1]
- [Pro 2]

---

## Database Schema

[Generate initial schema based on features from Phase 2]

### Entity Relationship Diagram

```
[Generate ERD based on project features]

Example for E-commerce:
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Users    │───────│   Orders    │───────│ OrderItems  │
└─────────────┘ 1:N   └─────────────┘ 1:N   └─────────────┘
                                │
                                │ N:1
                                │
                           ┌─────────────┐
                           │  Products   │
                           └─────────────┘
```

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

[Generate tables based on features from Phase 2]

---

## API Design

### RESTful Endpoints (if REST API)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Health check | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/register` | User registration | No |
| GET | `/api/[resource]` | List [resources] | Yes |
| POST | `/api/[resource]` | Create [resource] | Yes |
| GET | `/api/[resource]/:id` | Get [resource] details | Yes |
| PUT | `/api/[resource]/:id` | Update [resource] | Yes |
| DELETE | `/api/[resource]/:id` | Delete [resource] | Yes |

[Generate endpoints based on features from Phase 2]

See [api.md](api.md) for detailed API documentation.

---

## Security Architecture

### Authentication
- [JWT / OAuth / Session-based from Phase 3]
- Token expiration: [Duration]
- Refresh token strategy: [Strategy]

### Authorization
- Role-based access control (RBAC)
- Roles: [Based on features from Phase 2]

### Data Protection
- Passwords: Bcrypt hashing (cost factor: 12)
- Sensitive data: Encryption at rest
- API communication: HTTPS only
- CORS: Configured for [domains]

### Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Content-Security-Policy: [Policy]
- Strict-Transport-Security: [Policy]

---

## Scalability Considerations

### Current Scale
- **Expected Users**: [From Phase 2]
- **Expected Load**: [Estimate]
- **Storage Needs**: [Estimate]

### Horizontal Scaling
- Load balancer ready
- Stateless application design
- Database connection pooling
- Redis for distributed caching

### Vertical Scaling
- CPU-bound operations: [Strategy]
- Memory optimization: [Strategy]

### Performance Optimizations
- Database indexing on [key fields]
- Query optimization
- Caching strategy: [TTL policies]
- CDN for static assets (if applicable)

### Monitoring & Observability
- Application logs: [Logging strategy]
- Performance metrics: [To be implemented]
- Error tracking: [To be implemented]
- Uptime monitoring: [To be implemented]

---

## Future Enhancements

[Based on backlog from TASKS.md]

- [ ] [Enhancement 1]
- [ ] [Enhancement 2]
- [ ] [Enhancement 3]

---

## References

- [Tech Stack Documentation Links]
- [Framework Best Practices]
- [Security Guidelines]

---

*This document should be updated as the architecture evolves.*
```

### Step 6.4: Create docs/setup.md

```markdown
# Setup Guide

*Detailed installation and configuration instructions*

## Prerequisites

### Required Software

1. **[Language]** ([Version])
   ```bash
   # Installation instructions
   [commands based on OS and tech stack]
   ```

2. **[Database]** ([Version])
   ```bash
   # Installation instructions
   [commands based on database choice]
   ```

3. **[Additional Requirements]**
   [Based on tech stack from Phase 3]

### Optional Tools
- Docker & Docker Compose (recommended for development)
- [Additional tools]

---

## Installation

### 1. Clone Repository

```bash
git clone [repository-url]
cd [project-name]
```

### 2. Install Dependencies

[Commands based on tech stack]

**Python/Django**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Node.js/JavaScript**:
```bash
npm install
# or
yarn install
```

**PHP/Laravel**:
```bash
composer install
npm install
```

### 3. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Application
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost:[port]

# Database
DB_CONNECTION=[database-type]
DB_HOST=127.0.0.1
DB_PORT=[port]
DB_DATABASE=[database-name]
DB_USERNAME=[username]
DB_PASSWORD=[password]

# External Services (if applicable from Phase 2)
[SERVICE_API_KEY]=[your-key]
```

### 4. Database Setup

```bash
# Create database
[database creation command]

# Run migrations
[migration command based on tech stack]

# Seed database (optional)
[seed command if applicable]
```

### 5. Pre-commit Hooks

```bash
pip install pre-commit  # If not already installed
pre-commit install
pre-commit run --all-files  # Test hooks
```

---

## Running the Application

### Development Server

```bash
[dev server command]
```

Visit: `http://localhost:[port]`

### Running with Docker (Alternative)

```bash
docker-compose up -d
```

---

## Verification

Test that everything works:

```bash
# Run tests
[test command]

# Check linting
pre-commit run --all-files

# Health check
curl http://localhost:[port]/api/health
```

---

## Troubleshooting

### Common Issues

**Issue 1**: [Common problem]
**Solution**: [Fix]

**Issue 2**: [Common problem]
**Solution**: [Fix]

---

*See [development.md](development.md) for development workflow.*
```

### Step 6.5: Create docs/development.md

```markdown
# Development Guide

*Development workflow and best practices*

## Development Workflow

### Starting Work on a Task

1. **Check TASKS.md** for assigned tasks
2. **Create feature branch**:
   ```bash
   git checkout -b feature/[task-name]
   ```
3. **Update task status** in TASKS.md to "In Progress"
4. **Start development**

### Daily Development

```bash
# Pull latest changes
git pull origin main

# Run development server
[dev server command]

# Run tests in watch mode (if available)
[watch test command]
```

### Code Quality

**Before committing**:
- Pre-commit hooks run automatically
- Tests should pass
- No linting errors

**Manual checks**:
```bash
# Linting
[lint command]

# Type checking
[type check command]

# Tests
[test command]
```

---

## Git Workflow

### Branch Naming

- `feature/[task-name]` - New features
- `bugfix/[issue-description]` - Bug fixes
- `hotfix/[critical-fix]` - Production hotfixes
- `refactor/[component-name]` - Code refactoring

### Commit Messages

Follow Conventional Commits:

```
type(scope): brief description

Longer description if needed

- Detail 1
- Detail 2

Closes #[issue-number]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples**:
```bash
git commit -m "feat(auth): add JWT authentication - closes #12"
git commit -m "fix(api): resolve null pointer in user endpoint - closes #45"
git commit -m "docs: update setup guide with Docker instructions"
```

---

## Testing

### Running Tests

```bash
# All tests
[test command]

# Specific test file
[specific test command]

# With coverage
[coverage command]
```

### Writing Tests

[Guidelines based on tech stack]

---

## Code Style

### Linting Rules

[Based on pre-commit hooks from Phase 3]

### Style Guide

[Language-specific style guide references]

---

## Debugging

### Development Tools

[Based on tech stack - browser DevTools, debugger, etc.]

### Logging

[Logging practices for the project]

---

## Task Management

### TASKS.md Integration

1. Update task status when starting/completing work
2. Mark completed tasks with result summary
3. Link issues in commits: `closes #N`

### GitHub Issues Sync

Tasks automatically sync with GitHub Issues via:
- Post-commit hook
- Manual sync: `./scripts/sync-tasks-to-issues.sh`

---

*See [architecture.md](architecture.md) for system architecture details.*
```

### Step 6.6: Create docs/api.md (if API project)

```markdown
# API Documentation

*Comprehensive API endpoint documentation*

## Base URL

- **Development**: `http://localhost:[port]/api`
- **Production**: `https://[domain]/api`

## Authentication

[Auth method from Phase 3]

**Example**:
```bash
curl -H "Authorization: Bearer [token]" https://[domain]/api/[endpoint]
```

---

## Endpoints

[Generate based on features from Phase 2]

### Health Check

**GET** `/health`

Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-21T10:00:00Z"
}
```

---

[Additional endpoints based on project features]

---

*Generated API documentation. Update as endpoints are added.*
```

### Step 6.7: Optional - Setup Automated API Documentation (OpenAPI/Swagger)

**Agent Question**:
> "Would you like to set up automated API documentation with OpenAPI/Swagger? This generates interactive docs from your code. (yes/no/later)"

**If yes and project is an API**:

**Agent Actions**:
1. Ask: "Which framework are you using?" (based on Phase 3 choice)
2. Install and configure appropriate OpenAPI/Swagger tool

**Framework-Specific Setup**:

#### Python - FastAPI (Built-in)
```python
# FastAPI already has built-in OpenAPI support
# Update main.py with proper metadata

from fastapi import FastAPI

app = FastAPI(
    title="[Project Name from Phase 2]",
    description="[Project description from Phase 2]",
    version="1.0.0",
    docs_url="/docs",        # Swagger UI
    redoc_url="/redoc",      # ReDoc
    openapi_url="/openapi.json"
)

# Access documentation:
# Swagger UI: http://localhost:8000/docs
# ReDoc: http://localhost:8000/redoc
# OpenAPI JSON: http://localhost:8000/openapi.json
```

#### Python - Flask
```bash
pip install flask-restx

# Configure in app.py
from flask_restx import Api

api = Api(
    app,
    version='1.0',
    title='[Project Name]',
    description='[Project description]',
    doc='/docs'
)
```

#### Python - Django REST Framework
```bash
pip install drf-spectacular

# Add to settings.py
INSTALLED_APPS += ['drf_spectacular']
REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# Access: /api/docs/ for Swagger UI
```

#### JavaScript - NestJS
```bash
npm install --save @nestjs/swagger swagger-ui-express

# Configure in main.ts with project details from Phase 2
```

#### JavaScript - Express
```bash
npm install swagger-jsdoc swagger-ui-express

# Configure with JSDoc comments
```

#### PHP - Laravel
```bash
composer require dedoc/scramble

# Access: /docs/api
```

#### Go - Gin
```bash
go get -u github.com/swaggo/swag/cmd/swag
go get -u github.com/swaggo/gin-swagger
go get -u github.com/swaggo/files

# Generate docs:
swag init

# Access: /swagger/index.html
```

**Document in `.claude/CLAUDE.md`**:
```markdown
## API Documentation

### Auto-Generated Documentation
- **Enabled**: Yes / No
- **Framework**: [OpenAPI tool based on tech stack]
- **Access URLs**:
  - Swagger UI: http://localhost:[port]/docs
  - ReDoc: http://localhost:[port]/redoc (if applicable)
  - OpenAPI JSON: http://localhost:[port]/openapi.json

### Documentation Strategy
- **Auto-generated**: API docs generated from code annotations
- **Interactive testing**: Test APIs directly in browser via Swagger UI
- **Always in sync**: Documentation updates automatically with code changes

### Key Practices
- Document all endpoints with clear descriptions
- Add request/response examples
- Document authentication requirements
- Include error responses
- Provide realistic example data

### Regenerating Documentation
[Commands to regenerate based on framework - if manual step needed]

### Deployment
[Strategy for deploying docs to GitHub Pages / GitLab Pages]

See: [API Documentation Guide](../docs/api-documentation-guide.md)
```

**Update docs/api.md**:
```markdown
# API Documentation

*Auto-generated interactive API documentation with OpenAPI/Swagger*

## 📚 Interactive Documentation

- **Swagger UI**: [http://localhost:[port]/docs](http://localhost:[port]/docs)
  - Interactive API testing
  - Try endpoints directly in browser
  - View request/response schemas

- **ReDoc** (if applicable): [http://localhost:[port]/redoc](http://localhost:[port]/redoc)
  - Beautiful static documentation
  - Better for reading/reference

- **OpenAPI Specification**: [http://localhost:[port]/openapi.json](http://localhost:[port]/openapi.json)
  - Raw OpenAPI 3.0 JSON specification
  - Use for client SDK generation
  - Import into Postman/Insomnia

## 🔄 CI/CD Integration

### Validate OpenAPI Spec in CI/CD

**GitHub Actions** (`.github/workflows/api-docs.yml`):
```yaml
name: API Documentation

on:
  pull_request:
    paths:
      - 'src/**'
      - 'api/**'

jobs:
  validate-openapi:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Generate OpenAPI spec
        run: |
          # Framework-specific command to generate openapi.json
          [generation command]

      - name: Validate OpenAPI
        uses: char0n/swagger-editor-validate@v1
        with:
          definition-file: openapi.json

      - name: Upload spec as artifact
        uses: actions/upload-artifact@v3
        with:
          name: openapi-spec
          path: openapi.json
```

**GitLab CI** (`.gitlab-ci.yml`):
```yaml
validate:openapi:
  stage: validate
  script:
    - [generate openapi.json]
    - npx @openapitools/openapi-generator-cli validate -i openapi.json
  artifacts:
    paths:
      - openapi.json
```

## 📦 Client SDK Generation

Generate client SDKs automatically from OpenAPI spec:

```bash
# Install generator
npm install -g @openapitools/openapi-generator-cli

# Generate Python client
openapi-generator-cli generate -i openapi.json -g python -o ./clients/python

# Generate TypeScript client
openapi-generator-cli generate -i openapi.json -g typescript-axios -o ./clients/typescript

# Generate Go client
openapi-generator-cli generate -i openapi.json -g go -o ./clients/go
```

## 🧪 Mock Server for Testing

```bash
# Install Prism
npm install -g @stoplight/prism-cli

# Run mock server from OpenAPI spec
prism mock openapi.json

# Access mock API: http://localhost:4010
```

## 📖 Documentation Best Practices

- **Keep in sync**: Documentation auto-generates from code
- **Rich examples**: Provide realistic request/response examples
- **Security docs**: Document authentication clearly
- **Error codes**: Document all possible error responses
- **Versioning**: Document API version in OpenAPI spec

## 🚀 Deployment

**Deploy to GitHub Pages**:
```bash
# Generate static HTML
npx redoc-cli bundle openapi.json -o api-docs.html

# Deploy to gh-pages branch
git checkout --orphan gh-pages
git add api-docs.html openapi.json
git commit -m "docs: deploy API documentation"
git push origin gh-pages
```

**Deploy to GitLab Pages** (`.gitlab-ci.yml`):
```yaml
pages:
  stage: deploy
  script:
    - mkdir -p public
    - npx redoc-cli bundle openapi.json -o public/index.html
    - cp openapi.json public/
  artifacts:
    paths:
      - public
  only:
    - main
```

---

See **[API Documentation Guide](../docs/api-documentation-guide.md)** for comprehensive setup instructions for all frameworks.
```

**If no/later**:
- Document that API documentation can be added later
- Add reference to [API Documentation Guide](../docs/api-documentation-guide.md) for future reference
- Add to TASKS.md as a medium-priority task if project type is API

---

## Phase 7: Pre-commit Hooks Setup

### Step 7.1: Install Framework

```bash
pip install pre-commit
```

### Step 6.2: Generate .pre-commit-config.yaml

**Agent Action**: Create config based on tech stack from Phase 3

**Python/Django**:
```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
      - id: detect-private-key

  - repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
      - id: black

  - repo: https://github.com/pycqa/flake8
    rev: 7.0.0
    hooks:
      - id: flake8

  - repo: https://github.com/pycqa/isort
    rev: 5.13.2
    hooks:
      - id: isort
        args: ['--profile', 'black']

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
```

**PHP/Laravel**:
```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer

  - repo: local
    hooks:
      - id: php-cs-fixer
        name: PHP CS Fixer
        entry: php-cs-fixer
        language: system
        types: [php]
        args: ['fix']

      - id: phpstan
        name: PHPStan
        entry: phpstan
        language: system
        types: [php]
        args: ['analyse']
```

**JavaScript/TypeScript**:
```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer

  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.1.0
    hooks:
      - id: prettier

  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.56.0
    hooks:
      - id: eslint
```

### Step 6.3: Install and Test

```bash
pre-commit install
pre-commit run --all-files
```

---

## Phase 7: Create Initial Issues

**Agent Action**: If GitHub/GitLab integration enabled, create issues for each task:

```bash
#!/bin/bash
# Create initial issues from TASKS.md

# High Priority Tasks
gh issue create --title "[Feature 1]" --body "[Details]" --label "priority:high,type:feature"
gh issue create --title "[Feature 2]" --body "[Details]" --label "priority:high,type:feature"

# Medium Priority Tasks
gh issue create --title "[Feature 3]" --body "[Details]" --label "priority:medium,type:feature"
gh issue create --title "Documentation Setup" --body "API docs, README, contribution guidelines" --label "priority:medium,type:docs"

# Low Priority Tasks
gh issue create --title "CI/CD Pipeline" --body "GitHub Actions for testing and deployment" --label "priority:low,type:infrastructure"

echo "✅ Created [N] issues"
echo "View at: $(gh repo view --json url -q .url)/issues"
```

**Agent Action**: Update TASKS.md with issue numbers and links

---

## Phase 8: Final Report & Next Steps

**Agent Report**:

```markdown
## 🎉 Project Initialization Complete!

### ✅ What Was Set Up

0. **🛡️ Database Safety System** (CRITICAL - Highest Priority)
   - ✅ scripts/backup-database.sh - Mandatory backup before ANY database operation
   - ✅ scripts/restore-database.sh - Emergency database restore
   - ✅ scripts/safe-test.sh - Safe test runner (auto-backups)
   - ✅ scripts/setup-periodic-backups.sh - Automated periodic backups
   - ✅ backups/ directory (git-ignored, auto-cleanup)
   - ✅ Environment verification (prevents production accidents)
   - ✅ Production database protection
   - ✅ 10-backup rotation (auto-cleanup old backups)
   - ✅ Periodic backup cron job (every 6 hours) [if enabled]

1. **Task Management System**
   - ✅ TASKS.md created with [N] tasks
   - ✅ .claude/CLAUDE.md with project context + database safety protocol
   - ✅ docs/ directory structure

2. **Git Repository**
   - ✅ Local repository initialized
   - ✅ Remote repository: [URL]
   - ✅ .gitignore configured for [tech stack] + backups exclusion

3. **Issue Tracking**
   - ✅ [N] GitHub/GitLab issues created
   - ✅ Sync scripts configured
   - ✅ Post-commit hook enabled

4. **Code Quality**
   - ✅ Pre-commit hooks installed
   - ✅ Linting: [tools]
   - ✅ Formatting: [tools]
   - ✅ Type checking: [tools]

5. **Documentation** (Complete Professional Structure)
   - ✅ README.md - Professional project overview with badges + Database Safety section
   - ✅ docs/architecture.md - Full tech stack & system design
   - ✅ docs/setup.md - Detailed installation guide
   - ✅ docs/development.md - Development workflow & best practices
   - ✅ docs/api.md - API documentation (if applicable)
   - ✅ TASKS.md - Task tracking & roadmap
   - ✅ .claude/CLAUDE.md - AI development guidelines + Database Safety Protocol
   - ✅ .env.example - With critical database safety warnings

### 📊 Project Summary

- **Name**: [Project Name]
- **Tech Stack**: [Stack]
- **Repository**: [URL]
- **Issues**: [Issues URL]
- **Total Tasks**: [N] ([High Priority], [Medium], [Low])

### 🚀 Next Steps

1. **🛡️ CRITICAL: Verify Database Safety Setup** (DO THIS FIRST!)
   ```bash
   # Verify backup scripts are in place
   ls -la scripts/

   # Verify backups directory exists
   ls -la backups/

   # Test backup script (if database configured)
   ./scripts/backup-database.sh

   # Check periodic backups (if enabled)
   crontab -l | grep backup
   ```

2. **⚠️ REMEMBER: Before ANY Database Operation**
   ```bash
   # Check environment
   echo "APP_ENV: $APP_ENV"
   echo "DB: $DB_DATABASE @ $DB_HOST"

   # MANDATORY: Create backup
   ./scripts/backup-database.sh

   # ONLY THEN run your command
   ```

3. **🧪 Running Tests - ALWAYS Use Safe Wrapper**
   ```bash
   # WRONG - NEVER do this:
   npm test
   pytest
   phpunit

   # CORRECT - Always use:
   ./scripts/safe-test.sh npm test
   ./scripts/safe-test.sh pytest
   ./scripts/safe-test.sh phpunit
   ```

4. **Verify Setup**:
   ```bash
   # Test pre-commit hooks
   pre-commit run --all-files

   # Test issue sync
   ./scripts/sync-tasks-to-issues.sh
   ```

5. **First Commit**:
   ```bash
   git add .
   git commit -m "feat: initial project setup with database safety - closes #1"
   git push origin main
   ```

6. **Begin Feature Development**:
   - Review high-priority tasks in TASKS.md
   - Check out linked GitHub issues
   - Start with [Feature 1]
   - **REMEMBER**: Always backup before database operations!

### 📚 Important Files

**🛡️ Database Safety** (MOST CRITICAL):
- **scripts/backup-database.sh** - MANDATORY backup before ANY database operation
- **scripts/restore-database.sh** - Emergency database restore
- **scripts/safe-test.sh** - Safe test runner (ALWAYS use this for tests)
- **scripts/setup-periodic-backups.sh** - Setup automated backups
- **backups/** - Backup storage (last 10 kept, auto-cleanup)

**Task Management**:
- **TASKS.md** - Your primary task list
- **.claude/CLAUDE.md** - AI agent instructions + Database Safety Protocol

**Documentation**:
- **README.md** - Project overview (links to all docs) + Database Safety section
- **docs/architecture.md** - Tech stack & system design
- **docs/setup.md** - Installation guide
- **docs/development.md** - Development workflow
- **docs/api.md** - API documentation

**Code Quality**:
- **.pre-commit-config.yaml** - Code quality hooks
- **scripts/sync-tasks-to-issues.sh** - Issue sync script

### 💡 Pro Tips

- **🚨 CRITICAL**: ALWAYS use `./scripts/safe-test.sh [test-command]` for tests
- **🛡️ ALWAYS**: Backup before any database operation: `./scripts/backup-database.sh`
- **⚠️ VERIFY**: Check environment before commands: `echo $APP_ENV $DB_DATABASE`
- **📦 RESTORE**: If something goes wrong: `./scripts/restore-database.sh backups/[file].sql`
- Use `gh issue list` to see all tasks
- Commit messages with `closes #N` auto-close issues
- Run `pre-commit run --all-files` before pushing
- Update TASKS.md regularly - it syncs to issues!
- Check backups regularly: `ls -lth backups/ | head -10`

---

**Ready to start coding! 🎯**
```

---

## 🔄 Ongoing Task Sync Workflow

### When User Adds Task to TASKS.md

**Agent Auto-Detection**: Watch for TASKS.md changes

```bash
# In post-commit hook or continuous monitoring
if git diff HEAD~1 HEAD --name-only | grep -q "TASKS.md"; then
    # Parse new tasks
    NEW_TASKS=$(git diff HEAD~1 HEAD TASKS.md | grep "^+- \[ \]")

    # Create issues for each new task
    echo "$NEW_TASKS" | while read -r line; do
        TASK_NAME=$(echo "$line" | sed -n 's/.*\*\*\(.*\)\*\*.*/\1/p')
        gh issue create --title "$TASK_NAME" --label "task,auto-created"
    done
fi
```

### When GitHub/GitLab Issue Created Externally

**Periodic Sync**: Run every N minutes or on demand

```bash
# scripts/sync-issues-to-tasks.sh
#!/bin/bash

# Fetch open issues
gh issue list --state open --json number,title,labels --limit 100 > /tmp/issues.json

# Parse and append to TASKS.md if not exists
jq -r '.[] | "- [ ] **\(.title)** - GitHub Issue: [#\(.number)](URL)"' /tmp/issues.json | while read -r line; do
    if ! grep -qF "$line" TASKS.md; then
        # Append to appropriate section based on labels
        echo "$line" >> TASKS.md
    fi
done
```

---

## 🎯 Summary: Agent Workflow

```
1. Analyze codebase (detect existing code, languages, frameworks)
2. Ask discovery questions (purpose, features, scale, timeline)
3. Recommend tech stack (based on requirements)
4. Set up Git repository (local + remote GitHub/GitLab)
5. Create TASKS.md (with initial tasks from user requirements)
6. Create .claude/CLAUDE.md (with project-specific context)
7. Configure pre-commit hooks (tech-stack-specific)
8. Create GitHub/GitLab issues (synced with TASKS.md)
9. Set up sync scripts (bidirectional TASKS.md ↔️ Issues)
10. Generate final report (summary + next steps)
```

---

## 📖 Usage Instructions for User

### How to Use This Prompt

1. **Copy this entire document** to your AI agent (Claude, GPT, etc.)

2. **Start in your project directory**:
   ```bash
   cd /path/to/your/project
   ```

3. **Paste the prompt** and say:
   > "Initialize this project following the AI Agent Project Initialization workflow"

4. **Answer the questions** as the agent asks them

5. **Review recommendations** and approve or modify

6. **Watch the magic happen** as the agent:
   - Sets up Git
   - Creates TASKS.md
   - Configures pre-commit hooks
   - Creates GitHub/GitLab issues
   - Generates all necessary files

### After Setup

- Your TASKS.md is the single source of truth
- GitHub/GitLab issues stay in sync automatically
- Pre-commit hooks ensure code quality
- Claude Code sessions start with full context

---

*This is an interactive AI agent prompt. The agent will guide you through the entire setup process.*
