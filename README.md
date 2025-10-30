# CodeAssist

*Professional software development documentation and project templates*

---

## 📚 What is This?

CodeAssist is a comprehensive collection of documentation, guides, and best practices for professional software development. It provides everything you need to start new projects with proper workflows, tooling, and AI-assisted development.

## 🚀 Quick Start Prompts

### 🆕 Initialize New Project

**Copy-paste this to start a new project with full AI-guided setup:**

```
Initialize a new project using the CodeAssist framework. First, fetch and read the latest AI Agent Project Initialization Prompt from https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/ai-agent-project-initialization-prompt.md, then follow the complete initialization workflow including: Phase 0 Database Safety Setup (MANDATORY), codebase analysis, requirements discovery, tech stack recommendation, Git repository setup, task management system (TASKS.md + .claude/CLAUDE.md), pre-commit hooks, and issue tracking. Remember: NO AI co-author in commits, MANDATORY database backups before ANY database operations.
```

**Ultra-Quick Version:**
```
Initialize project: Fetch https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/ai-agent-project-initialization-prompt.md and follow the complete initialization workflow. No AI co-author in commits.
```

---

### 🔄 Self-Update (Without Full Initialization)

**Use this to update your AI agent to the latest CodeAssist guidelines:**

```
Please update yourself to the latest CodeAssist documentation:

1. Fetch and read the latest versions of these guides from GitHub:
   - AI Agent Init Prompt: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/ai-agent-project-initialization-prompt.md
   - Database Backup Strategy: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/database-backup-strategy.md
   - Git Branching Strategy: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/git-branching-strategy-guide.md
   - Development Tooling Guide: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/development-tooling-guide.md

2. Report the version/last updated date of each document you fetched

3. Confirm you've updated your knowledge with the latest:
   - Database safety protocols (MANDATORY backups before tests)
   - Git commit policy (NO AI co-author attribution)
   - Self-update mechanism
   - All current best practices

4. Acknowledge you're ready to work with these updated guidelines.
```

**Quick Copy-Paste Version:**
```
Update to latest CodeAssist: Fetch https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/ai-agent-project-initialization-prompt.md, database-backup-strategy.md, git-branching-strategy-guide.md, and development-tooling-guide.md. Report versions and confirm updated knowledge of database safety, git commit policy (no AI co-author), and best practices.
```

---

## 📖 Documentation

**All documentation is in the [`docs/`](docs/) folder.**

**Main Index**: [Documentation Index](docs/README.md)

**Full Guide**: [AI Agent Project Initialization Prompt](docs/ai-agent-project-initialization-prompt.md)

## 📖 Documentation Suite

### Core Guides

- **[AI Agent Project Initialization](docs/ai-agent-project-initialization-prompt.md)** - Interactive AI workflow for setting up new projects with self-update mechanism
- **[Database Backup Strategy](docs/database-backup-strategy.md)** - 🛡️ **CRITICAL** - Mandatory backup procedures, disaster recovery, prevents production database wipes
- **[Git Branching Strategy](docs/git-branching-strategy-guide.md)** - Complete guide to Git workflows (GitHub & GitLab)
- **[Development Tooling](docs/development-tooling-guide.md)** - Comprehensive CLI tools, linters, formatters reference
- **[API Documentation Guide](docs/api-documentation-guide.md)** - Automated API docs with OpenAPI/Swagger for all frameworks
- **[CI/CD Runners Setup](docs/cicd-runners-guide.md)** - Self-hosted runners for GitHub Actions & GitLab CI
- **[Repository Security](docs/repository-security-guide.md)** - Branch protection, access control, security best practices
- **[Wiki Setup Guide](docs/wiki-setup-guide.md)** - Using GitHub/GitLab wikis for documentation
- **[Integration Guides](docs/integration-guides.md)** - System integration patterns and best practices

## 🛡️ Database Safety (CRITICAL)

**MANDATORY for all projects with databases:**

```bash
# ALWAYS backup before tests:
./scripts/safe-test.sh npm test

# NEVER run tests directly:
npm test  # ❌ WRONG - can wipe production database

# Manual backup before any database operation:
./scripts/backup-database.sh
```

