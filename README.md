# CodeAssist

*Professional software development with AI-powered skills framework*

---

## 📚 What is This?

CodeAssist combines professional development workflows with the Superpowers skills methodology to create a comprehensive framework for AI-assisted software development.

**Version 3.1** introduces the complete **Skills Framework** - a systematic approach to development with mandatory protocols, TDD-validated skills, and intelligent agent coordination. Built on proven methodologies from [@obra's Superpowers](https://github.com/obra/superpowers) combined with CodeAssist's framework-specific guides for Laravel, Python, JavaScript, and mobile development.

### 🆕 What's New in v3.1

- **24 Production-Ready Skills**: Complete Superpowers implementation + CodeAssist additions
  - 8 Core Workflow Skills (brainstorming, planning, execution, code review, verification)
  - 4 Testing Skills (TDD, condition-based waiting, anti-patterns, Playwright MCP)
  - 5 Workflow Skills (git, worktrees, parallel agents, branch finishing, subagent-driven)
  - 2 Safety Skills (database backup, defense-in-depth)
  - 2 Debugging Skills (systematic debugging, root-cause tracing)
  - 3 Meta Skills (writing skills, testing skills, sharing skills)
- **Complete Infrastructure**: Agents, hooks, commands for Claude Code
- **Claude Marketplace Ready**: Full plugin configuration
- **Skills Installation**: One-command local installation script (`install-skills.sh`)
- **Mandatory Protocols**: Database backups enforced, NO AI co-author in commits
- **TDD Methodology**: Skills validated with pressure scenarios
- **Persuasion Principles**: Reliable AI behavior through authority, commitment, scarcity, social proof

[See complete v3.1 changes in CHANGELOG.md](CHANGELOG.md)

## 🚀 Quick Start Prompts

### 🆕 Initialize New Project with Skills Framework

**Copy-paste this to start a new project with full AI-guided setup (v3.1 with Skills):**

```
Initialize a new project using CodeAssist v3.1 with Skills Framework:

1. Fetch and read the Skills Index: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/skills/README.md (understand all 24 skills)
2. Fetch the install script: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh
3. Run the script to install all 24 skills locally: bash install-skills.sh
4. Fetch and read the init prompt: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/ai-agent-init-with-skills.md
5. Use using-skills protocol for EVERY task, brainstorming skill for approach, write-plans for breakdown
6. Remember: NO AI co-author in commits, MANDATORY database-backup before ANY database operation

Report installed skills and confirm ready.
```

**Ultra-Quick Version:**
```
Init with skills: Read https://raw.githubusercontent.com/liauw-media/CodeAssist/main/skills/README.md, fetch and run https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh, then read https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/ai-agent-init-with-skills.md. Report installed skills.
```

**Alternative: Without Skills Framework (v3.0 style):**
```
Initialize project: Fetch https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/ai-agent-project-initialization-prompt.md and follow the complete initialization workflow. No AI co-author in commits.
```

---

### 🔄 Self-Update (Without Full Initialization)

**Use this to update your AI agent to the latest CodeAssist v3.1 with Skills Framework:**

```
Please update yourself to the latest CodeAssist v3.1 documentation:

1. Fetch and read the Skills Framework:
   - Skills Index: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/skills/README.md (all 24 skills)
   - Install script: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh
   - Run: bash install-skills.sh (installs skills locally)

2. Fetch and read the latest guides:
   - AI Agent Init with Skills: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/ai-agent-init-with-skills.md
   - Database Backup Strategy: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/database-backup-strategy.md
   - Git Branching Strategy: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/git-branching-strategy-guide.md

3. Report:
   - Number of skills installed (should be 24)
   - Version/last updated date of each document

4. Confirm you understand:
   - using-skills protocol (MANDATORY for EVERY task)
   - database-backup skill (MANDATORY before ANY database operation)
   - Git commit policy (NO AI co-author attribution)
   - Skills workflow: brainstorm → plan → execute → review → verify

5. Acknowledge ready to work with v3.1 skills framework.
```

**Quick Copy-Paste Version:**
```
Update to CodeAssist v3.1: Read https://raw.githubusercontent.com/liauw-media/CodeAssist/main/skills/README.md, fetch and run https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh, then read ai-agent-init-with-skills.md, database-backup-strategy.md, git-branching-strategy-guide.md. Report 24 skills installed and confirm using-skills protocol for all tasks.
```

---

## 🎯 Skills Framework (v3.1)

CodeAssist includes a complete skills framework with **24 systematic protocols** for professional development:

### 🚀 Quick Skills Installation

Install all 24 skills locally in any project:

```bash
# Clone or download the install script
curl -O https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh
chmod +x install-skills.sh

# Run installation
./install-skills.sh

# Skills now available in ./skills/ directory
```

### 📚 Skills Breakdown (24 Total)

**Critical Skills (MANDATORY):**
- `using-skills` - Protocol for EVERY task (mandatory first response)
- `database-backup` - MANDATORY before ANY database operation ⚠️

**Core Workflow (8 skills):**
- Brainstorming, writing plans, executing plans, code review, requesting review, receiving review, verification

**Testing (4 skills):**
- Test-driven development, condition-based waiting, testing anti-patterns, **Playwright MCP frontend testing**

**Workflow (5 skills):**
- Git workflow, git worktrees, parallel agents, branch finishing, subagent-driven development

**Safety (2 skills):**
- Database backup (CRITICAL), defense-in-depth validation

**Debugging (2 skills):**
- Systematic debugging, root-cause tracing

**Meta (3 skills):**
- Writing skills, testing skills with subagents, sharing skills

### 🎓 Skills Philosophy

Every task follows this cycle:
1. **Check Skills** - Read skills index, identify relevant protocols
2. **Brainstorm** - Discuss approach before coding
3. **Plan** - Break into discrete tasks
4. **Execute** - One task at a time with verification
5. **Review** - Comprehensive self-review
6. **Verify** - Final checklist before completion

**See**: [Skills Index](skills/README.md) for complete guide with triggers and examples.

---

## 📖 Documentation

**All documentation is in the [`docs/`](docs/) folder.**

**Main Index**: [Documentation Index](docs/README.md)

**Full Guide**: [AI Agent Project Initialization Prompt](docs/ai-agent-project-initialization-prompt.md)

## 📖 Documentation Suite

### Core Guides

- **[AI Agent Project Initialization](docs/ai-agent-project-initialization-prompt.md)** - **v3.0 Modular Architecture** - Interactive AI workflow with framework-specific and phase-based guides
- **[AI Agent Init with Skills](docs/ai-agent-init-with-skills.md)** - 🆕 **v3.1 Skills Framework** - Complete initialization with 24 skills integration
- **[Database Backup Strategy](docs/database-backup-strategy.md)** - 🛡️ **CRITICAL** - Mandatory backup procedures, disaster recovery, prevents production database wipes
- **[Git Branching Strategy](docs/git-branching-strategy-guide.md)** - Complete guide to Git workflows (GitHub & GitLab)
- **[Development Tooling](docs/development-tooling-guide.md)** - Comprehensive CLI tools, linters, formatters reference (includes Paratest for PHP)
- **[API Documentation Guide](docs/api-documentation-guide.md)** - Automated API docs with OpenAPI/Swagger for all frameworks
- **[CI/CD Runners Setup](docs/cicd-runners-guide.md)** - Self-hosted runners for GitHub Actions & GitLab CI
- **[Repository Security](docs/repository-security-guide.md)** - Branch protection, access control, security best practices
- **[Wiki Setup Guide](docs/wiki-setup-guide.md)** - Using GitHub/GitLab wikis for documentation
- **[Integration Guides](docs/integration-guides.md)** - System integration patterns and best practices

### 🆕 Skills Framework (v3.1)

- **[Skills Index](skills/README.md)** - Complete index of all 24 skills with discovery guide
- **[Install Script](scripts/install-skills.sh)** - One-command installation of all skills locally
- **[Using Skills Protocol](skills/using-skills/SKILL.md)** - MANDATORY protocol for every task
- **[Database Backup Skill](skills/safety/database-backup/SKILL.md)** - CRITICAL safety skill (mandatory before ANY database operation)
- **[Playwright MCP Testing](skills/testing/playwright-frontend-testing/SKILL.md)** - AI-assisted browser testing

### Framework-Specific Guides (v3.0)

- **[Laravel/PHP Setup](docs/framework-configs/laravel-setup-guide.md)** - API-first, Paratest, Sanctum/Passport/Clerk, Supabase, Scramble/L5-Swagger
- **[Python Setup](docs/framework-configs/python-setup-guide.md)** - Django/FastAPI, JWT, SQLAlchemy, pytest
- **[JavaScript/TypeScript Setup](docs/framework-configs/javascript-setup-guide.md)** - Next.js, Express, NextAuth/Clerk, Prisma
- **[Mobile App Development](docs/framework-configs/mobile-app-guide.md)** - PWA (Next.js) & React Native (Expo), push notifications, deployment

### 🆕 Phase-Based Setup Guides (v3.0)

- **[Git Repository Setup](docs/phases/git-repository-setup.md)** - Local Git init, GitHub/GitLab remote, branch strategies, .gitignore templates
- **[Pre-commit Hooks Setup](docs/phases/pre-commit-hooks-setup.md)** - Language-specific hooks, linters, formatters (PHP CS Fixer, Black, ESLint)
- **[Task Management Setup](docs/phases/task-management-setup.md)** - TASKS.md, .claude/CLAUDE.md, issue sync scripts

### 🆕 Use-Case Scenarios (v3.0)

- **[Project Use-Case Scenarios](docs/project-use-case-scenarios.md)** - Pre-configured tech stacks for Laravel (5 scenarios), Python, JavaScript, Mobile (PWA/Native), and Go projects

### 🆕 Self-Hosted Development Tools (v3.0)

- **[Local Development Infrastructure](docs/local-development-infrastructure.md)** - Tailscale mesh networking, Ollama/ComfyUI local AI, n8n automation, Affine knowledge management

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

### Core Practices
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

### 🆕 v3.1: Skills Framework
- ✅ **24 Complete Skills**: All 21 Superpowers skills + 3 CodeAssist additions
- ✅ **Mandatory Protocols**: using-skills protocol for every task, database-backup before ANY database operation
- ✅ **Workflow Cycle**: Brainstorm → Plan → Execute → Review → Verify
- ✅ **Testing Skills**: TDD, condition-based waiting, anti-patterns, Playwright MCP browser testing
- ✅ **Debugging Skills**: Systematic debugging, root-cause tracing (no random debugging)
- ✅ **Local Installation**: One-command script to install all skills in any project

### v3.0: Framework-Specific Skills
- ✅ **Laravel/PHP**: API-first architecture, Paratest parallel testing, Sanctum/Passport/Clerk auth, Supabase integration
- ✅ **Mobile Development**: PWA with Next.js, React Native with Expo, push notifications, offline storage
- ✅ **Python**: Django/FastAPI setup, JWT authentication, pytest configuration
- ✅ **JavaScript**: Next.js full-stack, Express APIs, Prisma ORM, TypeScript
- ✅ **Use-Case Scenarios**: Pre-configured tech stacks for common project types (Hobby, SaaS MVP, Enterprise, Mobile)

### 🆕 v3.0: Self-Hosted Development Tools
- ✅ **Tailscale**: Secure private network mesh for connecting development services
- ✅ **Ollama/ComfyUI**: Local AI models for code assistance without API costs
- ✅ **n8n**: Self-hosted workflow automation (alternative to Zapier)
- ✅ **Affine**: Self-hosted knowledge management and documentation
- ✅ **Integration Scenarios**: Complete private development cloud setup

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

## 🙏 Attribution

CodeAssist v3.1 Skills Framework is inspired by and builds upon:

### Superpowers by Jesse Vincent

- **Blog Post**: [AI Coding Superpowers](https://blog.fsck.com/2025/10/09/superpowers/)
- **Repository**: [obra/superpowers](https://github.com/obra/superpowers)
- **Author**: Jesse Vincent ([@obra](https://github.com/obra))
- **Concepts**: Skills framework, mandatory protocols, TDD for skills, persuasion principles

CodeAssist extends the Superpowers methodology with:
- Framework-specific skills (Laravel, Python, JavaScript, Mobile)
- Production-tested safety protocols (database backup based on real incidents)
- API-first development workflows
- Self-hosted development tools integration
- Comprehensive framework setup guides

### Standing on the Shoulders of Giants

The skills framework represents accumulated wisdom from:
- **Superpowers**: Systematic AI guidance methodology
- **CodeAssist**: Framework-specific professional workflows
- **Industry Best Practices**: TDD, code review, Git workflows
- **Real Production Experience**: Database safety, testing anti-patterns
- **Professional Development Teams**: Workflows from enterprise software development

Thank you to Jesse Vincent and the Superpowers project for creating and sharing this methodology with the community.

## 🤝 Contributing

Contributions welcome! These docs are meant to evolve with best practices.

If you create new skills or improve existing ones, consider contributing back to both CodeAssist and the Superpowers project.

---

**Start exploring**: [📚 Full Documentation Index](docs/README.md) | [🎯 Skills Index](skills/README.md)
