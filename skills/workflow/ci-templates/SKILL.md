---
name: ci-templates
description: "Use when setting up GitLab CI/CD pipelines. Provides standardized templates with configurable base images for consistent, fast builds."
---

# CI/CD Templates

Standardized GitLab CI/CD templates with configurable container registries for fast, consistent pipelines.

## When to Use

- Setting up a new GitLab CI/CD pipeline
- Migrating an existing project to use base images
- Adding testing, linting, or deployment stages
- Optimizing slow CI pipelines

## Registry Configuration

Templates support three modes:

| Mode | Setup | Speed |
|------|-------|-------|
| **Public images** | None (default) | Slower (installs deps each run) |
| **Custom registry** | `.claude/registry.json` | Fast (pre-built images) |
| **Environment var** | `CODEASSIST_REGISTRY` | Fast (pre-built images) |

See `docs/registry-config.md` for full setup instructions.

### Quick Config

Create `.claude/registry.json`:
```json
{
  "registry": "your-registry.example.com/base-images",
  "images": {
    "php": { "testing": "php:8.3-testing" },
    "python": { "django": "python:3.12-django" },
    "node": { "base": "node:20-base" }
  }
}
```

Or set environment variable:
```bash
export CODEASSIST_REGISTRY="your-registry.example.com/base-images"
```

## Image Reference

### With Custom Registry

| Category | Image Tag | Use Case |
|----------|-----------|----------|
| **PHP** | `php:8.3-testing` | Laravel tests with PHPUnit/Pest |
| **PHP** | `php:8.3-laravel` | Production builds |
| **Python** | `python:3.12-django` | Django with PostgreSQL, Redis |
| **Python** | `python:3.12-base` | Minimal Python |
| **Node** | `node:20-playwright` | E2E testing with browsers |
| **Node** | `node:20-base` | Minimal Node.js |
| **Security** | `security:scanner` | Dependency scanning |

### Public Fallbacks (Docker Hub)

| Framework | Public Image | Notes |
|-----------|--------------|-------|
| PHP | `php:8.3-cli` | Requires manual extension install |
| Python | `python:3.12` | Requires pip install |
| Node | `node:20` | Ready to use |

## Laravel Pipeline Template

```yaml
# .gitlab-ci.yml for Laravel projects
stages:
  - prepare
  - test
  - build
  - deploy

variables:
  MYSQL_DATABASE: testing
  MYSQL_ROOT_PASSWORD: secret

.php-base:
  image: gitlab.liauw-media.de:5050/liauwmedia/base-images/php:8.3-testing
  cache:
    key: ${CI_COMMIT_REF_SLUG}-composer
    paths:
      - vendor/

install:
  extends: .php-base
  stage: prepare
  script:
    - composer install --prefer-dist --no-ansi --no-interaction --no-progress
  artifacts:
    paths:
      - vendor/
    expire_in: 1 hour

test:
  extends: .php-base
  stage: test
  needs: [install]
  services:
    - mysql:8.0
  script:
    - cp .env.testing .env
    - php artisan key:generate
    - php artisan test --parallel
  coverage: '/Lines:\s*(\d+\.\d+)%/'

lint:
  extends: .php-base
  stage: test
  needs: [install]
  script:
    - ./vendor/bin/pint --test
    - ./vendor/bin/phpstan analyse

security:
  image: gitlab.liauw-media.de:5050/liauwmedia/base-images/security:scanner
  stage: test
  script:
    - security-scan --type=composer
  allow_failure: true
```

## Python/Django Pipeline Template

```yaml
# .gitlab-ci.yml for Django projects
stages:
  - test
  - build
  - deploy

variables:
  POSTGRES_DB: test_db
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres
  DATABASE_URL: "postgresql://postgres:postgres@postgres:5432/test_db"

.python-base:
  image: gitlab.liauw-media.de:5050/liauwmedia/base-images/python:3.12-django
  cache:
    key: ${CI_COMMIT_REF_SLUG}-pip
    paths:
      - .venv/

test:
  extends: .python-base
  stage: test
  services:
    - postgres:15
    - redis:7
  before_script:
    - poetry install
  script:
    - poetry run pytest --cov=. --cov-report=term
  coverage: '/TOTAL.*\s+(\d+%)/'

lint:
  extends: .python-base
  stage: test
  script:
    - poetry run black --check .
    - poetry run ruff check .
    - poetry run mypy .

security:
  image: gitlab.liauw-media.de:5050/liauwmedia/base-images/security:scanner
  stage: test
  script:
    - security-scan --type=pip
  allow_failure: true
```

## Node.js/React Pipeline Template

```yaml
# .gitlab-ci.yml for React/Next.js projects
stages:
  - install
  - test
  - build
  - deploy

.node-base:
  image: gitlab.liauw-media.de:5050/liauwmedia/base-images/node:20-base
  cache:
    key: ${CI_COMMIT_REF_SLUG}-npm
    paths:
      - node_modules/
      - .next/cache/

install:
  extends: .node-base
  stage: install
  script:
    - npm ci
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour

lint:
  extends: .node-base
  stage: test
  needs: [install]
  script:
    - npm run lint
    - npm run typecheck

test:
  extends: .node-base
  stage: test
  needs: [install]
  script:
    - npm run test -- --coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'

e2e:
  image: gitlab.liauw-media.de:5050/liauwmedia/base-images/node:20-playwright
  stage: test
  needs: [install]
  script:
    - npm ci
    - npx playwright install --with-deps
    - npm run test:e2e
  artifacts:
    when: always
    paths:
      - playwright-report/
    expire_in: 7 days

build:
  extends: .node-base
  stage: build
  needs: [lint, test]
  script:
    - npm run build
  artifacts:
    paths:
      - .next/
      - dist/
    expire_in: 1 week

security:
  image: gitlab.liauw-media.de:5050/liauwmedia/base-images/security:scanner
  stage: test
  script:
    - security-scan --type=npm
  allow_failure: true
```

