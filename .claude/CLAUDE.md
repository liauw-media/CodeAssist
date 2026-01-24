# CodeAssist

An assistant library for Claude Code.

## Action Commands

| Command | Action |
|---------|--------|
| `/status` | Show git status, branch, recent commits |
| `/review` | Skeptical code review with evidence validation |
| `/test` | Create backup and run tests |
| `/backup` | Create database backup |
| `/commit` | Pre-commit checklist and commit |
| `/ca-update` | Check for CodeAssist updates |

## Workflow Commands

| Command | Action |
|---------|--------|
| `/brainstorm [topic]` | Discuss approach before implementing |
| `/plan [feature]` | Sprint planning with RICE/MoSCoW prioritization |
| `/verify` | Final checks before completing work |

## Git Branch Commands

| Command | Action |
|---------|--------|
| `/branch [id] [desc]` | Create branch + checklist (add `-w` for worktree) |
| `/branch-status` | Check progress on current branch |
| `/branch-done` | Complete branch, create PR |
| `/branch-list` | List all active branches and worktrees |
| `/gitsetup` | Protect main branch, strip Claude mentions from commits |

## Framework Commands

| Command | For |
|---------|-----|
| `/laravel [task]` | Laravel, Eloquent, Livewire |
| `/php [task]` | General PHP, Symfony |
| `/react [task]` | React, Next.js |
| `/python [task]` | Django, FastAPI |
| `/db [task]` | Database operations |

## Quality Commands

| Command | Action |
|---------|--------|
| `/security [task]` | Security audit |
| `/architect [focus]` | System security & performance advisor |
| `/refactor [task]` | Code refactoring |
| `/docs [task]` | Generate documentation |

## Project & Design Commands

| Command | Action |
|---------|--------|
| `/project [task]` | Project coordination, status reports, risk tracking |
| `/ux [task]` | UX architecture, design systems, themes |
| `/summary [topic]` | Executive summaries for stakeholders |

## Analysis & QA Commands

| Command | Action |
|---------|--------|
| `/evidence [task]` | Screenshot-based QA validation |
| `/brand [task]` | Design/brand consistency audit |
| `/trends [topic]` | Market trends and competitive analysis |
| `/optimize [process]` | Workflow optimization and automation |

## Engineering Commands

| Command | Action |
|---------|--------|
| `/prototype [idea]` | Rapid MVP development in <3 days |
| `/backend [task]` | System design, scalability, architecture |
| `/devops [task]` | CI/CD pipelines, infrastructure automation |
| `/ai [task]` | ML/AI systems, LLM integration, MLOps |

## Automation Commands

| Command | Action |
|---------|--------|
| `/autonomous [--issue\|--epic]` | Autonomous development loop with quality gates |
| `/orchestrate [task]` | Multi-agent pipeline coordination |

**Autonomous Development** runs iterative loops until quality score >= 95:
```bash
# Work on a single issue (interactive)
/autonomous --issue 123

# Work on an epic (all linked issues)
/autonomous --epic 100 --preset production

# Headless mode (run outside Claude - see note below)
cd scripts && npx ts-node ralph-runner.ts --issue=123

# With Ollama (local LLM, no API costs)
/autonomous --issue 123 --preset ollama_hybrid
```

> **Ralph (Headless Runner)**: Not included in standard installation. Install separately:
> `cd scripts && npm install`. Full docs: [docs/ralph.md](docs/ralph.md)

**Ollama Integration** (v0.14.0+): Run autonomous with local models:
```bash
# Hybrid: Claude for critical gates, Ollama for others (~60% cost savings)
/autonomous --issue 123 --preset ollama_hybrid

# Fully local: No cloud API calls (privacy/offline mode)
/autonomous --issue 123 --preset ollama_only
```

> See `skills/workflow/autonomous-development/SKILL.md` and `templates/autonomous.yml`

## Infrastructure Commands

