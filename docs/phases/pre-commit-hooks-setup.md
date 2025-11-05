# Pre-commit Hooks Setup Phase

*Automated code quality enforcement before every commit*

---

## Overview

Pre-commit hooks run automated checks before each commit to ensure code quality, consistent formatting, and catch common errors.

**Benefits**:
- Prevent bad code from being committed
- Enforce consistent code style
- Catch security issues early
- Reduce code review time

**Related Documents**:
- [Development Tooling Guide](../development-tooling-guide.md)
- [Framework Setup Guides](../framework-configs/)

---

## Step 1: Install Pre-commit Framework

```bash
# Install pre-commit (Python-based, works for all languages)
pip install pre-commit

# Or via system package manager
# macOS: brew install pre-commit
# Ubuntu: sudo apt install pre-commit
```

---

## Step 2: Create Configuration

**File**: `.pre-commit-config.yaml`

### Python Projects

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

  # Python formatting
  - repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
      - id: black

  # Python linting
  - repo: https://github.com/pycqa/flake8
    rev: 7.0.0
    hooks:
      - id: flake8

  # Type checking
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
```

---

### PHP/Laravel Projects

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

  # PHP CS Fixer
  - repo: local
    hooks:
      - id: php-cs-fixer
        name: PHP CS Fixer
        entry: ./vendor/bin/php-cs-fixer
        language: system
        types: [php]
        args: ['fix', '--dry-run', '--diff']

  # PHPStan
  - repo: local
    hooks:
      - id: phpstan
        name: PHPStan
        entry: ./vendor/bin/phpstan
        language: system
        types: [php]
        args: ['analyse', '--memory-limit=1G']
        pass_filenames: false

  # Paratest (quick smoke test)
  - repo: local
    hooks:
      - id: paratest-quick
        name: Paratest (Quick)
        entry: ./vendor/bin/paratest
        language: system
        types: [php]
        args: ['--testsuite=Unit', '--processes=auto']
        pass_filenames: false
        stages: [push]  # Only on push, not every commit
```

---

### JavaScript/TypeScript Projects

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-added-large-files
      - id: detect-private-key

  # ESLint
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.56.0
    hooks:
      - id: eslint
        files: \.[jt]sx?$
        types: [file]

  # Prettier
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.1.0
    hooks:
      - id: prettier
        types_or: [javascript, jsx, ts, tsx, json, yaml, markdown, css, scss]
```

---

## Step 3: Install Hooks

```bash
# Install pre-commit hooks
pre-commit install

# Install for all git hooks (optional)
pre-commit install --hook-type pre-commit
pre-commit install --hook-type pre-push
pre-commit install --hook-type commit-msg
```

---

## Step 4: Test Configuration

```bash
# Run on all files (first time)
pre-commit run --all-files

# Run on staged files
pre-commit run

# Run specific hook
pre-commit run black --all-files
```

---

## Step 5: Update Hooks

```bash
# Update to latest versions
pre-commit autoupdate

# Clean cache
pre-commit clean
```

---

## Language-Specific Tools Setup

### PHP/Laravel Tools

**Install required packages**:
```bash
composer require --dev friendsofphp/php-cs-fixer
composer require --dev phpstan/phpstan
composer require --dev larastan/larastan
```

**Configuration** (`.php-cs-fixer.php`):
```php
<?php

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__ . '/app')
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

**Configuration** (`phpstan.neon`):
```neon
includes:
    - ./vendor/larastan/larastan/extension.neon

parameters:
    level: 8
    paths:
        - app
        - tests
    excludePaths:
        - vendor
```

---

### Python Tools

**Install required packages**:
```bash
pip install black flake8 mypy
```

**Configuration** (`pyproject.toml`):
```toml
[tool.black]
line-length = 100
target-version = ['py311']

[tool.mypy]
python_version = "3.11"
warn_return_any = true
warn_unused_configs = true
```

**Configuration** (`.flake8`):
```ini
[flake8]
max-line-length = 100
exclude = .git,__pycache__,venv,build,dist
ignore = E203,E266,W503
```

---

### JavaScript/TypeScript Tools

**Install required packages**:
```bash
npm install --save-dev eslint prettier
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Configuration** (`.eslintrc.json`):
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

**Configuration** (`.prettierrc.json`):
```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

---

## Step 6: Bypass Hooks (Emergency Only)

```bash
# Skip pre-commit hooks (NOT RECOMMENDED)
git commit --no-verify -m "emergency fix"

# Better: Fix issues and commit properly
pre-commit run --all-files
git add .
git commit -m "fix: resolve linting issues"
```

---

## Step 7: Documentation

**Add to `.claude/CLAUDE.md`**:

```markdown
## Pre-commit Hooks

### Installed Hooks
- Code formatting: [Black/PHP CS Fixer/Prettier]
- Linting: [Flake8/PHPStan/ESLint]
- Type checking: [MyPy/PHPStan/TypeScript]
- Security: detect-private-key, check-added-large-files

### Usage
```bash
# Hooks run automatically on commit
git commit -m "feat: add feature"

# Run manually
pre-commit run --all-files

# Update hooks
pre-commit autoupdate
```

### Troubleshooting
If hooks fail:
1. Review errors in terminal output
2. Fix issues automatically where possible
3. Re-run: `pre-commit run --all-files`
4. Commit changes

**Never use `--no-verify` unless absolutely necessary.**
```

---

## Common Issues and Solutions

### Hook Fails: File Not Found

**Problem**: `./vendor/bin/phpstan: No such file or directory`

**Solution**:
```bash
composer install
pre-commit run --all-files
```

---

### Hook Fails: Permission Denied

**Problem**: `permission denied: ./vendor/bin/php-cs-fixer`

**Solution**:
```bash
chmod +x ./vendor/bin/php-cs-fixer
chmod +x ./vendor/bin/phpstan
```

---

### Hook Too Slow

**Problem**: Tests run on every commit, too slow

**Solution**: Move tests to pre-push:
```yaml
- id: tests
  stages: [push]  # Only run on push
```

---

### Skip Hook Temporarily

```bash
# Skip specific hook
SKIP=phpstan git commit -m "wip: work in progress"

# Skip all hooks (emergency only)
git commit --no-verify -m "emergency fix"
```

---

## Best Practices

1. **Run on all files first**: `pre-commit run --all-files` after setup
2. **Update regularly**: `pre-commit autoupdate` monthly
3. **Keep hooks fast**: Move slow tests to pre-push stage
4. **Document bypasses**: Always explain why `--no-verify` was used
5. **Fix, don't skip**: Address issues properly rather than bypassing

---

## Integration with CI/CD

**Ensure CI runs same checks**:

**GitHub Actions** (`.github/workflows/ci.yml`):
```yaml
name: CI

on: [push, pull_request]

jobs:
  pre-commit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install pre-commit
        run: pip install pre-commit
      - name: Run pre-commit
        run: pre-commit run --all-files
```

---

## Next Steps

After pre-commit setup:
1. ✅ Test hooks: `pre-commit run --all-files`
2. ✅ Make a test commit to verify
3. ✅ Proceed to [Task Management Setup](./task-management-setup.md)
4. ✅ Set up [Database Backup System](../database-backup-strategy.md)

---

*Pre-commit hooks ensure code quality from day one!*
