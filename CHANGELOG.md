# Changelog

All notable changes to CodeAssist will be documented in this file.

## [1.0.1] - 2025-12-09

### Added
- `/update` command - Check for CodeAssist updates
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
