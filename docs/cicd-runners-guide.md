# CI/CD Runners Setup Guide

*Complete guide to setting up self-hosted runners for GitHub Actions and GitLab CI*

---

## 📚 Overview

This guide covers how to set up self-hosted runners for your CI/CD pipelines. Self-hosted runners give you more control, better performance, and cost savings compared to cloud-hosted runners.

**Why Self-Hosted Runners?**
- ✅ **Control**: Run on your own infrastructure
- ✅ **Performance**: Faster builds with better specs
- ✅ **Cost**: No per-minute charges for compute
- ✅ **Caching**: Persistent caches between builds
- ✅ **Custom Software**: Pre-install tools and dependencies
- ✅ **Network Access**: Access to internal services

---

## 🎯 Available Setups

This repository includes complete setup scripts for both GitHub Actions and GitLab CI:

### GitHub Actions Self-Hosted Runners
**Location**: [`/github/`](../github/)

- ✅ 4 dedicated runners (PHP, Node, Python, General)
- ✅ systemd service management
- ✅ Direct execution on host
- ✅ Docker access for containerized builds

**Files**:
- [`setup-github-runners.sh`](../github/setup-github-runners.sh) - Setup script
- [`GITHUB_RUNNERS_SETUP.md`](../github/GITHUB_RUNNERS_SETUP.md) - Full documentation
- [`QUICK_REFERENCE.txt`](../github/QUICK_REFERENCE.txt) - Quick reference card

### GitLab CI Self-Hosted Runners
**Location**: [`/gitlab/`](../gitlab/)

- ✅ 4 dedicated runners (PHP, Node, Python, General)
- ✅ systemd service management
- ✅ Docker executor for isolated builds
- ✅ Docker-in-Docker (DinD) support

**Files**:
- [`setup-gitlab-runners.sh`](../gitlab/setup-gitlab-runners.sh) - Setup script
- [`GITLAB_RUNNERS_SETUP.md`](../gitlab/GITLAB_RUNNERS_SETUP.md) - Full documentation
- [`QUICK_REFERENCE.txt`](../gitlab/QUICK_REFERENCE.txt) - Quick reference card

---

## 🚀 Quick Start

### For GitHub Actions

```bash
# 1. Download and run setup script
cd /tmp
wget https://raw.githubusercontent.com/YOUR_ORG/CodeAssist/main/github/setup-github-runners.sh
chmod +x setup-github-runners.sh
./setup-github-runners.sh

# 2. Get registration tokens from GitHub
# Go to: https://github.com/owner/repo/settings/actions/runners/new

# 3. Register runners
sudo /opt/register-github-runners.sh

# 4. Verify
sudo /opt/manage-github-runners.sh status
```

**Use in workflows**:
```yaml
jobs:
  build:
    runs-on: [self-hosted, php]
    steps:
      - uses: actions/checkout@v3
      - run: composer install
```

### For GitLab CI

```bash
# 1. Download and run setup script
cd /tmp
wget https://raw.githubusercontent.com/YOUR_ORG/CodeAssist/main/gitlab/setup-gitlab-runners.sh
chmod +x setup-gitlab-runners.sh
sudo ./setup-gitlab-runners.sh

# 2. Get registration tokens from GitLab
# Go to: https://gitlab.example.com/admin/runners

# 3. Register runners
sudo /opt/register-gitlab-runners.sh

# 4. Verify
sudo /opt/manage-gitlab-runners.sh status
```

**Use in .gitlab-ci.yml**:
```yaml
build:
  tags:
    - php
  script:
    - composer install
```

---

## 📊 Runner Comparison

| Feature | GitHub Actions | GitLab CI |
|---------|----------------|-----------|
| **Execution** | Direct on host | Docker executor |
| **Isolation** | systemd service | Docker containers |
| **Targeting** | Labels (`runs-on`) | Tags (`tags:`) |
| **Docker** | Access to host Docker | Docker-in-Docker (DinD) |
| **Management** | GitHub web UI | GitLab web UI |
| **Access Control** | Runner groups | Instance/Group/Project |
| **Configuration** | Per-runner directory | `config.toml` |
| **Updates** | Manual | Via package manager |

