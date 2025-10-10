# Development Tooling Guide

*Comprehensive guide to CLI tools, linters, formatters, and code quality tools*

---

## Overview

This guide covers essential development tools for modern software projects, including version control CLIs, code quality tools, linters, formatters, and testing frameworks.

---

## Table of Contents

1. [Version Control Tools](#version-control-tools)
2. [Code Quality & Linting](#code-quality--linting)
3. [Code Formatting](#code-formatting)
4. [Testing Frameworks](#testing-frameworks)
5. [CI/CD Tools](#cicd-tools)
6. [Development Environment](#development-environment)
7. [Language-Specific Tools](#language-specific-tools)
8. [Tool Configuration](#tool-configuration)

---

## Version Control Tools

### GitHub CLI (`gh`)

**Installation**:
```bash
# macOS
brew install gh

# Windows (via winget)
winget install --id GitHub.cli

# Windows (via Chocolatey)
choco install gh

# Linux (Debian/Ubuntu)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Linux (Fedora/RHEL)
sudo dnf install gh
```

**Authentication**:
```bash
# Login to GitHub
gh auth login

# Check authentication status
gh auth status

# Logout
gh auth logout
```

**Common Commands**:
```bash
# Repository Management
gh repo create my-project --public
gh repo clone owner/repo
gh repo view owner/repo
gh repo delete owner/repo

# Pull Requests
gh pr create --title "feat: Add feature" --body "Description"
gh pr list
gh pr view 123
gh pr checkout 123
gh pr merge 123 --squash
gh pr review 123 --approve
gh pr close 123

# Issues
gh issue create --title "Bug report" --body "Description"
gh issue list --assignee @me
gh issue view 456
gh issue close 456
gh issue reopen 456

# Actions/Workflows
gh workflow list
gh workflow run workflow-name
gh run list
gh run view 789
gh run watch

# Releases
gh release create v1.0.0 --notes "Release notes"
gh release list
gh release view v1.0.0
```

**Configuration** (`.gh/config.yml` or `~/.config/gh/config.yml`):
```yaml
git_protocol: https
editor: vim
prompt: enabled
pager: less
```

---

### GitLab CLI (`glab`)

**Installation**:
```bash
# macOS
brew install glab

# Windows (via Scoop)
scoop install glab

# Windows (via Chocolatey)
choco install glab

# Linux (Debian/Ubuntu)
sudo apt install glab

# Linux (Arch)
yay -S glab

# Go install
go install gitlab.com/gitlab-org/cli/cmd/glab@latest
```

**Authentication**:
```bash
# Login to GitLab (gitlab.com or self-hosted)
glab auth login

# Login to self-hosted instance
glab auth login --hostname gitlab.example.com

# Check authentication status
glab auth status

# Set default GitLab instance
glab config set gitlab_host gitlab.example.com
```

**Common Commands**:
```bash
# Repository Management
glab repo create my-project --public
glab repo clone group/project
glab repo view
glab repo delete

# Merge Requests
glab mr create --title "feat: Add feature" --description "Description"
glab mr list
glab mr view 123
glab mr checkout 123
glab mr merge 123
glab mr approve 123
glab mr close 123
glab mr note 123 "Comment on MR"

# Issues
glab issue create --title "Bug report" --description "Description"
glab issue list --assignee @me
glab issue view 456
glab issue close 456
glab issue note 456 "Comment on issue"

# CI/CD Pipelines
glab ci view
glab ci trace
glab ci list
glab ci status

# Releases
glab release create v1.0.0 --notes "Release notes"
glab release list
glab release view v1.0.0
```

**Configuration** (`~/.config/glab-cli/config.yml`):
```yaml
hosts:
  gitlab.com:
    token: your_token_here
    git_protocol: https
    api_protocol: https
  gitlab.example.com:
    token: your_self_hosted_token
    git_protocol: https
    api_protocol: https
```

---

## Code Quality & Linting

### Python

#### Flake8
**Installation**:
```bash
pip install flake8
```

**Usage**:
```bash
# Lint all Python files
flake8 .

# Lint specific file
flake8 myfile.py

# Lint with specific rules
flake8 --max-line-length=100 --ignore=E501,W503 .
```

**Configuration** (`.flake8` or `setup.cfg`):
```ini
[flake8]
max-line-length = 100
exclude = .git,__pycache__,venv,build,dist
ignore = E203,E266,E501,W503
max-complexity = 10
```

#### Pylint
**Installation**:
```bash
pip install pylint
```

**Usage**:
```bash
# Lint all Python files
pylint mypackage/

# Lint specific file
pylint myfile.py

# Generate configuration file
pylint --generate-rcfile > .pylintrc
```

**Configuration** (`.pylintrc`):
```ini
[MASTER]
max-line-length=100
disable=C0111,R0903

[MESSAGES CONTROL]
disable=missing-docstring,too-few-public-methods
```

#### MyPy (Type Checking)
**Installation**:
```bash
pip install mypy
```

**Usage**:
```bash
# Type check all files
mypy .

# Type check specific file
mypy myfile.py

# Strict mode
mypy --strict myfile.py
```

**Configuration** (`mypy.ini` or `pyproject.toml`):
```ini
[mypy]
python_version = 3.11
warn_return_any = True
warn_unused_configs = True
disallow_untyped_defs = True
```

---

### JavaScript/TypeScript

#### ESLint
**Installation**:
```bash
npm install --save-dev eslint

# Initialize configuration
npx eslint --init
```

**Usage**:
```bash
# Lint all files
npx eslint .

# Lint specific file
npx eslint src/index.js

# Auto-fix issues
npx eslint --fix .
```

**Configuration** (`.eslintrc.json`):
```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-script/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-console": "warn"
  }
}
```

---

### PHP

#### PHPStan
**Installation**:
```bash
composer require --dev phpstan/phpstan
```

**Usage**:
```bash
# Analyze all PHP files
vendor/bin/phpstan analyse src tests

# Analyze with specific level (0-9, 9 is strictest)
vendor/bin/phpstan analyse --level 8 src
```

**Configuration** (`phpstan.neon`):
```neon
parameters:
    level: 8
    paths:
        - src
        - tests
    excludePaths:
        - vendor
```

#### Psalm
**Installation**:
```bash
composer require --dev vimeo/psalm
```

**Usage**:
```bash
# Initialize
vendor/bin/psalm --init

# Run analysis
vendor/bin/psalm

# Auto-fix issues
vendor/bin/psalm --alter --issues=all
```

---

### Go

#### golangci-lint
**Installation**:
```bash
# macOS
brew install golangci-lint

# Linux/Windows
curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(go env GOPATH)/bin
```

**Usage**:
```bash
# Run all linters
golangci-lint run

# Run specific linters
golangci-lint run --enable=gofmt,golint,govet

# Auto-fix issues
golangci-lint run --fix
```

**Configuration** (`.golangci.yml`):
```yaml
run:
  timeout: 5m
  tests: true

linters:
  enable:
    - gofmt
    - golint
    - govet
    - errcheck
    - staticcheck
    - ineffassign

linters-settings:
  gofmt:
    simplify: true
```

---

## Code Formatting

### Python - Black
**Installation**:
```bash
pip install black
```

**Usage**:
```bash
# Format all Python files
black .

# Format specific file
black myfile.py

# Check without modifying
black --check .

# Show diff
black --diff myfile.py
```

**Configuration** (`pyproject.toml`):
```toml
[tool.black]
line-length = 100
target-version = ['py311']
include = '\.pyi?$'
exclude = '''
/(
    \.git
  | \.venv
  | build
  | dist
)/
'''
```

---

### JavaScript/TypeScript - Prettier
**Installation**:
```bash
npm install --save-dev prettier
```

**Usage**:
```bash
# Format all files
npx prettier --write .

# Format specific file
npx prettier --write src/index.js

# Check without modifying
npx prettier --check .
```

**Configuration** (`.prettierrc.json`):
```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

**Ignore File** (`.prettierignore`):
```
node_modules
dist
build
coverage
.next
```

---

### PHP - PHP CS Fixer
**Installation**:
```bash
composer require --dev friendsofphp/php-cs-fixer
```

**Usage**:
```bash
# Fix all PHP files
vendor/bin/php-cs-fixer fix

# Fix specific directory
vendor/bin/php-cs-fixer fix src

# Dry run (check without fixing)
vendor/bin/php-cs-fixer fix --dry-run --diff
```

**Configuration** (`.php-cs-fixer.php`):
```php
<?php

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__ . '/src')
    ->in(__DIR__ . '/tests')
    ->exclude('vendor');

return (new PhpCsFixer\Config())
    ->setRules([
        '@PSR12' => true,
        'array_syntax' => ['syntax' => 'short'],
        'ordered_imports' => ['sort_algorithm' => 'alpha'],
        'no_unused_imports' => true,
    ])
    ->setFinder($finder);
```

---

### Go - gofmt
**Usage** (built-in):
```bash
# Format all Go files
gofmt -w .

# Format specific file
gofmt -w myfile.go

# Show diff without modifying
gofmt -d myfile.go
```

---

## Testing Frameworks

### Python - pytest
**Installation**:
```bash
pip install pytest pytest-cov
```

**Usage**:
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_auth.py

# Run with coverage
pytest --cov=src --cov-report=html

# Run in parallel
pytest -n auto

# Verbose output
pytest -v
```

**Configuration** (`pytest.ini`):
```ini
[pytest]
testpaths = tests
python_files = test_*.py *_test.py
python_classes = Test*
python_functions = test_*
addopts =
    -v
    --strict-markers
    --cov=src
    --cov-report=term-missing
markers =
    slow: marks tests as slow
    unit: marks tests as unit tests
    integration: marks tests as integration tests
```

---

### JavaScript/TypeScript - Jest
**Installation**:
```bash
npm install --save-dev jest @types/jest
```

**Usage**:
```bash
# Run all tests
npm test

# Run specific test file
npm test auth.test.js

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

**Configuration** (`jest.config.js`):
```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
  ],
  testMatch: [
    '**/__tests__/**/*.(test|spec).{js,jsx,ts,tsx}',
    '**/*.(test|spec).{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

---

### PHP - PHPUnit
**Installation**:
```bash
composer require --dev phpunit/phpunit
```

**Usage**:
```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Unit/AuthTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage
```

**Configuration** (`phpunit.xml`):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         bootstrap="vendor/autoload.php"
         colors="true">
    <testsuites>
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory>tests/Feature</directory>
        </testsuite>
    </testsuites>
    <coverage>
        <include>
            <directory>src</directory>
        </include>
    </coverage>
</phpunit>
```

---

## CI/CD Tools

### Pre-commit Hooks
**Installation**:
```bash
pip install pre-commit
```

**Setup**:
```bash
# Install hooks
pre-commit install

# Run manually on all files
pre-commit run --all-files

# Update hooks
pre-commit autoupdate
```

**Configuration** (`.pre-commit-config.yaml`):
```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
      - id: detect-private-key

  # Python
  - repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
      - id: black

  - repo: https://github.com/pycqa/flake8
    rev: 7.0.0
    hooks:
      - id: flake8

  # JavaScript
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.1.0
    hooks:
      - id: prettier
        types_or: [javascript, jsx, ts, tsx, json, yaml, markdown]

  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.56.0
    hooks:
      - id: eslint
        files: \.[jt]sx?$
        types: [file]
```

---

### Docker & Docker Compose
**Installation**:
```bash
# macOS
brew install docker docker-compose

# Windows: Download Docker Desktop

# Linux (Ubuntu)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo apt install docker-compose
```

**Common Commands**:
```bash
# Build image
docker build -t myapp:latest .

# Run container
docker run -p 8000:8000 myapp:latest

# Docker Compose
docker-compose up -d
docker-compose down
docker-compose logs -f
docker-compose ps
```

**Example `docker-compose.yml`**:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
    depends_on:
      - db
    volumes:
      - .:/app

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Development Environment

### VS Code Extensions

**Essential Extensions**:
- **Python**: Python, Pylance, Python Debugger
- **JavaScript/TypeScript**: ESLint, Prettier
- **PHP**: PHP Intelephense, PHP CS Fixer
- **Go**: Go
- **Git**: GitLens, GitHub Pull Requests
- **General**: EditorConfig, Docker, YAML, Markdown All in One

**Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "python.formatting.provider": "black",
  "javascript.format.enable": false,
  "typescript.format.enable": false,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  }
}
```

---

### EditorConfig

**Configuration** (`.editorconfig`):
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,jsx,ts,tsx,json,css,scss}]
indent_style = space
indent_size = 2

[*.{py}]
indent_style = space
indent_size = 4

[*.{php}]
indent_style = space
indent_size = 4

[*.{go}]
indent_style = tab
indent_size = 4

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
```

---

## Tool Configuration Summary

### Recommended Setup for New Projects

1. **Initialize version control**:
```bash
git init
gh repo create # or glab repo create
```

2. **Install pre-commit hooks**:
```bash
pip install pre-commit
pre-commit install
```

3. **Configure linting & formatting** (choose based on language):
   - Python: flake8, black, mypy
   - JavaScript: ESLint, Prettier
   - PHP: PHPStan, PHP CS Fixer
   - Go: golangci-lint, gofmt

4. **Set up testing framework**:
   - Python: pytest
   - JavaScript: Jest
   - PHP: PHPUnit
   - Go: go test

5. **Add EditorConfig** for consistent editor settings

6. **Configure CI/CD** (GitHub Actions or GitLab CI)

---

## Tool Integration Matrix

| Tool | Python | JavaScript | PHP | Go | Purpose |
|------|--------|------------|-----|-----|---------|
| **Linting** | flake8, pylint | ESLint | PHPStan, Psalm | golangci-lint | Code quality |
| **Formatting** | black | Prettier | PHP CS Fixer | gofmt | Code style |
| **Type Checking** | mypy | TypeScript | PHPStan, Psalm | Built-in | Static analysis |
| **Testing** | pytest | Jest, Mocha | PHPUnit | go test | Unit/integration tests |
| **Coverage** | pytest-cov | Jest | PHPUnit | go test -cover | Code coverage |
| **Pre-commit** | pre-commit | pre-commit/husky | pre-commit | pre-commit | Git hooks |

---

## Best Practices

1. **Always use version control CLI** (gh/glab) for consistency
2. **Enable pre-commit hooks** on all projects
3. **Enforce code formatting** (black, prettier, etc.)
4. **Run linters in CI/CD** to prevent bad code from merging
5. **Maintain high test coverage** (aim for 70%+)
6. **Use EditorConfig** for consistent formatting across team
7. **Document tool versions** in `requirements.txt`, `package.json`, etc.
8. **Keep tools updated** regularly

---

## Troubleshooting

### Common Issues

**Pre-commit hooks failing**:
```bash
# Update hooks
pre-commit autoupdate

# Clear cache
pre-commit clean

# Reinstall
pre-commit uninstall && pre-commit install
```

**Linter conflicts with formatter**:
```bash
# Configure linter to ignore formatting rules
# Example for Python: ignore E501 (line too long) when using black
```

**Docker permission issues** (Linux):
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

---

*Keep your tooling updated and consistent across the team!*
