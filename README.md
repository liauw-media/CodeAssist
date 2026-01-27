# CodeAssist

[![Version](https://img.shields.io/badge/version-1.7.2-blue.svg)](https://github.com/liauw-media/CodeAssist/releases/tag/v1.7.2)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

An assistant library for Claude Code - commands, skills, and workflows that help Claude work more effectively.

## Quick Start

```bash
# Install in your project directory
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

Then run:
```
/quickstart
```

This automatically:
- Adds `.claude/` to `.gitignore`
- Installs git hooks (protects main branch, strips Claude mentions from commits)
- Detects your framework and recommends commands

**Full guide:** [Getting Started](docs/getting-started.md) | **All docs:** [Documentation Index](docs/INDEX.md)

---

## What's New in 1.7.2

- **Session Preservation** - `/ca-update` now uses `/save-session` for proper context preservation
- **Gate Presets** - New presets: `balanced`, `strict`, `fast`, `prototype`, `frontend`
- **Rebalanced Gates** - Mentor now required (15pts), architect has weight (10pts)
- **Gate Documentation** - New `docs/gates.md` with full configuration guide

See [CHANGELOG.md](CHANGELOG.md) for full history.

---

## Examples

### Feature Development
```
/branch 42 add-user-settings     # Create feature branch
/brainstorm user settings page   # Discuss approach
/plan                            # Break into tasks
[implement]
/review                          # Code review
/commit                          # Commit changes
```

### Bug Fix
```
/status                          # Check state
/laravel fix the login timeout   # Framework-specific help
/test                            # Run tests with backup
/commit                          # Commit fix
```

### Autonomous Mode
```
/autonomous --issue 123          # Run quality gates on issue
                                 # Creates branch, implements, tests
                                 # Creates PR when score >= 95/100
```

---

## Commands

### Essential Commands

| Command | What it Does |
|---------|--------------|
| `/status` | Git status, branch, recent commits |
| `/review` | Code review with security checks |
| `/test` | Run tests with database backup |
| `/commit` | Pre-commit checks, then commit |

### Development Workflow

| Command | What it Does |
|---------|--------------|
| `/branch [id] [desc]` | Create feature branch with checklist |
| `/brainstorm [topic]` | Discuss approach before coding |
| `/plan [feature]` | Break into actionable tasks |
| `/verify` | Final checks before completing |

### Framework Commands

| Command | For |
|---------|-----|
| `/laravel [task]` | Laravel, Eloquent, Livewire |
| `/react [task]` | React, Next.js |
| `/python [task]` | Django, FastAPI |
| `/php [task]` | General PHP |
| `/db [task]` | Database operations |

### Quality & Testing

| Command | What it Does |
|---------|--------------|
| `/security [task]` | Security audit |
| `/tdd [feature]` | Test-driven development |
| `/e2e [flow]` | End-to-end testing |
| `/architect [focus]` | System security & performance |

### Autonomous Development

| Command | What it Does |
|---------|--------------|
| `/autonomous --issue N` | Run quality gates on single issue |
| `/autonomous --epic N` | Process all issues in epic |

**Quality Gates:** test (25), security (25), build (15), review (20), mentor (10), ux (5)

**Headless/CI:** Use [Ralph Wiggum](docs/ralph.md) for CI/CD pipelines. Supports both GitHub and GitLab.

### All Commands

See [commands/README.md](commands/README.md) for all 74 commands.

---

## What Gets Installed

```
your-project/
├── .claude/
│   ├── commands/     # 74 slash commands
│   ├── skills/       # 56 skill protocols
│   ├── rules/        # 6 enforced guidelines
│   ├── templates/    # MCP presets, hooks
│   ├── CLAUDE.md     # Project config
│   └── VERSION       # 1.7.1
└── .gitignore
```

**Why `.claude/`?** Standard location for Claude Code project configuration.

---

## Updating

```
/ca-update           # Check for updates (saves session)
# Restart Claude
/resume-session      # Continue where you left off
```

Or manually:
```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

---

## Skills & Rules

**Skills** are best practices Claude follows automatically (database-backup, code-review, TDD).

**Rules** are always-enforced guidelines (security, testing, git-workflow).

See [skills/README.md](skills/README.md) and [rules/README.md](rules/README.md).

---

## Help

| Need | Command |
|------|---------|
| What to do next | `/guide` |
| Critical feedback | `/mentor [topic]` |
| Which agent to use | `/agent-select [task]` |
| Report issues | `/feedback [message]` |

---

## Attribution

- Skills framework: [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent
- Rules & hooks: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by @affaanmustafa
- Agent concepts: [agency-agents](https://github.com/msitarzewski/agency-agents) by @msitarzewski
