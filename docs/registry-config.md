# Container Registry Configuration

CodeAssist CI/CD templates can use your own private container registry or fall back to public Docker Hub images.

## Quick Setup

### Option 1: Use Public Images (Default)

No configuration needed. Templates use official Docker Hub images:

| Framework | Public Image |
|-----------|--------------|
| PHP/Laravel | `php:8.3-cli` + manual setup |
| Python/Django | `python:3.12` + manual setup |
| Node.js/React | `node:20` |

### Option 2: Configure Your Own Registry

Create `.claude/registry.json` in your project or home directory:

```json
{
  "registry": "your-registry.example.com:5050/your-org/base-images",
  "images": {
    "php": {
      "testing": "php:8.3-testing",
      "laravel": "php:8.3-laravel",
      "base": "php:8.3-base"
    },
    "python": {
      "django": "python:3.12-django",
      "base": "python:3.12-base"
    },
    "node": {
      "playwright": "node:20-playwright",
      "builder": "node:20-builder",
      "base": "node:20-base"
    },
    "security": {
      "scanner": "security:scanner"
    }
  }
}
```

### Option 3: Environment Variable

Set `CODEASSIST_REGISTRY` to your registry prefix:

```bash
# Linux/macOS
export CODEASSIST_REGISTRY="your-registry.example.com:5050/your-org/base-images"

# Windows PowerShell
$env:CODEASSIST_REGISTRY = "your-registry.example.com:5050/your-org/base-images"
```

## Building Your Own Base Images

Want optimized CI images like we have? Here's how to build your own.

### Repository Structure

```
base-images/
├── php/
│   ├── 8.3-base/Dockerfile
│   ├── 8.3-laravel/Dockerfile
│   └── 8.3-testing/Dockerfile
├── python/
│   ├── 3.12-base/Dockerfile
│   └── 3.12-django/Dockerfile
├── node/
│   ├── 20-base/Dockerfile
│   └── 20-playwright/Dockerfile
├── security/
│   └── scanner/Dockerfile
└── .gitlab-ci.yml
```

### Example Dockerfiles

#### PHP 8.3 Testing Image

```dockerfile
# php/8.3-testing/Dockerfile
FROM php:8.3-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpq-dev libzip-dev libpng-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip gd \
    && pecl install redis xdebug \
    && docker-php-ext-enable redis xdebug

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install Node.js (for asset building)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Playwright browsers (for E2E testing)
RUN npx playwright install --with-deps chromium

WORKDIR /app
```

#### Python 3.12 Django Image

```dockerfile
# python/3.12-django/Dockerfile
FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    git curl libpq-dev gcc \
    && pip install --no-cache-dir poetry

# Pre-install common Django dependencies
RUN pip install --no-cache-dir \
    django psycopg2-binary redis celery gunicorn

WORKDIR /app
```

#### Node 20 Playwright Image

```dockerfile
# node/20-playwright/Dockerfile
FROM node:20-slim

RUN apt-get update && apt-get install -y \
    git curl \
    && npm install -g pnpm

# Install Playwright with all browsers
RUN npx playwright install --with-deps

WORKDIR /app
```

#### Security Scanner Image

```dockerfile
# security/scanner/Dockerfile
FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    git curl \
    && pip install --no-cache-dir \
    safety bandit semgrep pip-audit

# Install npm for JavaScript scanning
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm-audit-html @cyclonedx/cyclonedx-npm

# Install PHP security checker
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer global require enlightn/security-checker

# Add scan script
COPY security-scan.sh /usr/local/bin/security-scan
RUN chmod +x /usr/local/bin/security-scan

WORKDIR /app
```

### GitLab CI for Building Images

```yaml
# .gitlab-ci.yml
stages:
  - build

variables:
  REGISTRY: ${CI_REGISTRY_IMAGE}

.build-template:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $REGISTRY/$IMAGE_PATH -f $DOCKERFILE_PATH .
    - docker push $REGISTRY/$IMAGE_PATH

php-8.3-testing:
  extends: .build-template
  variables:
    IMAGE_PATH: php:8.3-testing
    DOCKERFILE_PATH: php/8.3-testing/Dockerfile

python-3.12-django:
  extends: .build-template
  variables:
    IMAGE_PATH: python:3.12-django
    DOCKERFILE_PATH: python/3.12-django/Dockerfile

node-20-playwright:
  extends: .build-template
  variables:
    IMAGE_PATH: node:20-playwright
    DOCKERFILE_PATH: node/20-playwright/Dockerfile

security-scanner:
  extends: .build-template
  variables:
    IMAGE_PATH: security:scanner
    DOCKERFILE_PATH: security/scanner/Dockerfile
```

## Using Without Custom Images

If you don't want to build custom images, the CI templates work with public images:

### Laravel (Public Images)

```yaml
test:
  image: php:8.3-cli
  before_script:
    - apt-get update && apt-get install -y git zip unzip libpq-dev
    - docker-php-ext-install pdo pdo_mysql
    - curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
  script:
    - composer install
    - php artisan test
```

### Python/Django (Public Images)

```yaml
test:
  image: python:3.12
  services:
    - postgres:15
  before_script:
    - pip install poetry
    - poetry install
  script:
    - poetry run pytest
```

### Node.js/React (Public Images)

```yaml
test:
  image: node:20
  script:
    - npm ci
    - npm test
```

## Performance Comparison

| Setup | First Run | Cached Run |
|-------|-----------|------------|
| Public images + install deps | ~3-5 min | ~2-3 min |
| Custom pre-built images | ~30-60 sec | ~15-30 sec |

Custom images save 2-4 minutes per job because dependencies are pre-installed.

## Registry Authentication

### GitLab Container Registry

```bash
# Login
docker login registry.gitlab.com
# Or for self-hosted
docker login gitlab.your-domain.com:5050

# In CI, use built-in variables
docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
```

### GitHub Container Registry

```bash
# Login with PAT
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# In GitHub Actions, use GITHUB_TOKEN
docker login ghcr.io -u ${{ github.actor }} -p ${{ secrets.GITHUB_TOKEN }}
```

### Docker Hub

```bash
docker login -u USERNAME -p PASSWORD
```

## Checklist

- [ ] Decide: Use public images or build custom?
- [ ] If custom: Set up base-images repository
- [ ] If custom: Build and push initial images
- [ ] Configure registry in `.claude/registry.json` or environment
- [ ] Test CI pipeline with new images
- [ ] Set up weekly rebuild schedule for security updates
