# Changelog

All notable changes to CodeAssist will be documented in this file.

## [1.3.0] - 2025-01-11

### Added - AI/ML Skills & Tooling

**New AI/ML Skills:**
- `rag-architecture` - RAG systems: chunking, embeddings, vector DBs, retrieval, reranking
- `agentic-design` - Agent loops, tool calling, memory systems, multi-agent coordination, guardrails
- `llm-integration` - LLM API patterns, streaming, error handling, cost optimization, provider abstraction
- `persistent-memory` - Cross-session context management with claude-mem integration

**New Commands:**
- `/ai [task]` - AI Engineer agent for ML/AI systems, LLM integration, RAG, agents, MLOps
- `/skill-create [desc]` - Create new skills using the open SKILL.md standard
- `/mem-setup` - Set up persistent memory with claude-mem plugin

### Integrations

**[claude-mem](https://github.com/thedotmack/claude-mem):**
- Persistent memory across Claude Code sessions
- SQLite + Chroma vector storage
- Web UI at localhost:37777
- Privacy tags for sensitive content
- Auto-capture via lifecycle hooks

**[SkillsMP](https://skillsmp.com/):**
- Added to Notable Mentions
- 32,000+ community skills using SKILL.md format
- Compatible with Claude Code, OpenAI Codex CLI, GitHub Copilot

### Documentation
- Added "AI/ML Skills" section to CLAUDE.md and skills/README.md
- Added "AI/ML Commands" section to main README
- Created `docs/community-skills-recommendations.md` with skill discovery resources
- Updated component counts: 40 skills, 45 commands

---

## [1.2.0] - 2025-01-09

### Added
- **Agency Agents Tier 3 Integration** - 11 dev-focused commands from [agency-agents](https://github.com/msitarzewski/agency-agents)

**Engineering Commands:**
- `/prototype` - Rapid MVP development in <3 days
- `/backend` - System design, scalability, architecture patterns
- `/devops` - CI/CD pipelines, infrastructure automation
- `/ai` - ML/AI systems, LLM integration, MLOps

**Testing Commands:**
- `/api-test` - API security, functional, performance testing
- `/benchmark` - Load testing, Core Web Vitals, performance profiling
- `/test-analyze` - Test failure analysis, pattern detection, fix recommendations

**Product Analytics Commands:**
- `/analytics` - KPI dashboards, metrics analysis, AARRR framework
- `/experiment` - A/B testing, feature flags, statistical analysis
- `/synthesize` - Aggregate feedback from multiple sources into insights
- `/ux-research` - User research, usability testing, interview guides

### Documentation
- Added "Engineering Commands" section
- Added "Testing Commands" section
- Added "Product Analytics Commands" section
- Updated "Notable Mentions" with Tier 3 agents

---

## [1.1.0] - 2025-01-09

### Added
- **Agency Agents Integration** - 10 commands inspired by [agency-agents](https://github.com/msitarzewski/agency-agents) by [@msitarzewski](https://github.com/msitarzewski)

**Project & Design Commands:**
- `/project` - Project charters, status reports, dependency mapping
- `/ux` - Design tokens, themes, responsive patterns, accessibility
- `/summary` - SCQA framework, executive decision briefs

**Analysis & QA Commands:**
- `/evidence` - Screenshot-based QA validation
- `/brand` - Design/brand consistency audits
- `/trends` - Market trends and competitive analysis
- `/optimize` - Workflow optimization and automation

### Changed
- **`/plan` enhanced** - RICE scoring, MoSCoW prioritization, risk assessment, capacity planning
- **`/review` enhanced** - Skeptical "fantasy-immune" validation, evidence-based grading, claim verification
- **`/orchestrate` enhanced** - Quality gates, 3-retry policy, task-by-task validation, context handoffs

### Documentation
- Added "Project & Design Commands" section
- Added "Analysis & QA Commands" section
- Added "Notable Mentions" section with agency-agents attribution

---

## [1.0.10] - 2025-01-02

### Added
- **`/gitsetup` command** - Set up git hooks for clean workflow
  - Protects main/master from direct push
  - Strips Claude Code mentions from commit messages
  - Local hooks (pre-push, commit-msg)

---

## [1.0.9] - 2025-01-01

### Added
- **Session persistence** - Continue work after updates or restarts
  - `/save-session` - Save current context for later
  - `/resume-session` - Resume from saved context
  - `/ca-update` now automatically saves context before updating
- Seamless update workflow: update → restart Claude → `/resume-session`

---

## [1.0.8] - 2025-01-01

### Added
- **Branch discipline workflow** - One branch per issue, worktree support
  - `/branch [id] [desc]` - Create focused branch with checklist
  - `/branch [id] [desc] -w` - Create with worktree for parallel work
  - `/branch-status` - Check progress on current branch
  - `/branch-done` - Complete branch, verify checklist, create PR
  - `/branch-list` - List all active branches and worktrees
  - `branch-discipline` skill with principles and workflow
- **Mentor reviews in branch workflow** - Before starting + before PR

### Changed
- Renamed `/update` to `/ca-update` to avoid conflicts with Claude Code
- Improved `/ca-update` to show changelog summary and what's new

---

## [1.0.7] - 2025-01-01

### Added
- **YAML linting** in all CI templates (GitLab CI + GitHub Actions)
  - Validates YAML syntax with yamllint
  - Relaxed mode for all files, strict mode for CI configs
  - Non-blocking (allow_failure: true)

---

## [1.0.6] - 2025-01-01

### Added
- **`/quickstart` command** - Interactive onboarding for new users
- **`docs/INDEX.md`** - Central navigation hub for all documentation
- **`docs/getting-started.md`** - 5-minute quick start guide
- **`docs/team-usage.md`** - Solo vs team setup considerations
- **`docs/team-adoption.md`** - Step-by-step team adoption guide
- **Security audit reference docs** - Platform-specific commands
  - `docs/security-audit/linux.md`
  - `docs/security-audit/windows.md`
  - `docs/security-audit/docker.md`
- **CI/CD templates** for GitLab CI and GitHub Actions
  - Laravel, Django, React, Full-stack templates
  - Both platforms supported equally
- **`system-architect` skill** - Security audits and system hardening
- **`ci-templates` skill** - CI/CD pipeline principles
- **`/architect` command** - System security analysis

### Changed
- Slimmed `ci-templates` skill from 477 to 176 lines (principles only)
- Slimmed `system-architect` skill from 625 to 218 lines (principles only)
- Skills now contain principles; reference docs contain commands
- README updated with team section and navigation links
- Repository structure updated to reflect docs/ organization

### Fixed
- Removed empty `skills/framework/` directory

---

## [1.0.5] - 2024-12-31

### Added
- **`resource-limiting` skill** - Protect shared servers from resource exhaustion
  - Use `nice`, `ionice`, `cpulimit` to limit CPU/IO usage
  - Prevent tests from killing other sites on shared servers
- **`/test` command updated** with resource limiting options
  - Detects shared server environment
  - Provides multiple resource limiting strategies
  - Recommends `nice -n 19 ionice -c 3 --processes=1`

### Changed
- Now 32 skills (was 31)

---

## [1.0.4] - 2025-12-09

### Changed
- **Commands moved to `commands/`** - now consistent with `skills/` at repo root
  - Both commands and skills are visible when browsing the repo
  - Install script copies from `commands/` to `.claude/commands/`
- Added `commands/README.md` with full command reference and links

### Removed
- `.claude-plugin/` - outdated v3.x plugin metadata
- `backups/` - empty leftover folder

### Kept
- `.mcp.json` - MCP server configs for Lighthouse and Chrome DevTools (used by skills)
- `.env.remote-agents.example` - config template for remote-code-agents skill

---

## [1.0.3] - 2025-12-09

### Changed
- Install script now **cleans up old installation** before installing
  - Removes old `.claude/skills/` and `.claude/commands/` to prevent stale v3.x files
  - Ensures clean upgrade from any previous version
- Added step 1 "Cleaning up old installation" (now 7 steps total)

### Fixed
- Projects with old v3.x skills framework now properly upgrade to v1.x

---

## [1.0.2] - 2025-12-09

### Added
- All 24 commands now installed (was 22, added `agent-select`, `orchestrate`)
- Quality Commands section in README (`/security`, `/refactor`, `/docs`)
- Research Commands section in README (`/explore`, `/research`)
- Quick Start Prompts section in README

### Changed
- `skills/README.md` now lists all 31 skills (was ~18)
- `.claude/CLAUDE.md` updated with all commands and workflow
- Install script now includes all 24 commands

---

## [1.0.1] - 2025-12-09

### Added
- `/ca-update` command - Check for CodeAssist updates
- `/brainstorm` command - Discuss approach before implementing
- `/plan` command - Break work into actionable tasks
- `/verify` command - Final checks before completing work
- "Workflow Commands" section in README
- "Advanced" section in README documenting prompt templates and CI/CD runners
- Verification steps to all platform setup scripts (confirms tools work after install)
- Manual install option in README for security-conscious users

### Changed
- Simplified `docs/README.md` from 552 lines to 75 lines
- Consolidated all commands into `.claude/commands/` (single source of truth)
- Version now only in `.claude/VERSION` (removed from README, skills/README, agents/README)

### Removed
- Old `commands/` folder (merged into `.claude/commands/`)
- `docs/SKILLS-ENFORCEMENT.md` (referenced removed fake enforcement)
- `docs/ai-agent-project-initialization-prompt.md.backup`
- `UPDATE-TO-v3.1.4.md`
- `scripts/setup-session-reminder.sh` (orphaned, referenced non-existent commands)

---

## [1.0.0] - 2025-12-09

Initial release as an assistant library for Claude Code.

### What is CodeAssist?

An assistant library that provides:
- **Skills** - Documented best practices (database backup, code review, TDD)
- **Commands** - Slash commands that do real work (`/status`, `/review`, `/test`)
- **Prompt Templates** - Specialized context for different frameworks

### Features

**Action Commands:**
- `/status` - Shows git status, branch, recent commits
- `/review` - Runs code review with tests and checks
- `/test` - Creates backup and runs tests
- `/backup` - Creates database backup
- `/commit` - Pre-commit checklist and commit

**Framework Commands:**
- `/laravel` - Laravel development
- `/react` - React/Next.js development
- `/python` - Python development
- `/db` - Database operations

**Utility Commands:**
- `/mentor` - Critical analysis
- `/guide` - Help with what to do next
- `/feedback` - Submit feedback with version info

**Skills:**
- `database-backup` - Backup before tests/migrations
- `code-review` - Self-review checklist
- `test-driven-development` - Write tests first
- `brainstorming` - Design before implementation
- And more in `.claude/skills/`

**Scripts:**
- `backup-database.sh` - Create database backups
- `restore-database.sh` - Restore from backup
- `safe-test.sh` - Backup + run tests
- `safe-migrate.sh` - Backup + run migrations

**Git Hooks (optional):**
- `pre-commit` - Runs tests/linters before commit
- `commit-msg` - Validates commit message

### Installation

```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
echo ".claude/" >> .gitignore
```

### Attribution

Skills framework based on [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent.

---

## Pre-1.0 History

Versions 3.x were experimental iterations that included:
- Over-engineered "multi-agent system" positioning
- Fake "enforcement hooks" that didn't actually work
- Aggressive, manipulative language in documentation

Version 1.0.0 is a clean restart with:
- Honest positioning as an "assistant library"
- Commands that do real work
- Professional, practical documentation
- Focus on what actually helps users
