# Task Management Setup Phase

*Initialize TASKS.md and synchronize with GitHub/GitLab issues*

---

## Overview

Set up a comprehensive task management system with:
- Local task tracking (`TASKS.md`)
- AI agent instructions (`.claude/CLAUDE.md`)
- Synchronized issue tracking (GitHub/GitLab)
- Automated workflows

**Benefits**:
- Single source of truth for tasks
- AI agents can read/update tasks
- Issue tracking synchronized
- Progress visibility for team

**Related Documents**:
- [Git Repository Setup](./git-repository-setup.md)
- [Testing and Backup Strategy](../testing-and-backup-strategy.md)

---

## Step 1: Create Directory Structure

```bash
# Create .claude directory
mkdir -p .claude

# Add to .gitignore if needed (usually committed)
echo "# Claude AI configuration (committed for team)" >> .gitignore
```

---

## Step 2: Create TASKS.md

**File**: `TASKS.md`

**Template**:
```markdown
# Project Tasks

*Last updated: [DATE]*

---

## 🎯 Current Sprint / Immediate Tasks

### In Progress
- [ ] **[TASK-001]** Setup project structure
  - Owner: @username
  - Started: YYYY-MM-DD
  - Due: YYYY-MM-DD
  - Notes: Initial repository setup

### Todo (Priority: High)
- [ ] **[TASK-002]** Configure database
  - Owner: Unassigned
  - Priority: High
  - Estimate: 2 hours

### Todo (Priority: Medium)
- [ ] **[TASK-003]** Setup authentication
  - Owner: Unassigned
  - Priority: Medium
  - Depends on: TASK-002

---

## ✅ Completed
- [x] **[TASK-000]** Initialize repository
  - Completed: YYYY-MM-DD
  - Notes: Repository created with Git Flow strategy

---

## 📋 Backlog
- [ ] **[TASK-010]** Add user management
- [ ] **[TASK-011]** Implement email notifications
- [ ] **[TASK-012]** Create admin dashboard

---

## 🐛 Bugs
- [ ] **[BUG-001]** Login form validation not working
  - Severity: High
  - Reported: YYYY-MM-DD

---

## 💡 Feature Requests
- [ ] **[FEAT-001]** Dark mode support
  - Requested by: User
  - Priority: Low

---

## 📝 Notes

### Task ID Format
- **TASK-XXX**: Regular tasks
- **BUG-XXX**: Bug fixes
- **FEAT-XXX**: Feature requests
- **DOCS-XXX**: Documentation tasks
- **TEST-XXX**: Testing tasks

### Task States
- [ ] **Todo**: Not started
- [~] **In Progress**: Currently working
- [x] **Completed**: Finished
- [!] **Blocked**: Waiting on dependency

---

## Sync with GitHub/GitLab Issues

Tasks are synchronized with remote issues:
- Create issue: `gh issue create --title "[TASK-XXX] Title"`
- Update task: `gh issue edit <issue-number>`
- Close task: `gh issue close <issue-number>`

Last sync: [DATE]
```

---

## Step 3: Create .claude/CLAUDE.md

**File**: `.claude/CLAUDE.md`

**Template**:
```markdown
# AI Agent Instructions

*Project: [PROJECT NAME]*

---

## Project Overview

**Description**: [Brief description of what this project does]

**Tech Stack**:
- **Backend**: [Laravel 11 / Django / Express]
- **Frontend**: [Vue.js / React / Blade]
- **Database**: [PostgreSQL / MySQL / Supabase]
- **Authentication**: [Sanctum / Passport / JWT]

**Key Features**:
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

---

## Development Guidelines

### Code Style
- Follow [PSR-12 / PEP 8 / Airbnb Style Guide]
- Run linters before committing
- Use pre-commit hooks (configured)

### Testing
- Write tests for all new features
- Run tests with: `[composer test / pytest / npm test]`
- Parallel testing enabled: `[paratest --processes=auto]`
- Target coverage: 70%+

### Git Workflow
- **Strategy**: [Simple / Git Flow / GitHub Flow]
- **Main Branch**: main
- **Feature Branches**: feature/task-name
- **Commit Format**: Conventional Commits (feat/fix/docs/test/chore)
- **NEVER add AI co-author attribution**

---

## Task Management

### Location
- **Local**: `TASKS.md`
- **Remote**: [GitHub/GitLab] Issues
- **Sync**: Manual or automated (see scripts)

### Workflow
1. Check `TASKS.md` for current tasks
2. Update task status when working
3. Create issues for new tasks
4. Sync TASKS.md with remote issues regularly

---

## Database Safety 🔴 CRITICAL

**NEVER run database commands without backups!**

### Backup Before
- Running migrations
- Running tests (if using real DB)
- Running seeders
- Database operations

### Safety Wrappers
All database-touching commands MUST use safety wrappers:
```bash
# WRONG - NEVER do this:
php artisan migrate
pytest