| Command | Action |
|---------|--------|
| `/terraform [task]` | Infrastructure as Code with Terraform |
| `/ansible [task]` | Configuration management automation |
| `/docker [task]` | Container images and Docker Compose |
| `/k8s [task]` | Kubernetes manifests, Helm, debugging |
| `/aws [task]` | AWS architecture and deployment |
| `/gcp [task]` | Google Cloud architecture |
| `/azure [task]` | Microsoft Azure architecture |
| `/vercel [task]` | Edge deployment and Next.js |

## Testing Commands

| Command | Action |
|---------|--------|
| `/tdd [feature]` | Test-Driven Development (Red-Green-Refactor) |
| `/e2e [flow]` | End-to-end testing with Playwright/Cypress |
| `/api-test [endpoint]` | API security, functional, performance testing |
| `/benchmark [target]` | Load testing, Core Web Vitals, performance |
| `/test-analyze [results]` | Test failure analysis, pattern detection |

## Code Quality Commands

| Command | Action |
|---------|--------|
| `/build-fix [error]` | Diagnose and fix build/compilation errors |
| `/cleanup [scope]` | Remove dead code, unused imports, orphaned files |
| `/update-docs` | Sync documentation with code changes |

## Product Analytics Commands

| Command | Action |
|---------|--------|
| `/analytics [report]` | KPI dashboards, metrics analysis |
| `/experiment [name]` | A/B testing, feature flags, data experiments |
| `/synthesize [sources]` | Aggregate feedback into insights |
| `/ux-research [study]` | User research, usability testing |

## Research Commands

| Command | Action |
|---------|--------|
| `/explore [task]` | Explore codebase structure |
| `/research [task]` | Research a topic |

## Session Commands

| Command | Purpose |
|---------|---------|
| `/save-session [name]` | Save context with optional name (auto-generates from branch if omitted) |
| `/resume-session [name]` | Resume a specific session or pick from list |
| `/session-list [filter]` | List all saved sessions |

Sessions are stored in `.claude/sessions/` with unique names, allowing multiple terminals to work independently without overwriting each other's context.

> After `/ca-update`, restart Claude and run `/resume-session` to continue.

## Utility Commands

| Command | Purpose |
|---------|---------|
| `/quickstart` | Interactive onboarding for new users |
| `/mentor [topic]` | Critical analysis - no sugarcoating |
| `/guide` | Help with what to do next |
| `/feedback [message]` | Submit feedback or report issues |
| `/agent-select [task]` | Get agent recommendation |

## Setup Commands

| Command | Purpose |
|---------|---------|
| `/mcp-setup` | Configure MCP servers (GitHub, Playwright, PostgreSQL, etc.) |
| `/hooks-setup` | Configure event-driven automation hooks |
| `/plugin-setup` | Install recommended plugins (code-simplifier, LSPs, etc.) |
| `/mem-setup` | Set up persistent memory with claude-mem |
| `/aider-setup` | Configure Ollama host and model for Aider |
| `/autonomous-setup` | Configure autonomous development mode |
| `/ollama-setup` | Configure Ollama as local LLM backend (v0.14.0+) |

## External Tools

| Command | Purpose |
|---------|---------|
| `/aider [task]` | Delegate code generation to Ollama (saves context) |

> Config in `.aider.conf.yml`. Default: `qwen3-coder` on `ollama.cerberus-kitchen.ts.net`

## Skills

Skills are best practices in `skills/`. Key skills:

| Skill | When |
|-------|------|
| `database-backup` | Before tests, migrations |
| `code-review` | Before completing work |
| `test-driven-development` | When writing tests |
| `branch-discipline` | One branch per issue, small commits |
| `system-architect` | Security audits, hardening |

### AI/ML Skills

| Skill | When |
|-------|------|
| `rag-architecture` | Building document Q&A, knowledge bases |
| `agentic-design` | Agent loops, tool calling, multi-agent systems |
| `llm-integration` | API patterns, streaming, error handling |
| `persistent-memory` | Cross-session context, claude-mem integration |

