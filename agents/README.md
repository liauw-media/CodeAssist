# CodeAssist Prompt Templates

Specialized prompts for different development contexts.

## How They Work

When you use `/laravel [task]`, Claude loads the laravel-developer template which provides:
- Framework-specific context
- Relevant skills to use
- Best practices for that stack

## Available Templates

### Development

| Template | Command | For |
|----------|---------|-----|
| laravel-developer | `/laravel` | Laravel, Eloquent, Livewire |
| php-developer | `/php` | General PHP, Symfony |
| react-developer | `/react` | React, Next.js |
| python-developer | `/python` | Django, FastAPI |
| database-specialist | `/db` | SQL, migrations |

### Quality

| Template | Command | For |
|----------|---------|-----|
| code-reviewer | `/review` | Code review |
| testing-agent | `/test` | Writing tests |
| security-auditor | `/security` | Security audit |
| refactoring-agent | `/refactor` | Code refactoring |

### Research

| Template | Command | For |
|----------|---------|-----|
| researcher | `/research` | Web research |
| codebase-explorer | `/explore` | Codebase analysis |
| documentation-agent | `/docs` | Documentation |

## Skills Integration

Templates reference skills from `.claude/skills/`. For example, `laravel-developer` uses:
- `database-backup` - Before database operations
- `test-driven-development` - TDD workflow
- `code-review` - Self-review checklist