**Why this matters:** We've had 2 incidents where tests wiped production databases without backups. This system prevents that.

**See**: [Database Backup Strategy Guide](docs/database-backup-strategy.md) for complete implementation.

## 🎯 What You'll Learn

- ✅ Setting up projects with AI-assisted development workflows
- ✅ **🛡️ Database safety protocols** - MANDATORY backups before tests, migrations, any database operations
- ✅ Git branching strategies (Simple, GitHub/GitLab Flow, Git Flow)
- ✅ GitHub CLI (`gh`) and GitLab CLI (`glab`) usage
- ✅ Code quality tools (linters, formatters, type checkers)
- ✅ **API documentation automation** (OpenAPI/Swagger, interactive docs)
- ✅ Safe testing practices (database isolation, automated backups, disaster recovery)
- ✅ CI/CD configuration (GitHub Actions & GitLab CI)
- ✅ Pre-commit hooks and code quality gates
- ✅ Task management with TASKS.md and issue tracking
- ✅ **AI agent self-update mechanism** - Always use latest best practices

## 🌐 Platform Support

**Supports both GitHub and GitLab**:
- GitHub & GitLab CLI commands
- Pull Requests & Merge Requests
- GitHub Actions & GitLab CI/CD
- Self-hosted GitLab instances

## 🛠️ Language Coverage

- **Python** (Django, Flask, FastAPI)
- **JavaScript/TypeScript** (Node.js, React, Vue)
- **PHP** (Laravel, Symfony)
- **Go**

## 💡 Use Cases

### Starting a New Project
1. Read the [AI Agent Project Initialization](docs/ai-agent-project-initialization-prompt.md)
2. Choose your [Git Branching Strategy](docs/git-branching-strategy-guide.md)
3. Install tools from [Development Tooling Guide](docs/development-tooling-guide.md)
4. Set up [Testing & Backup](docs/testing-and-backup-strategy.md)

### Improving Existing Projects
1. Audit your Git workflow with [Branching Strategy Guide](docs/git-branching-strategy-guide.md)
2. Add missing tools from [Tooling Guide](docs/development-tooling-guide.md)
3. Improve testing safety with [Testing & Backup Strategy](docs/testing-and-backup-strategy.md)

## 📦 What's Included

- **Project initialization workflows** with AI guidance
- **Git branching strategies** for teams of all sizes
- **CLI tool references** for GitHub & GitLab
- **Linter & formatter configurations** for multiple languages
- **Testing framework setup** with safety checks
- **CI/CD templates** for GitHub Actions & GitLab CI
- **Self-hosted runner setup** for GitHub & GitLab (complete scripts!)
- **Pre-commit hook examples**
- **Best practices** and troubleshooting guides

## 🎓 Key Concepts

### Task Management
- **TASKS.md** - Markdown-based task tracking
- **.claude/CLAUDE.md** - AI agent project instructions
- **Issue sync** - Bidirectional GitHub/GitLab integration

### Code Quality Gates
1. Pre-commit hooks
2. Linters & formatters
3. Type checkers
4. Automated tests with coverage
5. CI/CD checks
6. Code review

### AI-Assisted Development
- Clear guidelines for AI agent responsibilities
- User maintains control over code review and merging
- Safe Git workflows with branch protection

## 📋 Documentation Navigation

For detailed information, see the **[Documentation Index](docs/README.md)**.

## 🔧 Quick Reference

### GitHub CLI
```bash
gh repo create my-project --public
gh pr create --title "feat: Add feature"
gh pr merge 123 --squash
```

### GitLab CLI
```bash
glab repo create my-project --public
glab mr create --title "feat: Add feature"
glab mr merge 123
```

### Pre-commit Hooks
```bash
pip install pre-commit
pre-commit install
pre-commit run --all-files
```

## 📄 License

This documentation is provided as-is for use in your projects.

## 🤝 Contributing

Contributions welcome! These docs are meant to evolve with best practices.

---

**Start exploring**: [📚 Full Documentation Index](docs/README.md)
