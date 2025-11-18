# CodeAssist

*Professional software development with AI-powered skills framework*

---

## 📚 What is This?

CodeAssist combines professional development workflows with the Superpowers skills methodology to create a comprehensive framework for AI-assisted software development.

**Version 3.1.3** introduces **MCP Tools Integration** with dedicated skills for Lighthouse performance optimization and Chrome DevTools automation. Built on proven methodologies from [@obra's Superpowers](https://github.com/obra/superpowers) combined with CodeAssist's framework-specific guides for Laravel, Python, JavaScript, and mobile development.

### 🆕 What's New in v3.1.3 (2025-11-17)

- **29 Production-Ready Skills**: Complete Superpowers + MCP Tools + Design
  - 8 Core Workflow Skills (brainstorming, planning, execution, code review, verification)
  - **5 Testing Skills** (TDD, condition-based waiting, anti-patterns, Playwright, **Lighthouse Performance** ⚡NEW)
  - **6 Workflow Skills** (git-platform-cli, git, worktrees, parallel agents, branch finishing, subagent-driven)
  - **3 Safety Skills** (database backup, defense-in-depth, pre-commit hooks)
  - **3 Debugging Skills** (systematic, root-cause tracing, **Browser Automation** ⚡NEW)
  - **1 Design Skill** (**Frontend Design** ⚡NEW - Adapted from Anthropic Skills)
  - 3 Meta Skills (writing skills, testing skills, sharing skills)

- **🔧 MCP Servers Integrated** (NEW):
  - **Lighthouse MCP** - Performance auditing via Claude Code
  - **Chrome DevTools MCP** - Browser automation with 26 tools
  - Project configuration: `.mcp.json` in root
  - Full documentation in Development Tooling Guide

- **🔧 MANDATORY Tools** (NEW):
  - **GitHub CLI (`gh`)** - REQUIRED for all projects
  - **GitLab CLI (`glab`)** - REQUIRED for all projects
  - Unified issue/task management across platforms
  - Automatic issue creation from TodoWrite tasks
  - Commit ↔ Issue linking
  - Automated PR/MR creation with issue references

- **🛡️ Strong Enforcement (NEW)**: Solves "skills getting lost" problem
  - **Enforcement Guide** (`docs/SKILLS-ENFORCEMENT.md`) - Re-read weekly
  - **Ultra-Compact Checklist** for `.claude/CLAUDE.md` - Token-optimized (50 tokens vs 200)
  - **Regular Reminders**: Every 10 tasks OR every hour (lightweight, not full re-read)
  - **3 Enforcement Checkpoints**: After code, before commit, periodic discipline check
  - **Mandatory Commands**: `/commit-checklist` before EVERY commit
  - **Iron Laws Added**: code-review (3), git-workflow (5), verification (3)

- **💰 Token Optimization**:
  - Lightweight keyword checklist: `USE READ ANNOUNCE REVIEW VERIFY CONSISTENT`
  - Strategic full reads only (session start, weekly, when lost)
  - **3-5x more efficient** than re-reading every 10 tasks

- **Complete Infrastructure**: Agents, hooks, commands for Claude Code
- **Claude Marketplace Ready**: Full plugin configuration
- **Skills Installation**: One-command local installation script (`install-skills.sh`)
- **Mandatory Protocols**: Database backups enforced, NO AI co-author in commits
- **TDD Methodology**: Skills validated with pressure scenarios
- **Persuasion Principles**: Reliable AI behavior through authority, commitment, scarcity, social proof

[See complete v3.1.1 changes in CHANGELOG.md](CHANGELOG.md)

## 🚀 Quick Start Prompts

**Choose the prompt that matches your situation:**

| Situation | Prompt to Use | What It Does |
|-----------|--------------|--------------|
| 🆕 **New Project** | [Initialize New Project](#-initialize-new-project-with-skills-framework) | Full setup with skills framework |
| 🔄 **Update Existing Project** | [Update Project](#-update-project-to-latest-codeassist) | Update skills to latest version |
| 🛡️ **Install Hybrid Enforcement** | [Install Enforcement](#️-install-hybrid-enforcement-system-existing-projects) | Add blocking hooks to existing project |
| 🤖 **Update Agent Only** | [Self-Update Agent](#-self-update-agent-only-without-project-changes) | Update AI knowledge without files |

---

### 🆕 Initialize New Project with Skills Framework

**Copy-paste this to start a new project with full AI-guided setup (v3.1.1 with Skills):**

```
Initialize a new project using CodeAssist v3.1.1 with Skills Framework:

1. Fetch and read the Skills Index: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/skills/README.md (understand all 29 skills)
2. Fetch the install script: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh
3. Run the script to install all 29 skills locally: bash install-skills.sh
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

### 🔄 Update Project to Latest CodeAssist

**Use this prompt in any existing project to update CodeAssist integration:**

```
Update this project to the latest CodeAssist v3.1.3 with MCP Tools Integration:

1. Check current skills version:
   - If .claude/skills/ exists, check: find .claude/skills -name "SKILL.md" | wc -l
   - Report current count and version

2. Update to latest skills:
   - Fetch: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh
   - Run: bash install-skills.sh
   - This installs/updates all 29 skills to .claude/skills/

3. Add MCP servers:
   - Create .mcp.json with Lighthouse and Chrome DevTools MCP
   - Fetch config: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/.mcp.json
   - Copy to project root

4. Verify installation:
   - Count: find .claude/skills -name "SKILL.md" | wc -l (should be 29)
   - Version: read .claude/skills/README.md and report version + last updated
   - Check .mcp.json exists

5. Read what's new:
   - CHANGELOG: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/CHANGELOG.md
   - Report any breaking changes or new skills

6. Confirm understanding:
   - using-skills protocol (MANDATORY for EVERY task)
   - database-backup skill (MANDATORY before ANY database operation)
   - Skills workflow: brainstorm → plan → execute → review → verify
   - NEW: lighthouse-performance-optimization for web performance
   - NEW: browser-automation-debugging for Chrome DevTools automation
   - NEW: frontend-design for distinctive UI development

7. Report completion:
   - Skills updated: [old count] → 29
   - MCP servers: Lighthouse + Chrome DevTools
   - New skills added: [list any new ones]
   - Ready to work with latest CodeAssist v3.1.3
```

**Ultra-Quick Version:**
```
Update CodeAssist: Check .claude/skills/ count, fetch and run https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh, add .mcp.json from repo, verify 29 skills + MCP servers, read CHANGELOG, confirm protocols. Report what's new.
```

---

### 🛡️ Install Hybrid Enforcement System (Existing Projects)

**Use this to add the revolutionary blocking hooks system to any existing project:**

```
Install CodeAssist v3.1.3 Hybrid Enforcement System in this project:

🎯 What This Does:
- Installs 4-tier hybrid enforcement with blocking hooks
- BLOCKS database operations without backup
- BLOCKS commits without code review + verification
- BLOCKS after 3 edits without review
- 90% token reduction vs previous approach

📦 Installation Steps:

1. Fetch and run the hooks installer:
   curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-hooks.sh -o install-hooks.sh
   chmod +x install-hooks.sh
   ./install-hooks.sh

2. Verify installation:
   - Check: ls -la .claude/SKILLS-DECISION-TREE.md (decision tree installed?)
   - Check: ls -la .claude/settings.json (settings installed?)
   - Check: ls -la hooks/*.sh (4 hooks installed?)
   - Report what was installed

3. Read the hybrid enforcement guide:
   https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/SKILLS-ENFORCEMENT.md

4. Test the system (IMPORTANT):
   - Explain how database operations will now be blocked without backup
   - Explain how commits will now be blocked without verification
   - Explain how code edits trigger review enforcement

5. Configure token budget (optional):
   - Read .claude/settings.json
   - Explain the 4 presets: unlimited, balanced (default), efficient, minimal
   - Ask user which preset they prefer

6. Confirm understanding:
   ✅ Decision tree always loaded (200 tokens)
   ✅ Blocking hooks enforce safety (0 tokens, system-level)
   ✅ Periodic reminders every 10 requests (50 tokens)
   ✅ Critical skills read when justified (3500 tokens)
   ✅ Total: ~10,700 tokens per 100 requests (vs 100,000+ before)

Report installation complete and enforcement mode active.
```

**Ultra-Quick Version:**
```
Install hybrid enforcement: curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-hooks.sh | bash, verify .claude/SKILLS-DECISION-TREE.md and hooks/*.sh installed, read enforcement guide, explain blocking enforcement now active, report token budget preset (balanced default). Test: explain what happens if I run "php artisan migrate" or "git commit" now.
```

**What Gets Blocked:**
- 🛑 `php artisan migrate` without backup → BLOCKED
- 🛑 `npm test` without backup → BLOCKED
- 🛑 3+ code edits without review → BLOCKED
- 🛑 `git commit` without verification → BLOCKED

**Why This Matters:**
- Based on 2 production database wipes (6 months data lost, 4 hours recovery)
- 60% of bugs caught during code review (currently being skipped)
- Skills framework "gets lost" during sessions (now system-enforced)

---

### 🔄 Self-Update Agent Only (Without Project Changes)

**Use this to update the AI agent's knowledge without installing files:**

```
Update to latest CodeAssist v3.1.1 documentation:

1. Read Skills Index: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/skills/README.md (all 25 skills)
2. Read Init Prompt: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/ai-agent-init-with-skills.md
3. Read Enforcement Guide: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/SKILLS-ENFORCEMENT.md (NEW - token-optimized)
4. Read Key Guides: database-backup-strategy.md, git-branching-strategy-guide.md
5. Confirm understanding: using-skills protocol, database-backup mandatory, ultra-compact enforcement checklist
6. Report version and acknowledge ready to work with v3.1.1
```

**Quick Version:**
```
Read https://raw.githubusercontent.com/liauw-media/CodeAssist/main/skills/README.md, https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/ai-agent-init-with-skills.md, https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/SKILLS-ENFORCEMENT.md. Confirm using-skills protocol and ultra-compact enforcement checklist. Report ready with v3.1.1.
```

---

## 🎯 Skills Framework (v3.1.1)

CodeAssist includes a complete skills framework with **26 systematic protocols** for professional development:

### 🔧 Mandatory Tools (Install First)

**Before installing skills, ensure these CLIs are installed:**

```bash
# Check if installed
gh --version   # GitHub CLI (REQUIRED)
glab --version # GitLab CLI (REQUIRED)
```

**Installation:**

```bash
# GitHub CLI
# Windows:
winget install GitHub.cli

# macOS/Linux:
brew install gh

# GitLab CLI
# Windows: Download from https://gitlab.com/gitlab-org/cli/-/releases
# macOS/Linux:
brew install glab
```

**Why MANDATORY**:
- Issue/task management integration
- TodoWrite → GitHub/GitLab issues
- Commit ↔ Issue linking
- Automated PR/MR creation
- Traceability and automation

### 🚀 Quick Skills Installation

Install all 26 skills locally in any project:

```bash
# Clone or download the install script
curl -O https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh
chmod +x install-skills.sh

# Run installation
./install-skills.sh

# Skills now available in ./.claude/skills/ directory (unified location)
```

### 📚 Skills Breakdown (26 Total)

**Critical Skills (MANDATORY):**
- `using-skills` - Protocol for EVERY task (mandatory first response)
- `database-backup` - MANDATORY before ANY database operation ⚠️
- `git-platform-cli` - MANDATORY gh/glab for issues/tasks ⚠️ NEW
- `verification-before-completion` - MANDATORY before EVERY commit ⚠️
- `pre-commit-hooks` - MANDATORY setup for ALL projects ⚠️

**Core Workflow (8 skills):**
- Brainstorming, writing plans, executing plans, code review, requesting review, receiving review, verification

**Testing (4 skills):**
- Test-driven development, condition-based waiting, testing anti-patterns, Playwright MCP frontend testing

**Workflow (6 skills):**
- **Git platform CLI (gh/glab)** NEW, Git workflow (5 Iron Laws), git worktrees, parallel agents, branch finishing, subagent-driven development

**Safety (3 skills):**
- Database backup (CRITICAL), defense-in-depth validation, pre-commit hooks

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

### ⚠️ Hybrid Enforcement System (v3.1.1)

**Problem**: Skills usage "gets lost" over time and differs across projects.

**Solution**: 4-Tier HYBRID system with blocking hooks + token optimization

**🎯 How It Works:**

1. **Tier 1: Decision Tree** (Always loaded, 200 tokens)
   - Pattern matching for automatic skill detection
   - File: `.claude/SKILLS-DECISION-TREE.md`

2. **Tier 2: Blocking Hooks** (0 tokens - system enforced)
   - 🛑 BLOCKS database operations without backup
   - 🛑 BLOCKS 3+ edits without code review
   - 🛑 BLOCKS commits without verification
   - NOT relying on agent memory!

3. **Tier 3: Periodic Reminders** (50 tokens every 10 requests)
   - Ultra-compact checklist
   - NOT full skill re-reads

4. **Tier 4: Context Injection** (3500 tokens when critical)
   - Only for safety-critical moments
   - Full skill content justified

**Token Budget**: ~10,700 tokens per 100 requests (90% reduction vs re-reading)

**📋 Ultra-Compact Skills Checklist** (Add to `.claude/CLAUDE.md`):
```
⚠️ SKILLS CHECK:
□ USE □ READ □ ANNOUNCE
□ WORKFLOW: brainstorm→plan→execute→REVIEW→verify→commit
□ CONSISTENT

CRITICAL: REVIEW after code? VERIFY before commit?
```
**Token cost**: ~50 tokens (4x more efficient than verbose checklist)

**💰 Token Optimization Strategy:**
- **Lightweight reminders**: Every 10 tasks (ultra-compact checklist above, ~0 tokens)
- **Full document reads**: Only when needed (session start, weekly, when lost)
- **3-5x more efficient** than re-reading every 10 tasks

**Mandatory Git Workflow (5 Iron Laws):**
- ✅ NO AI co-author in commits
- ✅ NO commits without `verification-before-completion` skill
- ✅ Small, precise commits (one logical change)
- ✅ Frontend + Backend = BOTH tests required
- ✅ Pre-commit hooks MANDATORY for ALL projects

**3 Enforcement Checkpoints:**
1. **After code implementation**: Did I use code-review? Did I run tests?
2. **Before every commit**: Code-review done? Verification done? Tests passed?
3. **Every 10 tasks OR 1 hour**: Ultra-compact skills check (above)

**Commands for Enforcement:**
```bash
/commit-checklist   # MANDATORY before git commit
/session-start      # Start of every work session
/check-updates      # Monthly skills framework updates
```

**📦 Install Hybrid Enforcement:**
```bash
# One command to install all hooks
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-hooks.sh | bash

# Or download and run:
curl -O https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-hooks.sh
chmod +x install-hooks.sh
./install-hooks.sh
```

**🎛️ Configure Token Budget** (`.claude/settings.json`):
- **Unlimited**: No limits (quality first)
- **Balanced**: ~20K tokens/100 requests (DEFAULT)
- **Efficient**: ~10K tokens/100 requests
- **Minimal**: ~5K tokens/100 requests

**Enforcement Guide**: [docs/SKILLS-ENFORCEMENT.md](docs/SKILLS-ENFORCEMENT.md) - Re-read weekly

**The Iron Law**: Skills framework is UNIVERSAL - same enforcement across ALL projects.

### 🔄 Keeping Skills Updated

**CodeAssist includes commands to keep your skills framework current:**

**Check for updates:**
```bash
/check-updates
```
Compares your local skills with the latest GitHub version, reports available updates.

**Update skills:**
```bash
/update-skills
```
Automatically fetches and installs the latest 25 skills to `.claude/skills/`.

**Session start reminder:**
```bash
/session-start
```
Shows pre-session checklist and skills protocol reminder.

**Setup project reminder:**
```bash
./scripts/setup-session-reminder.sh
```
Creates `.claude/SESSION_START.md` for quick reference at session start.

**Recommended maintenance:**
- ✅ Check for updates monthly
- ✅ Update before major features
- ✅ Review session reminder at start of each work session
- ✅ Commit skills to repo OR add to `.gitignore` (team decision)

**Why update regularly:**
- 🛡️ Security improvements (database backup enhancements)
- ✨ New skills added (like Playwright MCP testing)
- 🐛 Bug fixes in skill protocols
- 📚 Documentation improvements

---

## 📖 Documentation

**All documentation is in the [`docs/`](docs/) folder.**

**Main Index**: [Documentation Index](docs/README.md)

**Full Guide**: [AI Agent Project Initialization Prompt](docs/ai-agent-project-initialization-prompt.md)

## 📖 Documentation Suite

### Core Guides

- **[AI Agent Project Initialization](docs/ai-agent-project-initialization-prompt.md)** - **v3.0 Modular Architecture** - Interactive AI workflow with framework-specific and phase-based guides
- **[AI Agent Init with Skills](docs/ai-agent-init-with-skills.md)** - 🆕 **v3.1 Skills Framework** - Complete initialization with 25 skills integration
- **[Database Backup Strategy](docs/database-backup-strategy.md)** - 🛡️ **CRITICAL** - Mandatory backup procedures, disaster recovery, prevents production database wipes
- **[Git Branching Strategy](docs/git-branching-strategy-guide.md)** - Complete guide to Git workflows (GitHub & GitLab)
- **[Development Tooling](docs/development-tooling-guide.md)** - Comprehensive CLI tools, linters, formatters reference (includes Paratest for PHP)
- **[API Documentation Guide](docs/api-documentation-guide.md)** - Automated API docs with OpenAPI/Swagger for all frameworks
- **[CI/CD Runners Setup](docs/cicd-runners-guide.md)** - Self-hosted runners for GitHub Actions & GitLab CI
- **[Repository Security](docs/repository-security-guide.md)** - Branch protection, access control, security best practices
- **[Wiki Setup Guide](docs/wiki-setup-guide.md)** - Using GitHub/GitLab wikis for documentation
- **[Integration Guides](docs/integration-guides.md)** - System integration patterns and best practices

### 🆕 Skills Framework (v3.1)

- **[Skills Index](skills/README.md)** - Complete index of all 25 skills with discovery guide
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