---

## 🏗️ Architecture

### GitHub Actions Runners

```
┌─────────────────────────────────────────────┐
│  GitHub Actions Runner (PHP)                │
│  ┌───────────────────────────────────────┐  │
│  │  Job Execution (Direct on Host)      │  │
│  │  - composer install                   │  │
│  │  - php artisan test                   │  │
│  │  - docker build (host Docker)         │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Working Directory: /opt/github-runner-php/ │
│  Service: github-runner-php.service         │
│  Labels: php, laravel, composer             │
└─────────────────────────────────────────────┘
```

### GitLab CI Runners

```
┌─────────────────────────────────────────────┐
│  GitLab Runner (PHP)                        │
│  ┌───────────────────────────────────────┐  │
│  │  Docker Executor                      │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │  Job Container (php:8.2)        │  │  │
│  │  │  - composer install             │  │  │
│  │  │  - php artisan test             │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Config: /opt/gitlab-runner-php/config/     │
│  Service: gitlab-runner-php.service         │
│  Tags: php, laravel, composer, docker       │
└─────────────────────────────────────────────┘
```

---

## 🎯 Choosing the Right Approach

### Use GitHub Actions Runners When:
- ✅ Using GitHub for version control
- ✅ Need direct host access
- ✅ Want simpler setup
- ✅ Running jobs that don't need isolation
- ✅ Have organization-wide runner needs

### Use GitLab CI Runners When:
- ✅ Using GitLab (cloud or self-hosted)
- ✅ Need job isolation (Docker containers)
- ✅ Building Docker images (Docker-in-Docker)
- ✅ Want built-in caching
- ✅ Need instance/group/project-level runners

### Use Both When:
- ✅ Running multiple platforms (GitHub + GitLab)
- ✅ Migrating between platforms
- ✅ Want redundancy
- ✅ Testing cross-platform CI/CD

---

## 🛠️ Runner Types

Both setups include 4 specialized runners:

### Runner-PHP
**Purpose**: PHP/Laravel/Composer projects

**GitHub Actions**:
- Labels: `php`, `laravel`, `composer`
- Use: `runs-on: [self-hosted, php]`

**GitLab CI**:
- Tags: `php`, `laravel`, `composer`, `docker`
- Image: `php:8.2`
- Use: `tags: [php]`

**Typical Jobs**:
- Composer dependency installation
- PHPUnit tests
- Laravel Pint linting
- PHPStan static analysis

---

### Runner-Node
**Purpose**: TypeScript/Next.js/npm projects

**GitHub Actions**:
- Labels: `node`, `typescript`, `nextjs`, `npm`
- Use: `runs-on: [self-hosted, node]`

**GitLab CI**:
- Tags: `node`, `typescript`, `nextjs`, `npm`, `docker`
- Image: `node:20`
- Use: `tags: [node]`

**Typical Jobs**:
- npm/yarn dependency installation
- TypeScript compilation
- Next.js builds
- Jest testing
- ESLint linting

---

### Runner-Python
**Purpose**: Python/pip projects

**GitHub Actions**:
- Labels: `python`, `pip`
- Use: `runs-on: [self-hosted, python]`

**GitLab CI**:
- Tags: `python`, `pip`, `docker`
- Image: `python:3.11`
- Use: `tags: [python]`

**Typical Jobs**:
- pip dependency installation
- pytest testing
- Django/Flask application testing
- Black/Flake8 linting
- MyPy type checking

---

### Runner-General
**Purpose**: General-purpose tasks, shell scripts, deployment

**GitHub Actions**:
- Labels: `general`, `shell`
- Use: `runs-on: [self-hosted, general]`

**GitLab CI**:
- Tags: `general`, `docker`, `shell`
- Image: `alpine:latest`
- Use: `tags: [general]`

**Typical Jobs**:
- Shell script execution
- Deployment tasks
- File operations
- Git operations
- Notification sending

