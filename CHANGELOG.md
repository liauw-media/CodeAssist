# Changelog

All notable changes to CodeAssist will be documented in this file.

## [1.7.2] - 2025-01-27

### Improved - Session Context Preservation (#16)

**`/ca-update` Integration with `/save-session`:**
- `/ca-update` now uses `/save-session` instead of writing directly to `session-context.md`
- Preserves session history (doesn't overwrite previous sessions)
- Works with concurrent sessions (multiple terminals)
- Sessions saved as `pre-update-{version}.md` for easy identification

**Benefits:**
- Session context now integrates with `/session-list` and `/resume-session`
- No more overwriting previous session context files
- Consistent with existing session management workflow

**Usage (unchanged):**
```bash
/ca-update
# When prompted to update, session is auto-saved as:
# .claude/sessions/pre-update-1.7.1.md

# After restart:
/resume-session pre-update-1.7.1
```

### Changed - Quality Gate Weights

**Rebalanced gate weights for better design/security coverage:**

| Gate | Old Weight | New Weight | Required |
|------|------------|------------|----------|
| test | 25 | 20 | Yes |
| security | 25 | 20 | Yes |
| build | 15 | 10 | Yes |
| review | 20 | 15 | No |
| mentor | 10 | **15** | **Yes** |
| architect | 0 | **10** | No |
| ux | 5 | 5 | No |
| devops | 0 | **5** | No |

**Rationale:** Mentor and architect gates catch design/security flaws early. Making mentor required ensures architecture review happens.

### Added - Gate Presets

**New presets for different scenarios:**

| Preset | Target | Use Case |
|--------|--------|----------|
| `balanced` | 95 | Default for most projects |
| `strict` | 98 | All major gates required |
| `production` | 98 | Like strict + 90% coverage |
| `fast` | 85 | Quick iterations, minimal gates |
| `prototype` | 80 | Hackathons, MVPs |
| `frontend` | 95 | UX gate required |

**Documentation:**
- New `docs/gates.md` - Comprehensive gate configuration guide

---

## [1.7.1] - 2025-01-26

### Added - GitLab Support

**Platform Abstraction:**
- Ralph Wiggum now supports both GitHub and GitLab
- Auto-detects platform from `.gitlab-ci.yml`, `.github/`, or git remote URL
- Uses `gh` CLI for GitHub, `glab` CLI for GitLab

**Platform Operations:**
- Issue fetching: `gh issue view` / `glab issue view`
- Issue creation: `gh issue create` / `glab issue create`
- Comments: `gh issue comment` / `glab issue note`
- PR/MR creation: `gh pr create` / `glab mr create`

**Documentation:**
- Added GitLab CI/CD example in `docs/ralph.md`
- Updated troubleshooting for `glab` CLI
- Updated environment variables documentation

**Usage:**
```bash
# Platform is auto-detected - just run as usual
npx tsx ralph-runner.ts --issue=123

# GitLab projects need glab CLI installed
glab auth login
```

---

## [1.7.0] - 2025-01-24

### Added - Ollama Local LLM Integration

**Ollama Provider Support:**
- Local LLM backend via Ollama v0.14.0+
- Per-gate model selection (critical gates use Claude, others use Ollama)
- Provider indicator shows which LLM runs each gate
- Model validation with capability checking
- Tailscale integration for remote Ollama servers

**New Presets:**
- `ollama_hybrid` - Claude for critical gates, Ollama for others
- `ollama_only` - All gates use local Ollama models

**Configuration:**
```yaml
providers:
  default: claude
  ollama:
    enabled: true
    base_url: http://localhost:11434
    model: qwen3-coder
  gate_providers:
    test: claude      # Critical - use Claude
    security: claude  # Critical - use Claude
    build: ollama     # Less critical
    review: ollama    # Less critical
```

### Fixed
- Command improvements for `/security`, `/ux`, `/architect`, `/devops`, `/project`
- All commands now execute tools and produce JSON output for `/autonomous`
- Zod v4 and ESM compatibility for ralph-runner

---

## [1.6.0] - 2025-01-20

### Added - Autonomous Development Integration

**Autonomous Mode:**
- `/autonomous --issue 123` - Run quality gates on GitHub issues
- Integrates with `/plan` and `/orchestrate` for guided workflows
- Quality gates: test, security, build, review, mentor, ux
- Auto-fix capability for test failures and security issues
- Human intervention via issue comments (`@claude`, `@pause`, `@resume`)

**Ralph Wiggum Runner:**
- Headless autonomous runner for CI/CD pipelines
- Claude Agent SDK integration
- Docker deployment support
- Circuit breaker and rate limiting
- Crash recovery with checkpoints

**New Commands:**
- `/autonomous --issue N` - Interactive autonomous mode
- `/autonomous --epic N` - Process all issues in epic

**Documentation:**
- `docs/ralph.md` - Comprehensive Ralph documentation
- Updated `scripts/README.md` with autonomous development section

---

## [1.5.0] - 2025-01-18

### Added - Autonomous Development System

**Core Autonomous Features:**
- Quality gate framework with weighted scoring
- Target score system (default: 95/100)
- Gate execution with parallel groups
- Auto-fix and retry logic
- PR creation when targets are met

**Quality Gates:**
| Gate | Weight | Required |
|------|--------|----------|
| `/test` | 25 | Yes |
| `/security` | 25 | Yes |
| `/build` | 15 | Yes |
| `/review` | 20 | No |
| `/mentor` | 10 | No |
| `/ux` | 5 | No |

**Configuration:**
- `.claude/autonomous.yml` for per-project settings
- Preset system (default, production, prototype)
- Safety limits and forbidden commands

### Changed
- `/orchestrate` enhanced with quality gates integration
- Updated component counts in documentation

---

## [1.4.6] - 2025-01-16

### Added - System Architect Command

- `/architect` - System security & performance advisor
  - Security hardening (defense in depth, zero trust)
  - Performance optimization (caching, scaling strategies)
  - Threat modeling and compliance checklists
  - Architecture decision records (ADRs)

---

## [1.4.5] - 2025-01-16

### Added - Tier 3 Agent Commands

**Engineering Commands:**
- `/devops` - CI/CD pipelines, infrastructure automation, GitOps
- `/backend` - System design, scalability, architecture decisions
- `/prototype` - Rapid MVP development, speed stack recommendations

**Testing Commands:**
- `/api-test` - API security, functional, and performance testing (OWASP API Top 10)
- `/benchmark` - Load testing, Core Web Vitals, performance analysis
- `/test-analyze` - Test failure analysis, pattern detection, flaky test identification

**Product Analytics Commands:**
- `/analytics` - KPI dashboards, metrics analysis, funnel/cohort analysis
- `/experiment` - A/B testing, feature flags, statistical analysis
- `/synthesize` - Aggregate user feedback into actionable insights
- `/ux-research` - User research, usability testing, research synthesis

**Agent Sources:**
These commands complete the Tier 3 agents from [agency-agents](https://github.com/msitarzewski/agency-agents):
- DevOps Automator, Backend Architect, Rapid Prototyper
- API Tester, Performance Benchmarker, Test Results Analyzer
- Analytics Reporter, Experiment Tracker, Feedback Synthesizer, UX Researcher

---

## [1.4.4] - 2025-01-16

### Added - External Skills & More Presets

**New Commands:**
- `/skill-install` - Install external skills from Vercel, aitmpl, SkillsMP, GitHub

**New MCP Presets:**
- `mcp-fullstack.json` - Web + Backend combined (8 MCPs)
- `mcp-mobile.json` - iOS, Android, React Native
- `mcp-minimal.json` - Just GitHub + Sequential Thinking

**New Plugin Bundles:**
- Mobile (iOS) - swift-lsp
- Mobile (Android/Kotlin) - jdtls-lsp
- Mobile (React Native) - typescript-lsp
- Rust - rust-analyzer-lsp
- Go - gopls-lsp

**Updated Commands:**
- `/react` - Now recommends Vercel's React Best Practices skill (40+ rules)
- Added MCP integration notes (Playwright, Lighthouse, Context7)

**External Skill Sources:**
- [aitmpl.com](https://aitmpl.com) - claude-code-templates CLI
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) - Official Vercel skills
- [skillsmp.com](https://skillsmp.com) - 32,000+ community skills

---

## [1.4.3] - 2025-01-15

### Added - MCP & Plugin Integration
- `/mcp-setup` - Configure MCP servers (GitHub, Playwright, PostgreSQL, Sentry, etc.)
- `/plugin-setup` - Install recommended plugins (code-simplifier, LSPs, Laravel)
- MCP templates in `.claude/templates/` (web, backend, fullstack presets)
- Updated `/review`, `/test`, `/db` commands with MCP integration notes

### New MCP Templates
- `mcp.json` - Full template with all recommended MCPs
- `mcp-web.json` - Web development preset (Playwright, Lighthouse, GitHub)
- `mcp-backend.json` - Backend preset (PostgreSQL, Docker, Sentry)

### Documentation
- Added MCP Servers section to CLAUDE.md
- Added Recommended Plugins section with install commands
- Boris Cherny workflow recommendations (Slack, BigQuery, Sentry MCPs)

### Sources
- [awesome-mcp-servers](https://github.com/wong2/awesome-mcp-servers)
- [claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- [@bcherny's Claude Code setup](https://twitter-thread.com/t/2007179832300581177)

---

## [1.4.2] - 2025-01-11

### Fixed
- `/mem-setup` clarifies bun installs to ~/.bun (no root/sudo needed)
- Added PATH troubleshooting for "bun: not found" errors
- Falls back to `/save-session` if bun can't be installed (restricted VPS)
- Cross-platform bun installation (curl, PowerShell, npm)

---

## [1.4.1] - 2025-01-11

### Fixed
- `/mem-setup` now runs actual CLI commands instead of showing instructions
- Uses `claude plugin marketplace add` and `claude plugin install` directly

---

## [1.4.0] - 2025-01-11

### Added - Infrastructure & DevOps Skills

**Infrastructure Skills (Tier 1):**
- `terraform-iac` - State management, modules, providers, workspaces, remote backends
- `ansible-automation` - Playbooks, roles, inventory, vault, idempotency patterns
- `docker-containers` - Multi-stage builds, optimization, security, Compose
- `kubernetes-orchestration` - Deployments, Helm, RBAC, HPA, troubleshooting

**Cloud Provider Skills (Tier 2):**
- `aws-architecture` - VPC, IAM, ECS/EKS, Lambda, RDS, cost optimization
- `gcp-architecture` - GKE, Cloud Run, IAM, Workload Identity
- `azure-architecture` - AKS, App Service, Entra ID, Managed Identity
- `alibaba-cloud-architecture` - ACK, ECS, OSS, RAM
- `vercel-deployment` - Edge functions, ISR, preview deployments

**Platform Engineering Skills (Tier 3):**
- `gitops-workflows` - ArgoCD, Flux, promotion strategies, ApplicationSets
- `policy-as-code` - OPA/Gatekeeper, Kyverno, Checkov, Conftest

**Observability Skills (Tier 4):**
- `cloud-monitoring` - Prometheus, Grafana, PromQL, SLOs/SLIs
- `cost-optimization` - FinOps, tagging, right-sizing, commitments

**New Commands:**
- `/terraform [task]` - Infrastructure as Code
- `/ansible [task]` - Configuration management
- `/docker [task]` - Containerization
- `/k8s [task]` - Kubernetes orchestration
- `/aws [task]` - AWS architecture
- `/gcp [task]` - Google Cloud architecture
- `/azure [task]` - Microsoft Azure architecture
- `/vercel [task]` - Edge deployment

### Enhanced
- `/devops` - Now references specialized infrastructure commands and skills
- Updated CLAUDE.md with Infrastructure Commands and skills sections

### Documentation
- Added 14 comprehensive infrastructure skills
- Added 8 infrastructure commands
- Updated component counts

---

## [1.3.1] - 2025-01-11

### Improved - Session Management

**Named Sessions:**
- `/save-session [name]` - Now supports custom names or auto-generates from branch + timestamp
- `/resume-session [name]` - Resume specific session or pick from list
- `/session-list [filter]` - New command to list all saved sessions

**Multi-Terminal Support:**
- Sessions stored in `.claude/sessions/` directory with unique names
- Multiple terminals can now work in same directory without context conflicts
- Session index for easy browsing

**Claude-mem Integration:**
- Optional sync to claude-mem for cross-session searchability
- Sessions can be persisted to long-term memory

**Migration:**
- Legacy `.claude/session-context.md` files auto-detected with migration prompt

---

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