## Full-Stack Pipeline (Laravel + React)

```yaml
# .gitlab-ci.yml for Laravel + React monorepo
stages:
  - install
  - test
  - build
  - deploy

# Backend jobs
backend:install:
  image: gitlab.liauw-media.de:5050/liauwmedia/base-images/php:8.3-testing
  stage: install
  script:
    - cd backend && composer install --prefer-dist
  artifacts:
    paths:
      - backend/vendor/
    expire_in: 1 hour
  cache:
    key: backend-${CI_COMMIT_REF_SLUG}
    paths:
      - backend/vendor/

backend:test:
  image: gitlab.liauw-media.de:5050/liauwmedia/base-images/php:8.3-testing
  stage: test
  needs: [backend:install]
  services:
    - mysql:8.0
  script:
    - cd backend
    - cp .env.testing .env
    - php artisan key:generate
    - php artisan test --parallel

# Frontend jobs
frontend:install:
  image: gitlab.liauw-media.de:5050/liauwmedia/base-images/node:20-base
  stage: install
  script:
    - cd frontend && npm ci
  artifacts:
    paths:
      - frontend/node_modules/
    expire_in: 1 hour
  cache:
    key: frontend-${CI_COMMIT_REF_SLUG}
    paths:
      - frontend/node_modules/

frontend:test:
  image: gitlab.liauw-media.de:5050/liauwmedia/base-images/node:20-base
  stage: test
  needs: [frontend:install]
  script:
    - cd frontend && npm run test

frontend:build:
  image: gitlab.liauw-media.de:5050/liauwmedia/base-images/node:20-base
  stage: build
  needs: [frontend:test]
  script:
    - cd frontend && npm run build
  artifacts:
    paths:
      - frontend/dist/
    expire_in: 1 week

# E2E tests (full stack)
e2e:
  image: gitlab.liauw-media.de:5050/liauwmedia/base-images/node:20-playwright
  stage: test
  needs: [backend:install, frontend:install]
  services:
    - mysql:8.0
  script:
    - cd backend && php artisan serve &
    - cd frontend && npm run test:e2e
  artifacts:
    when: always
    paths:
      - frontend/playwright-report/

# Security scan
security:
  image: gitlab.liauw-media.de:5050/liauwmedia/base-images/security:scanner
  stage: test
  script:
    - security-scan --type=composer --path=backend
    - security-scan --type=npm --path=frontend
  allow_failure: true
```

## Minimal Templates

### With Custom Registry

```yaml
# PHP - uses pre-built image with all extensions
test:
  image: ${REGISTRY}/php:8.3-testing
  script:
    - composer install
    - php artisan test
```

```yaml
# Python - uses pre-built image with Django deps
test:
  image: ${REGISTRY}/python:3.12-django
  script:
    - poetry install
    - pytest
```

```yaml
# Node - uses pre-built image
test:
  image: ${REGISTRY}/node:20-base
  script:
    - npm ci
    - npm test
```

### With Public Images (No Registry Required)

```yaml
# PHP - public image, installs deps manually
test:
  image: php:8.3-cli
  before_script:
    - apt-get update && apt-get install -y git zip unzip libpq-dev libzip-dev
    - docker-php-ext-install pdo pdo_mysql pdo_pgsql zip
    - curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
  script:
    - composer install
    - php artisan test
  cache:
    paths:
      - vendor/
```

```yaml
# Python - public image
test:
  image: python:3.12
  services:
    - postgres:15
  before_script:
    - pip install poetry
    - poetry install
  script:
    - poetry run pytest
  cache:
    paths:
      - .venv/
```

```yaml
# Node - public image (works out of the box)
test:
  image: node:20
  script:
    - npm ci
    - npm test
  cache:
    paths:
      - node_modules/
```

```yaml
# Playwright E2E - public image
e2e:
  image: mcr.microsoft.com/playwright:v1.40.0-jammy
  script:
    - npm ci
    - npx playwright test
```

## Image Selection Guide

| Scenario | Recommended Image |
|----------|-------------------|
| Laravel unit/feature tests | `php:8.3-testing` |
| Laravel production build | `php:8.3-laravel` |
| Laravel with Playwright E2E | `php:8.3-testing` (includes browsers) |
| Django tests | `python:3.12-django` |
| Python scraping | `python:3.12-scraper` |
| React/Next.js build | `node:20-base` |
| Playwright E2E | `node:20-playwright` |
| Native npm packages | `node:20-builder` |
| Security scanning | `security:scanner` |

## Performance Tips

1. **Use caching**: Cache `vendor/`, `node_modules/`, `.venv/`
2. **Use artifacts**: Pass build outputs between stages
3. **Parallel jobs**: Run independent tests in parallel
4. **Use `needs`**: Don't wait for unrelated jobs
5. **Optimize images**: Our images are pre-cached on runners

## Checklist

When setting up a new pipeline:

- [ ] Choose appropriate base image
- [ ] Set up caching for dependencies
- [ ] Configure services (database, redis) if needed
- [ ] Add security scanning stage
- [ ] Set up artifacts for build outputs
- [ ] Test locally with `gitlab-runner exec docker`

## Integration with Commands

These templates are automatically suggested when using:
- `/laravel` - PHP/Laravel templates
- `/python` - Python/Django templates
- `/react` - Node.js/React templates
- `/architect security` - Security scanner integration