### Infrastructure Skills

| Skill | When |
|-------|------|
| `terraform-iac` | IaC, state management, modules |
| `ansible-automation` | Playbooks, roles, vault |
| `docker-containers` | Dockerfiles, Compose, optimization |
| `kubernetes-orchestration` | K8s manifests, Helm, RBAC |

### Cloud Provider Skills

| Skill | When |
|-------|------|
| `aws-architecture` | AWS services, VPC, IAM, ECS/EKS |
| `gcp-architecture` | GCP, GKE, Cloud Run |
| `azure-architecture` | Azure, AKS, App Service |
| `vercel-deployment` | Edge functions, Next.js |

### Platform Engineering Skills

| Skill | When |
|-------|------|
| `gitops-workflows` | ArgoCD, Flux, promotion strategies |
| `policy-as-code` | OPA, Kyverno, Checkov |
| `cloud-monitoring` | Prometheus, Grafana, alerting |
| `cost-optimization` | FinOps, right-sizing, commitments |

### Skill Commands

| Command | Action |
|---------|--------|
| `/skill-install [skill]` | Install external skills (Vercel, aitmpl, SkillsMP) |
| `/skill-create [description]` | Create new skills using SKILL.md standard |

**Popular external skills:**
```bash
# Vercel React Best Practices (40+ rules)
npx claude-code-templates@latest --skill=web-development/react-best-practices --yes
```

