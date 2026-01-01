# Getting Started with CodeAssist

Get productive in 5 minutes.

## Install

```bash
# In your project directory
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash

# Add to gitignore (solo dev)
echo ".claude/" >> .gitignore
```

## First Command

Start here:

```
/quickstart
```

This walks you through personalized setup based on your project.

## Or Jump Right In

If you prefer to explore on your own:

```
/status          # See git status, branch, recent commits
/guide           # Get suggestions for what to do next
/mentor my code  # Get critical feedback (no sugarcoating)
```

## Daily Workflow

### Starting Work

```
/status              # Where am I?
/brainstorm [idea]   # Think before coding
/plan [feature]      # Break into tasks
```

### While Working

```
/laravel [task]      # Laravel-specific help
/react [task]        # React-specific help
/python [task]       # Python-specific help
/test                # Run tests (with backup)
```

### Finishing Work

```
/review              # Self code review
/verify              # Final checks
/commit              # Commit with good message
```

## Key Commands by Task

| I want to... | Command |
|--------------|---------|
| Check project status | `/status` |
| Get help deciding | `/guide` |
| Discuss before coding | `/brainstorm [topic]` |
| Break down a feature | `/plan [feature]` |
| Work on Laravel | `/laravel [task]` |
| Work on React | `/react [task]` |
| Run tests safely | `/test` |
| Review my code | `/review` |
| Get critical feedback | `/mentor [topic]` |
| Security audit | `/security` or `/architect` |
| Commit changes | `/commit` |

## Understanding Skills

Skills are best practices Claude follows automatically. You don't need to invoke them - Claude uses them when relevant.

**Example:** When you run `/test`, Claude automatically:
1. Creates a database backup (skill: `database-backup`)
2. Runs tests with resource limits (skill: `resource-limiting`)
3. Reports results

**Key skills:**
- `database-backup` - Backup before tests
- `code-review` - Self-review before completing
- `test-driven-development` - Write tests first

See all skills: [skills/README.md](../skills/README.md)

## Project Configuration

Your project config is in `.claude/CLAUDE.md`. Add project-specific instructions:

```markdown
## Project Conventions

- Use TypeScript strict mode
- Tests go in `__tests__/` directories
- Use pnpm, not npm
```

Claude will follow these automatically.

## Framework-Specific

### Laravel

```
/laravel create a new API endpoint for users
/laravel add validation to the order form
/db run the pending migrations
```

### React/Next.js

```
/react build a reusable modal component
/react add dark mode support
/react optimize this page for performance
```

### Python/Django

```
/python create a new Django model for products
/python add API rate limiting
/python write tests for the auth flow
```

## CI/CD Setup

Copy a template and customize:

```bash
# GitLab
cp docs/ci-templates/gitlab/laravel.yml .gitlab-ci.yml

# GitHub
mkdir -p .github/workflows
cp docs/ci-templates/github/laravel.yml .github/workflows/ci.yml
```

See all templates: [docs/ci-templates/](ci-templates/README.md)

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Command not found | Run install script again |
| Tests timeout | Check `safe-test.sh` resource limits |
| Database backup fails | Verify DB credentials in `.env` |
| Claude doesn't follow skill | Ask explicitly: "Use the X skill" |

## Next Steps

1. **Explore commands**: [commands/README.md](../commands/README.md)
2. **Browse skills**: [skills/README.md](../skills/README.md)
3. **Set up CI/CD**: [ci-templates/README.md](ci-templates/README.md)
4. **Team usage**: [team-usage.md](team-usage.md)

## Need Help?

```
/guide              # Contextual suggestions
/mentor [question]  # Direct answers
/feedback [issue]   # Report problems
```
