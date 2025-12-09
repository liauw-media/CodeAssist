# CodeAssist

An assistant library for Claude Code - skills, commands, and prompts that help Claude work more effectively.

## What is CodeAssist?

CodeAssist is a collection of **skills**, **slash commands**, and **prompt templates** that enhance Claude Code's capabilities. Instead of starting from scratch every session, CodeAssist gives Claude structured workflows and best practices to follow.

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
| **Skills** | 31 | Documented best practices (TDD, code review, database safety) |
| **Commands** | 24 | Slash commands that do real work (`/status`, `/review`, `/test`) |
| **Prompt Templates** | 16 | Framework-specific context (Laravel, React, Python) |

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
/status          # See git status
/review          # Review your code
/mentor my code  # Get critical feedback
```

That's it. You're ready to go.

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
| `/update` | Check for CodeAssist updates |

### Workflow Commands

| Command | What it Does |
|---------|--------------|
| `/brainstorm [topic]` | Discuss approach before implementing |
| `/plan [feature]` | Break work into actionable tasks |
| `/verify` | Final checks before completing work |

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
| `/refactor [task]` | Code refactoring |
| `/docs [task]` | Generate documentation |

### Research Commands

| Command | What it Does |
|---------|--------------|
| `/explore [task]` | Explore codebase structure |
| `/research [task]` | Research a topic |

### Utility Commands

| Command | Purpose |
|---------|---------|
| `/mentor [topic]` | Critical analysis - no sugarcoating |
| `/guide` | Help with what to do next |
| `/feedback [message]` | Submit feedback or report issues |
| `/agent-select [task]` | Get agent recommendation for a task |
| `/orchestrate [task]` | Coordinate multiple agents for complex tasks |

---

## Skills

Skills are documented best practices Claude follows when relevant.

| Skill | When |
|-------|------|
| `database-backup` | Before tests, migrations |
| `code-review` | Before completing work |
| `test-driven-development` | When writing tests |

See [skills/README.md](skills/README.md) for all skills.

---

## Version & Updates

Check version:
```bash
cat .claude/VERSION
```

Update:
```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

See [CHANGELOG.md](CHANGELOG.md) for what's new.

Report issues:
```
/feedback [your message]
```

---

## Structure

```
.claude/           # Add to .gitignore
  commands/        # Slash commands
  skills/          # Skill protocols
  VERSION          # Installed version
  CLAUDE.md        # Project config
```

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

Copy-paste these prompts to Claude to quickly set up projects.

### Initialize New Project

```
Initialize a new project using the CodeAssist framework. First, fetch and read the latest AI Agent Project Initialization Prompt from https://raw.githubusercontent.com/liauw-media/CodeAssist/main/docs/ai-agent-project-initialization-prompt.md, then follow the complete initialization workflow including:
- Skills framework setup
- Tech stack selection
- Git repository setup
- Pre-commit hooks
- Database backup safety
- Task management

Guide me through the process step by step.
```

### Update to Latest CodeAssist

```
Please update yourself to the latest CodeAssist documentation:
1. Fetch and read the skills index from https://raw.githubusercontent.com/liauw-media/CodeAssist/main/skills/README.md
2. Fetch and read the using-skills protocol from https://raw.githubusercontent.com/liauw-media/CodeAssist/main/skills/using-skills/SKILL.md
3. Report which version you've loaded and what skills are available
```

---

## Attribution

Based on [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent.