# CORRECT - Always use safe wrapper:
./scripts/safe-test.sh php artisan migrate
./scripts/safe-test.sh pytest
```

See: [Database Backup Strategy](../docs/database-backup-strategy.md)

---

## API Documentation

- **Tool**: [Scramble / Swagger / Auto-generated]
- **URL**: [/docs/api]
- **OpenAPI Spec**: [storage/api-docs/openapi.json]
- **Mermaid Diagrams**: [docs/api-workflow.md]

### Generate Docs
```bash
[php artisan scramble:generate / npm run docs]
```

---

## Environment Setup

### Required Environment Variables
```bash
# Database
DB_CONNECTION=[pgsql/mysql/sqlite]
DB_HOST=[localhost or Supabase host]
DB_DATABASE=[database name]
DB_USERNAME=[username]
DB_PASSWORD=[password]

# Authentication (if using external services)
[CLERK_SECRET_KEY / AUTH0_DOMAIN / etc.]

# Services
[REDIS_HOST / QUEUE_CONNECTION / etc.]
```

### Setup Commands
```bash
# Install dependencies
[composer install && npm install]

# Environment
cp .env.example .env
php artisan key:generate  # Laravel

# Database
[php artisan migrate / python manage.py migrate]

# Run tests
[composer test / pytest / npm test]

# Start dev server
[php artisan serve / python manage.py runserver / npm run dev]
```

---

## Common Tasks

### Run Tests
```bash
[composer test / pytest --cov / npm test]
```

### Run Linters
```bash
[./vendor/bin/phpstan analyse / flake8 . / npm run lint]
```

### Format Code
```bash
[./vendor/bin/php-cs-fixer fix / black . / npm run format]
```

### Database Operations
```bash
# ALWAYS with safety wrapper
./scripts/safe-test.sh php artisan migrate
./scripts/safe-test.sh php artisan db:seed
```

---

## AI Agent Notes

### What AI Agents Should Know
- Read this file before starting any task
- Check `TASKS.md` for current priorities
- Follow git workflow strictly
- Never skip database backups
- Run tests before committing
- Update documentation when changing APIs

### Prohibited Actions
- ❌ Running database commands without backups
- ❌ Adding AI co-author to commits
- ❌ Skipping tests
- ❌ Committing without linting
- ❌ Force-pushing to main/develop

---

## Troubleshooting

### Common Issues
1. **Tests failing**: Check database state, run migrations
2. **Linter errors**: Run formatter, fix manually
3. **Pre-commit blocked**: Fix issues, don't use --no-verify

### Get Help
- Check documentation: [/docs]
- Review similar code in codebase
- Check framework documentation
- Ask team (if applicable)

---

## Project Structure

```
[project-root]/
├── app/                # Application code
├── tests/              # Test files
├── docs/               # Documentation
├── scripts/            # Helper scripts
├── .claude/            # AI agent config
│   └── CLAUDE.md       # This file
├── TASKS.md            # Task tracker
├── README.md           # Project readme
└── [framework-specific files]
```

---

*Keep this document updated as the project evolves!*
```

---

## Step 4: Create Helper Scripts

### Script: `scripts/sync-tasks.sh`

**Purpose**: Sync `TASKS.md` with GitHub/GitLab issues

```bash
#!/bin/bash
set -e

echo "🔄 Syncing TASKS.md with remote issues..."

# Detect hosting (GitHub or GitLab)
if command -v gh &> /dev/null && gh repo view &> /dev/null; then
    HOSTING="github"
    echo "Detected GitHub repository"
elif command -v glab &> /dev/null && glab repo view &> /dev/null; then
    HOSTING="gitlab"
    echo "Detected GitLab repository"
else
    echo "❌ No remote repository detected or CLI not installed"
    exit 1
fi

# Extract tasks from TASKS.md
echo "📝 Reading TASKS.md..."

# Create issues for uncreated tasks
# (This is a simple example - expand based on needs)
grep -E '^\- \[ \] \*\*\[TASK-[0-9]+\]\*\*' TASKS.md | while read -r line; do
    # Extract task ID and title
    TASK_ID=$(echo "$line" | grep -oP 'TASK-\d+')
    TITLE=$(echo "$line" | sed 's/.*\] //')

    echo "Creating issue for $TASK_ID: $TITLE"

    if [ "$HOSTING" = "github" ]; then
        gh issue create --title "[$TASK_ID] $TITLE" --body "Tracked in TASKS.md"
    else
        glab issue create --title "[$TASK_ID] $TITLE" --description "Tracked in TASKS.md"
    fi
done

echo "✅ Sync complete!"
echo "Last sync: $(date)" >> TASKS.md
```