---

## 📝 Workflow Examples

### GitHub Actions - Multi-Language Monorepo

```yaml
name: Monorepo CI

on:
  push:
    branches: [ main, develop ]

jobs:
  php-backend:
    runs-on: [self-hosted, php]
    steps:
      - uses: actions/checkout@v3
      - name: Install PHP dependencies
        run: cd backend && composer install
      - name: Run PHP tests
        run: cd backend && php artisan test

  node-frontend:
    runs-on: [self-hosted, node]
    steps:
      - uses: actions/checkout@v3
      - name: Install Node dependencies
        run: cd frontend && npm ci
      - name: Build frontend
        run: cd frontend && npm run build

  python-services:
    runs-on: [self-hosted, python]
    steps:
      - uses: actions/checkout@v3
      - name: Install Python dependencies
        run: cd services && pip install -r requirements.txt
      - name: Run Python tests
        run: cd services && pytest

  deploy:
    runs-on: [self-hosted, general]
    needs: [php-backend, node-frontend, python-services]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy application
        run: ./deploy.sh production
```

### GitLab CI - Multi-Language Monorepo

```yaml
stages:
  - test
  - build
  - deploy

php-backend:
  stage: test
  tags:
    - php
  image: php:8.2
  script:
    - cd backend
    - composer install
    - php artisan test

node-frontend:
  stage: build
  tags:
    - node
  image: node:20
  script:
    - cd frontend
    - npm ci
    - npm run build
  artifacts:
    paths:
      - frontend/dist/

python-services:
  stage: test
  tags:
    - python
  image: python:3.11
  script:
    - cd services
    - pip install -r requirements.txt
    - pytest

deploy-production:
  stage: deploy
  tags:
    - general
  image: alpine:latest
  script:
    - ./deploy.sh production
  only:
    - main
  when: manual
```

---

## 🔧 Management Commands

### GitHub Actions

```bash
# Check status
sudo /opt/manage-github-runners.sh status

# Start/Stop/Restart
sudo /opt/manage-github-runners.sh start
sudo /opt/manage-github-runners.sh stop
sudo /opt/manage-github-runners.sh restart

# View logs
sudo /opt/manage-github-runners.sh logs php
sudo journalctl -u github-runner-php -f

# Per-runner control
sudo systemctl status github-runner-php
sudo systemctl restart github-runner-node
```

### GitLab CI

```bash
# Check status
sudo /opt/manage-gitlab-runners.sh status

# Start/Stop/Restart
sudo /opt/manage-gitlab-runners.sh start
sudo /opt/manage-gitlab-runners.sh stop
sudo /opt/manage-gitlab-runners.sh restart

# View logs
sudo /opt/manage-gitlab-runners.sh logs php
sudo journalctl -u gitlab-runner-php -f

# Per-runner control
sudo systemctl status gitlab-runner-php
sudo systemctl restart gitlab-runner-node

# Verify registration
sudo gitlab-runner verify --config /opt/gitlab-runner-php/config/config.toml
```

---

## 🐛 Common Issues & Solutions

### Issue: Runner Not Appearing

**GitHub Actions**:
```bash
# Check service status
sudo systemctl status github-runner-php

# Check runner configuration
cat /opt/github-runner-php/.runner

# Re-register if needed
cd /opt/github-runner-php
./config.sh remove --token YOUR_TOKEN
sudo /opt/register-github-runners.sh
```

**GitLab CI**:
```bash
# Check service status
sudo systemctl status gitlab-runner-php

# Verify registration
sudo gitlab-runner verify --config /opt/gitlab-runner-php/config/config.toml

# Re-register if needed
sudo gitlab-runner unregister --config /opt/gitlab-runner-php/config/config.toml --name "Runner-PHP"
sudo /opt/register-gitlab-runners.sh
```

### Issue: Jobs Stuck in Queue

**Possible Causes**:
1. ❌ No runner with matching labels/tags
2. ❌ All runners busy
3. ❌ Runner offline

