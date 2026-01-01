# CI/CD Templates

Ready-to-use pipeline configurations for GitLab CI and GitHub Actions.

## Quick Start

1. Pick your stack from the table below
2. Copy the template to your project
3. Customize variables as needed

## Templates

| Stack | GitLab CI | GitHub Actions |
|-------|-----------|----------------|
| **Laravel/PHP** | [gitlab/laravel.yml](gitlab/laravel.yml) | [github/laravel.yml](github/laravel.yml) |
| **Django/Python** | [gitlab/django.yml](gitlab/django.yml) | [github/django.yml](github/django.yml) |
| **React/Next.js** | [gitlab/react.yml](gitlab/react.yml) | [github/react.yml](github/react.yml) |
| **Full-Stack** | [gitlab/fullstack.yml](gitlab/fullstack.yml) | [github/fullstack.yml](github/fullstack.yml) |

## Usage

### GitLab CI

```bash
# Copy template
cp docs/ci-templates/gitlab/laravel.yml .gitlab-ci.yml

# Customize and commit
git add .gitlab-ci.yml
git commit -m "Add CI pipeline"
```

### GitHub Actions

```bash
# Create workflow directory
mkdir -p .github/workflows

# Copy template
cp docs/ci-templates/github/laravel.yml .github/workflows/ci.yml

# Customize and commit
git add .github/workflows/ci.yml
git commit -m "Add CI workflow"
```

## What's Included

All templates include:

| Feature | Description |
|---------|-------------|
| **YAML Linting** | Validates YAML syntax with yamllint |
| **Parallel Jobs** | Lint, test, typecheck run simultaneously |
| **Caching** | Dependencies cached between runs |
| **Security Scanning** | Dependency vulnerability checks |
| **Coverage** | Test coverage reporting |

Stack-specific features:

| Stack | Database | E2E Tests | Build Artifacts |
|-------|----------|-----------|-----------------|
| Laravel | MySQL 8.0 | - | Optional |
| Django | PostgreSQL 15 | - | Optional |
| React | - | Playwright | Yes |
| Full-Stack | MySQL 8.0 | Playwright | Yes |

## Customization

### Environment Variables

Templates use sensible defaults. Override as needed:

**GitLab CI** (in `.gitlab-ci.yml`):
```yaml
variables:
  PHP_VERSION: "8.2"  # Change from 8.3
  MYSQL_DATABASE: myapp_test
```

**GitHub Actions** (in workflow file):
```yaml
env:
  NODE_VERSION: '18'  # Change from 20
```

### Custom Docker Images

For faster builds, use pre-built images. See [registry-config.md](../registry-config.md).

Replace public images:
```yaml
# Before (public)
image: php:8.3-cli

# After (custom registry)
image: your-registry.com/php:8.3-testing
```

## Principles

These templates follow the `ci-templates` skill principles:

1. **Fail fast** - Lint runs before tests
2. **Cache everything** - Dependencies cached
3. **Parallelize** - Independent jobs run together
4. **Security first** - Vulnerability scanning included
5. **Public by default** - No private registry required

See `skills/workflow/ci-templates/SKILL.md` for the full skill.

## Troubleshooting

### MySQL Connection Failed (GitLab)

Ensure service is defined and use `mysql` as host:
```yaml
services:
  - mysql:8.0
variables:
  DB_HOST: mysql  # Not localhost or 127.0.0.1
```

### MySQL Connection Failed (GitHub)

Use `127.0.0.1` and ensure health check passes:
```yaml
services:
  mysql:
    image: mysql:8.0
    ports:
      - 3306:3306
    options: --health-cmd="mysqladmin ping"
# Use DB_HOST: 127.0.0.1
```

### Playwright Browsers Missing

Install browsers in your workflow:
```yaml
# GitLab
script:
  - npx playwright install --with-deps

# GitHub
- run: npx playwright install --with-deps
```

### Cache Not Working

Check cache key includes lock file hash:
```yaml
# GitLab
cache:
  key: ${CI_COMMIT_REF_SLUG}-composer
  paths: [vendor/]

# GitHub
- uses: actions/cache@v4
  with:
    key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
```

### YAML Lint Failures

The yamllint job validates YAML syntax. Common issues:

```yaml
# Wrong - trailing spaces
key: value

# Wrong - inconsistent indentation
parent:
  child1: value
   child2: value  # extra space

# Right
parent:
  child1: value
  child2: value
```

To check locally:
```bash
pip install yamllint
yamllint .gitlab-ci.yml
# or
yamllint .github/workflows/ci.yml
```