**Make executable**:
```bash
chmod +x scripts/sync-tasks.sh
```

---

### Script: `scripts/create-task.sh`

**Purpose**: Helper to create tasks consistently

```bash
#!/bin/bash
set -e

echo "📝 Create New Task"
echo ""

# Get last task number
LAST_NUM=$(grep -oP 'TASK-\K\d+' TASKS.md | sort -n | tail -1)
NEXT_NUM=$((LAST_NUM + 1))
TASK_ID=$(printf "TASK-%03d" $NEXT_NUM)

echo "Task ID: $TASK_ID"
read -p "Task title: " TITLE
read -p "Priority (High/Medium/Low): " PRIORITY
read -p "Estimate (hours): " ESTIMATE

# Add to TASKS.md
TASK_ENTRY="- [ ] **[$TASK_ID]** $TITLE
  - Owner: Unassigned
  - Priority: $PRIORITY
  - Estimate: $ESTIMATE hours
"

# Insert into appropriate section
sed -i "/### Todo (Priority: $PRIORITY)/a $TASK_ENTRY" TASKS.md

echo "✅ Task $TASK_ID created in TASKS.md"

# Optionally create remote issue
read -p "Create GitHub/GitLab issue? (y/n): " CREATE_ISSUE
if [ "$CREATE_ISSUE" = "y" ]; then
    if command -v gh &> /dev/null; then
        gh issue create --title "[$TASK_ID] $TITLE" --body "Priority: $PRIORITY
Estimate: $ESTIMATE hours"
    elif command -v glab &> /dev/null; then
        glab issue create --title "[$TASK_ID] $TITLE" --description "Priority: $PRIORITY
Estimate: $ESTIMATE hours"
    fi
fi
```

**Make executable**:
```bash
chmod +x scripts/create-task.sh
```

---

## Step 5: Add to Git

```bash
# Add files
git add TASKS.md .claude/CLAUDE.md scripts/

# Commit
git commit -m "chore: initialize task management system"

# Push
git push origin main
```

---

## Step 6: Initial Task Population

**Agent Action**: Create initial tasks based on project setup:

1. Framework configuration (if not done)
2. Database setup
3. Authentication implementation
4. Testing setup
5. CI/CD pipeline
6. Documentation

**Example**:
```bash
# Use helper script
./scripts/create-task.sh

# Or manually edit TASKS.md
```

---

## Task Management Workflow

### Daily Workflow

1. **Morning**: Review `TASKS.md`, check priorities
2. **Start Task**: Move to "In Progress", update owner
3. **Work**: Commit regularly with task ID in commits
4. **Complete**: Move to "Completed", close remote issue
5. **End of Day**: Update status, add notes

### Git Commit with Task ID

```bash
git commit -m "feat(TASK-002): implement user authentication"
git commit -m "fix(BUG-001): resolve login validation issue"
```

### AI Agent Integration

**AI agents should**:
1. Read `TASKS.md` at session start
2. Ask which task to work on
3. Update task status when working
4. Mark complete when done
5. Create new tasks for discovered issues

---

## Automation (Optional)

### GitHub Actions for Task Sync

**File**: `.github/workflows/sync-tasks.yml`

```yaml
name: Sync Tasks

on:
  push:
    paths:
      - 'TASKS.md'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Sync with Issues
        run: ./scripts/sync-tasks.sh
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Best Practices

1. **Update regularly**: Keep TASKS.md current
2. **Use task IDs**: Reference in commits and PRs
3. **Sync frequently**: Don't let local/remote diverge
4. **Clear descriptions**: Be specific about what needs doing
5. **Track blockers**: Note dependencies clearly
6. **Celebrate completion**: Move tasks to completed section

---

## Next Steps

After task management setup:
1. ✅ Create initial tasks
2. ✅ Test helper scripts
3. ✅ Proceed to [Database Backup Setup](../database-backup-strategy.md)
4. ✅ Begin first task!

---

*Good task management leads to successful projects!*
