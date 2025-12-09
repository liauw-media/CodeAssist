# Documentation

Guides for software development, project setup, and best practices.

## Index

### Getting Started
| Guide | Purpose |
|-------|---------|
| [AI Agent Project Init](ai-agent-project-initialization-prompt.md) | Initialize new projects with AI guidance |
| [Git Branching Strategy](git-branching-strategy-guide.md) | Branching, PRs/MRs, Git workflows |
| [Development Tooling](development-tooling-guide.md) | CLI tools, linters, formatters |

### Testing & Safety
| Guide | Purpose |
|-------|---------|
| [Testing & Backup Strategy](testing-and-backup-strategy.md) | Safe testing, database isolation |
| [Database Backup Strategy](database-backup-strategy.md) | Backup scripts and procedures |

### Platform Setup
| Guide | Purpose |
|-------|---------|
| [CI/CD Runners](cicd-runners-guide.md) | Self-hosted GitHub Actions/GitLab CI |
| [Repository Security](repository-security-guide.md) | Branch protection, access control |
| [Wiki Setup](wiki-setup-guide.md) | Documentation platforms |
| [API Documentation](api-documentation-guide.md) | OpenAPI, Swagger setup |

### Framework Guides
| Guide | Purpose |
|-------|---------|
| [Laravel Setup](framework-configs/laravel-setup-guide.md) | PHP/Laravel configuration |
| [Python Setup](framework-configs/python-setup-guide.md) | Django, FastAPI setup |
| [JavaScript Setup](framework-configs/javascript-setup-guide.md) | Next.js, Express setup |
| [Mobile App Guide](framework-configs/mobile-app-guide.md) | PWA, React Native |

### Phase Guides
| Guide | Purpose |
|-------|---------|
| [Git Repository Setup](phases/git-repository-setup.md) | Initialize repos, branching |
| [Pre-commit Hooks](phases/pre-commit-hooks-setup.md) | Linters, formatters setup |
| [Task Management](phases/task-management-setup.md) | TASKS.md workflow |

### Reference
| Guide | Purpose |
|-------|---------|
| [Project Use-Case Scenarios](project-use-case-scenarios.md) | Pre-configured tech stacks |
| [Local Development Infrastructure](local-development-infrastructure.md) | Self-hosted dev tools |
| [Integration Guides](integration-guides.md) | System integration patterns |

## Legacy Documents

These documents are kept for reference but may contain outdated information:

- [AI Agent Init with Skills](ai-agent-init-with-skills.md)
- [Superpowers Analysis](superpowers-repository-analysis.md)
- [Blog Post Analysis](blog-post-analysis-superpowers.md)
- [Documentation Roadmap](documentation-roadmap.md)

## Platform Support

All guides support both **GitHub** and **GitLab**:
- GitHub CLI (`gh`) and GitLab CLI (`glab`) commands
- Pull Requests (GitHub) and Merge Requests (GitLab)
- GitHub Actions and GitLab CI examples

## Quick Commands

\`\`\`bash
# GitHub
gh repo create my-project --public
gh pr create --title "feat: Add feature"

# GitLab
glab repo create my-project --public
glab mr create --title "feat: Add feature"

# Pre-commit
pre-commit install
pre-commit run --all-files

# Testing
pytest --cov              # Python
npm test -- --coverage    # JavaScript
vendor/bin/phpunit        # PHP
\`\`\`
