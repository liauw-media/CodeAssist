# CodeAssist

[![Version](https://img.shields.io/badge/version-1.7.0-blue.svg)](https://github.com/liauw-media/CodeAssist/releases/tag/v1.7.0)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

An assistant library for Claude Code - skills, commands, and prompts that help Claude work more effectively.

## What is CodeAssist?

CodeAssist is a collection of **skills**, **slash commands**, and **prompt templates** that enhance Claude Code's capabilities. Instead of starting from scratch every session, CodeAssist gives Claude structured workflows and best practices to follow.

**New here?** See [Getting Started](docs/getting-started.md) | **Looking for something?** See [Documentation Index](docs/INDEX.md)

### The Problem It Solves

When working with Claude Code on complex projects, you often need to:
- Remind Claude about database backups before running tests
- Ensure code reviews happen before commits
- Apply consistent patterns across Laravel, React, or Python projects
- Break down work into manageable tasks

CodeAssist packages these workflows into reusable components that Claude can reference automatically.

### What's Included

| Component | Count | Purpose |
|-----------|-------|---------|
| **Commands** | 74 | Slash commands (`/status`, `/review`, `/tdd`, `/e2e`, `/cleanup`) |
| **Skills** | 56 | Best practices (TDD, code review, AI/ML, infrastructure) |
| **Agents** | 20 | Specialized agents (Laravel, React, security, E2E runner) |
| **Rules** | 6 | Always-enforced guidelines (security, testing, git-workflow) |
| **Templates** | 7 | MCP presets, hooks configuration |

### History

CodeAssist started as an experiment in making Claude Code more reliable for professional development. Early versions (v3.x) tried aggressive "enforcement" approaches with git hooks and state tracking. These were over-engineered and didn't work well in practice.

**Version 1.0** is a clean restart with an honest approach:
- Skills are **guidance**, not enforcement
- Commands **do real work**, not just prompt engineering
- Documentation is **practical**, not marketing

The skills framework is based on [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent, adapted for Claude Code workflows.

---

## Getting Started

### 1. Install Prerequisites

You need Git and GitHub CLI installed. Choose automatic or manual install:

**Automatic Install** (runs setup script):

| Platform | Command |
|----------|---------|
| Windows (PowerShell as Admin) | `irm https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/setup-windows.ps1 \| iex` |
| macOS | `curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/setup-macos.sh \| bash` |
| Linux | `curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/setup-linux.sh \| bash` |

**Manual Install** (if you prefer to review scripts first):

1. Download the script for your platform from [scripts/](https://github.com/liauw-media/CodeAssist/tree/main/scripts)
2. Review the script contents
3. Run it locally

Or install the tools yourself:
- **Git**: https://git-scm.com/downloads
- **GitHub CLI**: https://cli.github.com/

### 2. Install CodeAssist

In your project directory (use Git Bash on Windows):

```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

### 3. Add to .gitignore

```bash
echo ".claude/" >> .gitignore
```

CodeAssist is a local development tool - don't commit it to your repo.

### 4. Try It

```
/quickstart      # Interactive onboarding (recommended)
/status          # See git status
/guide           # Get suggestions for what to do next
```

That's it. You're ready to go.

---

## Examples

### Example 1: Starting a New Feature

```
You: /branch 42 add-user-settings
Claude: Created branch feature/42-add-user-settings with checklist

You: /brainstorm user settings page
Claude: Let's think about this before coding...
        [discusses database schema, UI components, validation]

You: /plan
Claude: Breaking this down:
        1. Create UserSettings model and migration
        2. Build settings form component
        3. Add API endpoints
        4. Write tests

You: [implement the feature]

You: /review
Claude: Running code review...
        - Security: ✅ Input validation present
        - Tests: ✅ 12 tests, 94% coverage
        - Code quality: ⚠️ 1 minor smell
        Grade: B (approved with notes)

You: /commit
Claude: ✅ Pre-commit checks passed
        Created commit: feat: add user settings page
```

### Example 2: Fixing a Bug

```
You: /status
Claude: On branch: main
        Modified: src/auth/login.ts
        Unstaged changes: 2 files

You: /laravel fix the password reset flow - users aren't getting emails
Claude: Let me investigate...
        [finds issue in PasswordResetController]
        Fixed: Added missing queue configuration

You: /test
Claude: Backup created ✅
        Running tests... 47 passed, 0 failed
        Coverage: 89%

You: /commit
Claude: Created commit: fix: password reset email delivery
```

### Example 3: Autonomous Development

```
You: /autonomous --issue 123
Claude: Starting autonomous run on #123: Add dark mode support

        Iteration 1:
        - Created branch feature/123-dark-mode
        - Implemented theme toggle
        - Running quality gates...

        /test: 25/25 ✅
        /security: 25/25 ✅
        /build: 15/15 ✅
        /review: 18/20 ✅

        Score: 98/100 (target: 95)
        Creating PR...

        ✅ PR #156 created - ready for human review
```

---

## Commands

### Action Commands

Commands that do real work:

| Command | What it Does |
|---------|--------------|
| `/status` | Shows git status, branch, recent commits |
| `/review` | Runs code review with tests and checks |
| `/test` | Creates backup, runs test suite |
| `/backup` | Creates database backup |
| `/commit` | Pre-commit checklist, then commits |
| `/ca-update` | Check for CodeAssist updates |

### Workflow Commands

| Command | What it Does |
|---------|--------------|
| `/brainstorm [topic]` | Discuss approach before implementing |
| `/plan [feature]` | Break work into actionable tasks |
| `/verify` | Final checks before completing work |

### Git Branch Commands

| Command | What it Does |
|---------|--------------|
| `/branch [id] [desc]` | Create branch + checklist (add `-w` for worktree) |
| `/branch-status` | Check progress on current branch |
| `/branch-done` | Complete branch, create PR |
| `/branch-list` | List all active branches and worktrees |
| `/gitsetup` | Protect main branch, strip Claude mentions from commits |

### Framework Commands

| Command | For |
|---------|-----|
| `/laravel [task]` | Laravel, Eloquent, Livewire |
| `/php [task]` | General PHP, Symfony |
| `/react [task]` | React, Next.js |
| `/python [task]` | Django, FastAPI |
| `/db [task]` | Database operations |

### Quality Commands

| Command | What it Does |
|---------|--------------|
| `/security [task]` | Security audit |
| `/architect [focus]` | System security & performance advisor |
| `/refactor [task]` | Code refactoring |
| `/docs [task]` | Generate documentation |

### Testing Commands

| Command | What it Does |
|---------|--------------|
| `/tdd [feature]` | Test-Driven Development (Red-Green-Refactor) |
| `/e2e [flow]` | End-to-end testing with Playwright/Cypress |
| `/test` | Run tests with database backup |
| `/api-test [endpoint]` | API testing |
| `/benchmark [target]` | Performance testing |

### Code Quality Commands

| Command | What it Does |
|---------|--------------|
| `/build-fix [error]` | Diagnose and fix build/compilation errors |
| `/cleanup [scope]` | Remove dead code, unused imports |
| `/update-docs` | Sync documentation with code changes |

### Research Commands

| Command | What it Does |
|---------|--------------|
| `/explore [task]` | Explore codebase structure |
| `/research [task]` | Research a topic |

### Session Commands

| Command | Purpose |
|---------|---------|
| `/save-session` | Save current context for later |
| `/resume-session` | Resume from saved context |

> After `/ca-update`, restart Claude and run `/resume-session` to continue.

### Utility Commands

| Command | Purpose |
|---------|---------|
| `/quickstart` | Interactive onboarding for new users |
| `/mentor [topic]` | Critical analysis - no sugarcoating |
| `/guide` | Help with what to do next |
| `/feedback [message]` | Submit feedback or report issues |
| `/agent-select [task]` | Get agent recommendation for a task |
| `/orchestrate [task]` | Coordinate multiple agents for complex tasks |

### Autonomous Development

Run quality gates automatically on GitHub/GitLab issues:

| Command | What it Does |
|---------|--------------|
| `/autonomous --issue 123` | Run quality gates on single issue |
| `/autonomous --epic 200` | Process all issues in an epic |
| `/autonomous --preset production` | Use stricter quality thresholds |

**Quality Gates:** `/test` (25pts), `/security` (25pts), `/build` (15pts), `/review` (20pts), `/mentor` (10pts), `/ux` (5pts)

**Target Score:** 95/100 (configurable via `.claude/autonomous.yml`)

**Headless Mode:** For CI/CD pipelines, use [Ralph Wiggum](docs/ralph.md) - a standalone runner with Docker support.

### AI/ML Commands

| Command | What it Does |
|---------|--------------|
| `/ai [task]` | ML/AI systems, LLM integration, RAG, agents |
| `/skill-create [desc]` | Create new skills using SKILL.md standard |
| `/mem-setup` | Set up persistent memory with claude-mem |

### External Tools

| Command | Purpose |
|---------|---------|
| `/aider [task]` | Delegate code generation to Ollama (saves context) |
| `/aider-setup` | Configure Ollama host and model |

> Config in `.aider.conf.yml`. Default: `qwen3-coder` on `ollama.cerberus-kitchen.ts.net`

### Setup Commands

| Command | What it Does |
|---------|--------------|
| `/mcp-setup` | Configure MCP servers (GitHub, Playwright, etc.) |
| `/hooks-setup` | Configure event-driven automation hooks |
| `/plugin-setup` | Install recommended plugins |
| `/mem-setup` | Set up persistent memory |

---

## Rules

Rules are always-enforced guidelines (unlike skills which are situational).

| Rule | Enforces |
|------|----------|
| `security` | No hardcoded secrets, input validation, secure crypto |
| `testing` | 80% coverage minimum, TDD methodology |
| `git-workflow` | Branch naming, commit format, PR standards |
| `coding-style` | Naming conventions, code organization |
| `agents` | When to delegate to specialized agents |

**Install:** Copy `rules/` to `~/.claude/rules/`

---

## Hooks

Event-driven automations that run on tool operations:

| Hook Type | When |
|-----------|------|
| `PreToolUse` | Before a tool executes (can block dangerous operations) |
| `PostToolUse` | After a tool completes (notifications, linting) |

**Examples:** Warn on sensitive file edits, run linter after changes, block force push.

**Setup:** Run `/hooks-setup` or copy `templates/hooks.json`

> **Warning:** Too many hooks impact performance. Keep them focused.

---

## Skills

Skills are documented best practices Claude follows when relevant.

| Skill | When |
|-------|------|
| `database-backup` | Before tests, migrations |
| `code-review` | Before completing work |
| `test-driven-development` | When writing tests |
| `rag-architecture` | Building document Q&A, knowledge bases |
| `agentic-design` | Agent loops, tool calling, multi-agent |
| `persistent-memory` | Cross-session context |

See [skills/README.md](skills/README.md) for all 40 skills.

---

## Version & Updates

Check version:
```bash
cat .claude/VERSION
```

### Updating (v1.0.9+)

If you're on v1.0.9 or later, just run:
```
/ca-update
```

This saves your session context, updates, and tells you to restart. After restarting Claude, run `/resume-session` to continue where you left off.

### Upgrading from Older Versions (pre-1.0.9)

Older versions don't have session persistence. To preserve your work context:

**Step 1: Save context manually**

Before updating, ask Claude:
```
Save a summary of our current work to .claude/session-context.md with:
- Current task
- Recent progress
- Pending work
- Key decisions made
- Files modified
```

**Step 2: Run the update**
```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

**Step 3: Restart and resume**
```bash
# Exit Claude (Ctrl+C or /exit)
claude
# Then run:
/resume-session
```

### Fresh Update (No Context Needed)

If you don't need to preserve context:
```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

See [CHANGELOG.md](CHANGELOG.md) for what's new.

Report issues:
```
/feedback [your message]
```

---

## Repository Structure

```
CodeAssist/
├── commands/                   # 74 slash commands
│   ├── status.md               #   /status - git status
│   ├── tdd.md                  #   /tdd - test-driven development
│   ├── e2e.md                  #   /e2e - end-to-end testing
│   └── ...                     #   See commands/README.md
├── skills/                     # 56 skill protocols
│   ├── safety/                 #   database-backup, system-architect
│   ├── core/                   #   brainstorming, code-review
│   ├── testing/                #   TDD, playwright
│   └── ...                     #   See skills/README.md
├── agents/                     # 20 specialized agents
│   ├── e2e-runner.md           #   Playwright/Cypress testing
│   ├── build-error-resolver.md #   Build error diagnosis
│   └── ...                     #   See agents/README.md
├── rules/                      # 6 always-enforced guidelines
│   ├── security.md             #   No secrets, input validation
│   ├── testing.md              #   80% coverage, TDD
│   └── ...                     #   See rules/README.md
├── templates/                  # Configuration templates
│   ├── hooks.json              #   Event-driven hooks
│   ├── mcp-*.json              #   MCP server presets
│   └── ...
├── scripts/                    # Installation and utility scripts
└── docs/                       # Reference documentation
```

## What Gets Installed

When you run the install script, it copies files to `.claude/` in your project:

```
your-project/
├── .claude/                    # Add to .gitignore
│   ├── commands/               # 74 slash commands
│   ├── skills/                 # 56 skill protocols
│   ├── rules/                  # 6 enforced guidelines
│   ├── templates/              # MCP presets, hooks
│   ├── CLAUDE.md               # Project config
│   └── VERSION                 # e.g., 1.5.0
└── .gitignore
```

**Why `.claude/`?** This is the standard location Claude Code looks for project configuration and custom commands.

---

## Advanced

### Prompt Templates

The `agents/` folder contains specialized prompt templates for different contexts (Laravel, React, Python, etc.). These are loaded automatically when you use framework commands like `/laravel`.

See [agents/README.md](agents/README.md) for details.

### Self-Hosted CI/CD Runners

The `github/` and `gitlab/` folders contain setup scripts for self-hosted runners:
- **GitHub Actions**: See [github/GITHUB_RUNNERS_SETUP.md](github/GITHUB_RUNNERS_SETUP.md)
- **GitLab CI**: See [gitlab/GITLAB_RUNNERS_SETUP.md](gitlab/GITLAB_RUNNERS_SETUP.md)

---

## Quick Start Prompts

Copy-paste these prompts to Claude to quickly set up or update CodeAssist.

### Initialize New Project

```
Initialize this project with CodeAssist. Run this command:

curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash

Then read .claude/CLAUDE.md to see available commands and workflows.
```

### Update CodeAssist

```
Update CodeAssist to the latest version. Run this command:

curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash

This will:
- Remove old skills and commands
- Install latest 31 skills and 35 commands
- Update .claude/CLAUDE.md configuration

After running, check .claude/VERSION for the new version number.
```

### Load CodeAssist Context (No Install)

If you just want Claude to know about CodeAssist without installing files:

```
Read the CodeAssist documentation to understand available workflows:
1. Fetch https://raw.githubusercontent.com/liauw-media/CodeAssist/main/README.md
2. Fetch https://raw.githubusercontent.com/liauw-media/CodeAssist/main/skills/README.md
3. Summarize the available commands and skills
```

---

## Team Usage

CodeAssist is optimized for solo developers. Teams need additional setup:

| Consideration | Solo | Team |
|---------------|------|------|
| `.claude/` location | gitignored | commit to repo |
| Version control | auto-updates | pin version |
| Settings | personal | shared conventions |
| Database | local | isolated per-dev |

**Quick team setup:**
```bash
# Remove from .gitignore and commit
sed -i '/.claude/d' .gitignore
git add .claude/
git commit -m "Add shared CodeAssist configuration"
```

Full guide: [docs/team-usage.md](docs/team-usage.md)

---

## Attribution

- Skills framework based on [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent
- Rules, hooks, and TDD patterns inspired by [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by [@affaanmustafa](https://x.com/affaanmustafa)
- Agent concepts from [agency-agents](https://github.com/msitarzewski/agency-agents) by [@msitarzewski](https://github.com/msitarzewski)
