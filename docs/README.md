# Project Documentation

*Comprehensive guides for software development, project setup, and best practices*

---

## 📚 Documentation Index

This documentation suite provides everything you need to set up, develop, and maintain professional software projects with AI-assisted development workflows.

### Core Documentation

#### 🚀 [AI Agent Project Initialization Prompt](ai-agent-project-initialization-prompt.md)
**Purpose**: Interactive AI agent workflow for initializing new projects

**What you'll learn**:
- Complete project setup with AI guidance
- Task management system (TASKS.md + .claude/CLAUDE.md)
- Git repository setup (GitHub & GitLab)
- Pre-commit hooks configuration
- Issue tracking synchronization
- Tech stack recommendations

**Use this when**:
- Starting a new project from scratch
- Setting up AI-assisted development workflow
- Need guided project initialization

---

#### 🌿 [Git Branching Strategy Guide](git-branching-strategy-guide.md)
**Purpose**: Complete guide to branching strategies, PRs/MRs, and Git workflows

**What you'll learn**:
- Branch strategy comparison (Simple, GitHub/GitLab Flow, Git Flow)
- Pull Request (GitHub) and Merge Request (GitLab) workflows
- Branch protection configuration
- AI agent Git collaboration guidelines
- Common scenarios and troubleshooting

**Use this when**:
- Choosing a branching strategy for your team
- Setting up branch protection rules
- Configuring PR/MR workflows
- Working with AI agents on Git workflows

**Covers both**: GitHub & GitLab with platform-specific commands

---

#### 🛠️ [Development Tooling Guide](development-tooling-guide.md)
**Purpose**: Comprehensive reference for CLI tools, linters, formatters, and code quality tools

**What you'll learn**:
- **Version Control CLIs**: GitHub CLI (`gh`), GitLab CLI (`glab`)
- **Code Quality**: Linters for Python, JavaScript, PHP, Go
- **Code Formatting**: Black, Prettier, PHP CS Fixer, gofmt
- **Testing Frameworks**: pytest, Jest, PHPUnit
- **Pre-commit Hooks**: Setup and configuration
- **CI/CD Tools**: Docker, Docker Compose
- **Development Environment**: VS Code extensions, EditorConfig

**Use this when**:
- Setting up development tools
- Configuring linters and formatters
- Learning CLI commands for GitHub/GitLab
- Installing testing frameworks

**Language Coverage**: Python, JavaScript/TypeScript, PHP, Go

---

#### 🧪 [Testing & Backup Strategy](testing-and-backup-strategy.md)
**Purpose**: Protect your data while enabling safe testing practices

**What you'll learn**:
- Test database isolation (preventing production data disasters)
- Framework-specific test configuration (Django, Node.js, Laravel)
- Pre-commit safety checks
- Automatic backup strategies
- Safe test runner scripts
- Database reset procedures
- CI/CD integration (GitHub Actions & GitLab CI)

**Use this when**:
- Setting up testing environment
- Preventing test disasters (running tests against production DB)
- Configuring automated backups
- Setting up CI/CD pipelines

**Covers**: Python, JavaScript, PHP with both GitHub Actions and GitLab CI examples

---

#### 🔗 [Integration Guides](integration-guides.md)
**Purpose**: Patterns and practices for integrating components and systems

**What you'll learn**:
- Component integration patterns
- API integration best practices
- Database integration strategies
- Common integration scenarios
- Troubleshooting guide

**Use this when**:
- Integrating external services
- Connecting system components
- Troubleshooting integration issues

---

#### 🚀 [CI/CD Runners Setup Guide](cicd-runners-guide.md)
**Purpose**: Complete guide to self-hosted runners for GitHub Actions and GitLab CI

**What you'll learn**:
- **Self-hosted runners**: Setup for GitHub Actions and GitLab CI
- **4 specialized runners**: PHP, Node, Python, General-purpose
- **Runner management**: systemd service control and monitoring
- **Workflow examples**: Multi-language monorepo CI/CD
- **Comparison**: GitHub vs GitLab runner architectures
- **Troubleshooting**: Common issues and solutions

**Use this when**:
- Setting up self-hosted CI/CD infrastructure
- Need better performance than cloud runners
- Want control over runner environment
- Building multi-language projects

**Includes**: Complete setup scripts, documentation, and quick reference cards

---

## Quick Start Guides

### For New Projects

1. **Read**: [AI Agent Project Initialization Prompt](ai-agent-project-initialization-prompt.md)
2. **Choose branching strategy**: [Git Branching Strategy Guide](git-branching-strategy-guide.md)
3. **Install tools**: [Development Tooling Guide](development-tooling-guide.md)
4. **Set up testing**: [Testing & Backup Strategy](testing-and-backup-strategy.md)

### For Existing Projects

1. **Assess current Git workflow**: [Git Branching Strategy Guide](git-branching-strategy-guide.md)
2. **Audit development tools**: [Development Tooling Guide](development-tooling-guide.md)
3. **Verify test safety**: [Testing & Backup Strategy](testing-and-backup-strategy.md)
4. **Document integrations**: [Integration Guides](integration-guides.md)

---

## Platform Support

### GitHub vs GitLab

This documentation suite supports **both GitHub and GitLab**:

- ✅ **GitHub CLI** (`gh`) and **GitLab CLI** (`glab`) commands
- ✅ **Pull Requests** (GitHub) and **Merge Requests** (GitLab)
- ✅ **GitHub Actions** and **GitLab CI** configuration examples
- ✅ **Branch protection** for both platforms
- ✅ **Self-hosted GitLab** instance support

**Platform-specific commands are provided throughout the documentation.**

---

## Tech Stack Coverage