**Solution**:
```bash
# Check runner status
sudo /opt/manage-github-runners.sh status  # GitHub
sudo /opt/manage-gitlab-runners.sh status  # GitLab

# Check logs for errors
sudo journalctl -u github-runner-php -n 100
sudo journalctl -u gitlab-runner-php -n 100

# Restart runners
sudo systemctl restart github-runner-php
sudo systemctl restart gitlab-runner-php
```

### Issue: Docker Permission Errors

```bash
# Ensure user is in docker group
sudo usermod -aG docker $USER
sudo usermod -aG docker gitlab-runner  # GitLab only

# Restart Docker
sudo systemctl restart docker

# Restart runners
sudo systemctl restart github-runner-php
sudo systemctl restart gitlab-runner-php
```

### Issue: Disk Space Full

```bash
# Clean up Docker
docker system prune -a

# GitHub Actions: Clear old job files
rm -rf /opt/github-runner-*/_work/_temp/*

# GitLab CI: Clear build cache
sudo gitlab-runner exec docker --cache-dir /cache --clear-cache

# Check disk usage
df -h
du -sh /opt/github-runner-*
du -sh /opt/gitlab-runner-*
```

---

## 🔐 Security Best Practices

### General

1. ✅ **Never use self-hosted runners for public repositories** (GitHub)
2. ✅ Run as regular user, not root (GitHub) / Use dedicated user (GitLab)
3. ✅ Keep runners updated
4. ✅ Monitor runner logs regularly
5. ✅ Use runner groups/scopes for access control
6. ✅ Isolate runners in separate VMs/containers for sensitive projects
7. ✅ Disable runners when not in use

### GitHub-Specific

- ✅ Use repository/organization runners, not public
- ✅ Enable runner groups for access control
- ✅ Review workflows before allowing execution
- ✅ Use environment secrets, not repository secrets
- ✅ Require approval for workflow runs

### GitLab-Specific

- ✅ Use project/group runners instead of instance-wide when possible
- ✅ Enable Docker privileged mode only when needed
- ✅ Use protected branches and protected runners
- ✅ Configure runner tags carefully
- ✅ Use GitLab CI/CD token permissions

---

## 📊 Performance Tips

### Caching

**GitHub Actions**:
```yaml
- uses: actions/cache@v3
  with:
    path: ~/.composer/cache
    key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
```

**GitLab CI**:
```yaml
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - vendor/
    - node_modules/
```

### Artifacts

**GitHub Actions**:
```yaml
- uses: actions/upload-artifact@v3
  with:
    name: build-output
    path: dist/
```

**GitLab CI**:
```yaml
artifacts:
  paths:
    - dist/
  expire_in: 1 week
```

### Parallelization

**GitHub Actions** (Matrix builds):
```yaml
strategy:
  matrix:
    php: [8.1, 8.2, 8.3]
runs-on: [self-hosted, php]
```

**GitLab CI** (Parallel keyword):
```yaml
test:
  parallel: 3
  tags:
    - python
```

---

## 📚 Additional Resources

- **GitHub Actions Docs**: https://docs.github.com/en/actions/hosting-your-own-runners
- **GitLab Runner Docs**: https://docs.gitlab.com/runner/
- **Docker Docs**: https://docs.docker.com/
- **systemd Docs**: https://www.freedesktop.org/software/systemd/man/

---

## ✅ Checklist for Production

- [ ] Runners installed on dedicated server/VM
- [ ] systemd services enabled and running
- [ ] Runners registered and showing online
- [ ] Test workflows/pipelines passing
- [ ] Monitoring and alerting configured
- [ ] Disk space monitoring enabled
- [ ] Regular cleanup jobs scheduled (docker prune)
- [ ] Runner logs being collected
- [ ] Access control configured (runner groups/scopes)
- [ ] Documentation updated with runner-specific info
- [ ] Team trained on using self-hosted runners

---

*For detailed setup instructions, see the platform-specific documentation in [`/github/`](../github/) and [`/gitlab/`](../gitlab/) directories.*