> Skills use the open [SKILL.md format](https://github.com/anthropics/skills) compatible with Claude Code, OpenAI Codex CLI, and GitHub Copilot.

## Rules

Rules are always-enforced guidelines in `rules/`. Unlike skills (situational), rules are mandatory:

| Rule | Enforces |
|------|----------|
| `security` | No hardcoded secrets, input validation, secure crypto |
| `testing` | 80% coverage minimum, TDD methodology |
| `git-workflow` | Branch naming, commit format, PR standards |
| `coding-style` | Naming conventions, code organization, immutability |
| `agents` | When and how to delegate to specialized agents |

**Install:** Copy `rules/` to `~/.claude/rules/` or project `.claude/rules/`

## Hooks

Hooks are event-driven automations that run on tool operations:

| Hook Type | When |
|-----------|------|
| `PreToolUse` | Before a tool executes (can block) |
| `PostToolUse` | After a tool completes |
| `Notification` | On specific messages/patterns |

**Examples:**
- Warn on sensitive file edits
- Run linter after code changes
- Block force push commands
- Auto-backup before destructive SQL

**Setup:** Run `/hooks-setup` or copy `templates/hooks.json` to settings.

> **Context Warning:** Too many hooks can impact performance. Keep them focused.

## Workflow

```
1. /status        - Check current state
2. /brainstorm    - Discuss approach
3. /plan          - Break into tasks
4. Implement      - /laravel, /react, or /python
5. /test          - Run tests with backup
6. /review        - Code review
7. /verify        - Final checks
8. /commit        - Commit changes
```

## Server Safety

### Running Tests

**Always use safe-test.sh** - it auto-detects shared servers and applies resource limits:
```bash
./scripts/safe-test.sh              # Auto-detect framework
./scripts/safe-test.sh --no-limit   # Disable limits (local dev only)
```

### Database Operations

Before database operations:
```bash
./scripts/backup-database.sh
# or
/backup
```

### Environment Variables

```bash
CODEASSIST_NO_LIMIT=1      # Disable resource limits (for local dev)
CODEASSIST_CPU_LIMIT=25    # Limit CPU to 25% (default: 50)
```

## Help

| Need | Command |
|------|---------|
| What to do | `/guide` |
| Critical feedback | `/mentor [topic]` |
| Which agent to use | `/agent-select [task]` |
| Report issue | `/feedback [message]` |

## MCP Servers

MCP (Model Context Protocol) gives Claude direct access to external tools. Configure via `.mcp.json`:

| MCP | Use Case |
|-----|----------|
| **GitHub** | Direct PR/issue/workflow access |
| **Playwright** | Browser automation, E2E testing |
| **PostgreSQL** | Natural language database queries |
| **Lighthouse** | Performance auditing |
| **Sentry** | Error tracking and debugging |
| **Slack** | Team communication search |

Run `/mcp-setup` to configure, or copy templates from `templates/mcp*.json`.

> **Context Warning:** Too many MCPs can shrink your 200k context to ~70k. Enable 2-5 per project, use `disabledMcpServers` for unused ones.

> Boris Cherny (Claude Code creator) uses Slack, BigQuery, and Sentry MCPs daily.

## Recommended Plugins

Install via `/plugin-setup` or manually:

| Plugin | Purpose | Install |
|--------|---------|---------|
| **code-simplifier** | Clean up code after sessions | `claude plugin install code-simplifier` |
| **typescript-lsp** | Real-time TypeScript checking | `claude plugin install typescript-lsp@claude-code-lsps` |
| **laravel-simplifier** | Laravel-specific cleanup | `claude plugin install laravel-simplifier@laravel` |
| **security-guidance** | Security warnings | `claude plugin install security-guidance` |

> See [claude-plugins-official](https://github.com/anthropics/claude-plugins-official) for full list.

## Notable Mentions

### [everything-claude-code](https://github.com/affaan-m/everything-claude-code)

Battle-tested Claude Code configurations by [@affaanmustafa](https://x.com/affaanmustafa), Anthropic hackathon winner. CodeAssist adopted several patterns:

- **Rules system** - Always-enforced guidelines (security, testing, git-workflow)
- **Hooks system** - Event-driven automations for tool operations
- **TDD workflow** - Red-Green-Refactor with coverage requirements
- **Specialized agents** - Build error resolver, E2E runner, refactor cleaner

### [agency-agents](https://github.com/msitarzewski/agency-agents)

A collection of 51 specialized AI agent personalities by [@msitarzewski](https://github.com/msitarzewski). CodeAssist integrated concepts from their agents:

**Tier 1 (Core):** Sprint Prioritizer, Reality Checker, Project Shepherd, UX Architect, Executive Summary Generator, Agents Orchestrator

**Tier 2 (Analysis):** Evidence Collector, Brand Guardian, Trend Researcher, Workflow Optimizer

**Tier 3 (Engineering):** Rapid Prototyper, Backend Architect, DevOps Automator, AI Engineer

**Tier 3 (Testing):** API Tester, Performance Benchmarker, Test Results Analyzer

**Tier 3 (Product):** Analytics Reporter, Experiment Tracker, Feedback Synthesizer, UX Researcher

**Agents not integrated but available from source:**

| Agent | Use Case | Notes |
|-------|----------|-------|
| **Growth Hacker** | User acquisition strategies | Marketing focus |
| **Content Creator** | Marketing content generation | Marketing focus |
| **Social Media Strategists** | Platform-specific content | Marketing focus |
| **Spatial Computing** | XR/VisionOS development | Niche platform |

> Install additional agents from [agency-agents](https://github.com/msitarzewski/agency-agents) to `~/.claude/agents/`.

### [claude-mem](https://github.com/thedotmack/claude-mem)

Persistent memory system for Claude Code by [@thedotmack](https://github.com/thedotmack). Automatically captures session context and makes it available across sessions.

**Features:** Auto-capture via lifecycle hooks, SQLite + vector storage, web UI at localhost:37777, privacy tags, semantic search.

**Install:** `/mem-setup` or manually:
```bash
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

### [SkillsMP](https://skillsmp.com/)

Community marketplace with 32,000+ agent skills using the open SKILL.md format. Browse skills compatible with Claude Code, OpenAI Codex CLI, and GitHub Copilot.

## Version

Check: `cat .claude/VERSION`