### Languages
- **Python** (Django, Flask, FastAPI)
- **JavaScript/TypeScript** (Node.js, React, Vue)
- **PHP** (Laravel, Symfony)
- **Go**

### Databases
- PostgreSQL
- MySQL
- SQLite
- MongoDB

### Tools
- **Version Control**: Git, GitHub, GitLab
- **CI/CD**: GitHub Actions, GitLab CI, Docker
- **Testing**: pytest, Jest, PHPUnit
- **Linting**: Flake8, ESLint, PHPStan, golangci-lint
- **Formatting**: Black, Prettier, PHP CS Fixer, gofmt

---

## Key Concepts

### Task Management System

This documentation emphasizes a **markdown-based task management** approach:

- **TASKS.md**: Central task list with priorities and status
- **.claude/CLAUDE.md**: AI agent instructions and project context
- **Issue Sync**: Bidirectional sync with GitHub/GitLab issues
- **Git Integration**: Commit messages reference tasks (`closes #N`)

### AI-Assisted Development

Guidance on working with AI agents:

- What AI agents **should do**: Create branches, commit code, push branches
- What AI agents **should NOT do**: Create PRs/MRs, merge code, push to protected branches
- **User retains control** over code review and merging

### Code Quality Gates

Multi-layer protection:

1. **Pre-commit hooks**: Catch issues before commits
2. **Linters & formatters**: Enforce code style
3. **Type checkers**: Static analysis
4. **Tests**: Automated testing with coverage
5. **CI/CD**: Automated checks on PRs/MRs
6. **Code review**: Human approval required

---

## Best Practices Summary

### Git Workflow
1. Use feature branches for all changes
2. Protect `main`, `develop`, and `staging` branches
3. Require PR/MR reviews before merging
4. Use conventional commit messages
5. Link commits to issues (`closes #N`)

### Development Tools
1. Install and configure CLI tools (`gh` or `glab`)
2. Set up pre-commit hooks on all projects
3. Use consistent linters and formatters
4. Configure editor for automatic formatting
5. Run tests before pushing

### Testing & Safety
1. **Always use separate test databases**
2. Verify test environment before running tests
3. Never run tests against production/development data
4. Set up automatic backups
5. Include CI/CD with test isolation

### Code Quality
1. Aim for 70%+ test coverage
2. Fix linting errors before committing
3. Use type checkers (mypy, TypeScript, PHPStan)
4. Document complex logic
5. Review AI-generated code before merging

---

## File Structure for New Projects

```
project-root/
├── .github/                    # GitHub-specific
│   ├── workflows/
│   │   └── test.yml           # GitHub Actions
│   └── PULL_REQUEST_TEMPLATE.md
├── .gitlab/                    # GitLab-specific
│   ├── merge_request_templates/
│   │   └── default.md
│   └── .gitlab-ci.yml         # GitLab CI
├── .claude/
│   └── CLAUDE.md              # AI agent instructions
├── docs/
│   ├── README.md              # This file
│   ├── architecture.md
│   ├── setup.md
│   └── api.md
├── src/                       # Source code
├── tests/                     # Test files
├── scripts/
│   ├── sync-tasks-to-issues.sh
│   ├── backup-before-tests.sh
│   └── run-tests.sh
├── .gitignore
├── .editorconfig
├── .pre-commit-config.yaml
├── TASKS.md                   # Task tracking
├── README.md                  # Project README
└── [language-specific files]  # requirements.txt, package.json, etc.
```

---

## Contributing to This Documentation

### Principles
- **Platform-agnostic**: Support both GitHub and GitLab
- **Language coverage**: Python, JavaScript, PHP, Go
- **Practical examples**: Real-world scenarios
- **Safety-first**: Emphasize data protection and testing safety

### Updating Documentation
1. Keep platform-specific commands in parallel
2. Test all code examples
3. Update version numbers regularly
4. Add new tools as they become standard

---

## Version History

- **v2.0** (2025-01-10): Added comprehensive GitLab support, development tooling guide
- **v1.0** (2025-01-09): Initial documentation with GitHub focus

---

## Quick Reference: Common Commands

### GitHub
```bash
gh repo create my-project --public
gh pr create --title "feat: Add feature"
gh issue create --title "Bug report"
gh pr merge 123 --squash
```

### GitLab
```bash
glab repo create my-project --public
glab mr create --title "feat: Add feature"
glab issue create --title "Bug report"
glab mr merge 123
```

### Pre-commit
```bash
pre-commit install
pre-commit run --all-files
```

### Testing
```bash
# Python
pytest --cov

# JavaScript
npm test -- --coverage

# PHP
vendor/bin/phpunit
```

---

## Need Help?

1. **Search the docs**: Use your editor's search (Ctrl+F / Cmd+F)
2. **Check tool-specific docs**: Each tool has detailed configuration examples
3. **Review examples**: All docs include practical code examples
4. **Platform-specific**: Look for GitHub/GitLab specific sections

---

## Document Navigation

| Document | Primary Purpose | Key Topics |
|----------|----------------|------------|
| [AI Agent Project Initialization](ai-agent-project-initialization-prompt.md) | Project setup | Task system, Git setup, AI workflow |
| [Git Branching Strategy](git-branching-strategy-guide.md) | Git workflows | Branching, PRs/MRs, protection |
| [Development Tooling](development-tooling-guide.md) | Tool reference | CLIs, linters, formatters, testing |
| [Testing & Backup](testing-and-backup-strategy.md) | Safe testing | DB isolation, backups, CI/CD |
| [CI/CD Runners](cicd-runners-guide.md) | Self-hosted runners | GitHub Actions, GitLab CI, setup |
| [Integration Guides](integration-guides.md) | System integration | APIs, components, troubleshooting |

---

*Keep these docs handy as your reference for professional software development practices!*

**Happy coding! 🚀**
