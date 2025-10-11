# GitLab Multi-Runner Setup Guide

Complete guide for setting up multiple GitLab runners for different project types.

## 🎯 Overview

This setup creates **4 dedicated GitLab runners**:

| Runner | Purpose | Tags | Default Image |
|--------|---------|------|---------------|
| **Runner-PHP** | PHP/Laravel/Composer projects | `php`, `laravel`, `composer`, `docker` | `php:8.2` |
| **Runner-Node** | TypeScript/Next.js/npm projects | `node`, `typescript`, `nextjs`, `npm`, `docker` | `node:20` |
| **Runner-Python** | Python/pip projects | `python`, `pip`, `docker` | `python:3.11` |
| **Runner-General** | General-purpose tasks | `general`, `docker`, `shell` | `alpine:latest` |

Each runner:
- ✅ Runs as dedicated systemd service
- ✅ Has isolated config directory in `/opt/gitlab-runner-{type}/config/`
- ✅ Uses Docker executor for isolated builds
- ✅ Can run Docker-in-Docker (DinD) for building images
- ✅ Has specific tags for CI/CD job targeting

## 📋 Prerequisites

- **Ubuntu/Debian** server
- **Root access** (sudo)
- **Docker** installed and running
- **GitLab instance** URL (e.g., `https://gitlab.liauw-media.de`)
- **Registration tokens** from GitLab (we'll get these)

## 🚀 Installation

### Step 1: Run Setup Script

```bash
# Make script executable
chmod +x /tmp/setup-gitlab-runners.sh

# Run as root
sudo /tmp/setup-gitlab-runners.sh
```

This creates:
```
/opt/
├── gitlab-runner-php/
│   └── config/
│       └── config.toml
├── gitlab-runner-node/
│   └── config/
│       └── config.toml
├── gitlab-runner-python/
│   └── config/
│       └── config.toml
├── gitlab-runner-general/
│   └── config/
│       └── config.toml
├── register-gitlab-runners.sh
└── manage-gitlab-runners.sh

/etc/systemd/system/
├── gitlab-runner-php.service
├── gitlab-runner-node.service
├── gitlab-runner-python.service
└── gitlab-runner-general.service
```

### Step 2: Get Registration Tokens

**Option A: Instance-wide runners** (Admin only)

1. Go to `https://gitlab.liauw-media.de/admin/runners`
2. Click **"Register an instance runner"**
3. Copy the registration token
4. Use same token for all 4 runners (they'll be available to all projects)

**Option B: Project-specific runners**

1. Go to your project → **Settings → CI/CD → Runners**
2. Expand **"Runners"** section
3. Click **"New project runner"**
4. Copy the registration token
5. Repeat for each runner type (or use same token for all)

**Option C: Group runners**

1. Go to your group → **Settings → CI/CD → Runners**
2. Click **"New group runner"**
3. Copy the registration token

### Step 3: Register Runners

```bash
# Run registration script
sudo /opt/register-gitlab-runners.sh

# It will prompt for tokens:
# Enter registration token for PHP runner: glrt-xxxxxxxxxxxxxxxxxxxxx
# Enter registration token for Node runner: glrt-xxxxxxxxxxxxxxxxxxxxx
# Enter registration token for Python runner: glrt-xxxxxxxxxxxxxxxxxxxxx
# Enter registration token for General runner: glrt-xxxxxxxxxxxxxxxxxxxxx
```

**Tip:** You can use the **same token for all runners** if you want them all available to the same projects.

### Step 4: Verify Installation

```bash
# Check status of all runners
sudo /opt/manage-gitlab-runners.sh status

# Check in GitLab web interface
# Go to: https://gitlab.liauw-media.de/admin/runners
# You should see all 4 runners with green status
```

## 🎮 Managing Runners

Use the management script:

```bash
# Show status of all runners
sudo /opt/manage-gitlab-runners.sh status

# Start all runners
sudo /opt/manage-gitlab-runners.sh start

# Stop all runners
sudo /opt/manage-gitlab-runners.sh stop

# Restart all runners
sudo /opt/manage-gitlab-runners.sh restart

# View logs for specific runner
sudo /opt/manage-gitlab-runners.sh logs php
sudo /opt/manage-gitlab-runners.sh logs node
sudo /opt/manage-gitlab-runners.sh logs python
sudo /opt/manage-gitlab-runners.sh logs general
```

Or use systemctl directly:

```bash
# Individual runner control
sudo systemctl status gitlab-runner-php
sudo systemctl start gitlab-runner-node
sudo systemctl stop gitlab-runner-python
sudo systemctl restart gitlab-runner-general

# View logs
sudo journalctl -u gitlab-runner-php -f
```

## 📝 Using Runners in .gitlab-ci.yml

### Target Specific Runner by Tags

```yaml
# Use PHP runner
build:php:
  tags:
    - php
  script:
    - composer install
    - php artisan test

# Use Node runner
build:node:
  tags:
    - node
  script:
    - npm install
    - npm run build

# Use Python runner
test:python:
  tags:
    - python
  script:
    - pip install -r requirements.txt
    - pytest

# Use general runner
deploy:
  tags:
    - general
  script:
    - ./deploy.sh
```

### Example: Registry Project (PHP)

```yaml
# .gitlab-ci.yml for liauwmedia-registry
stages:
  - build
  - quality
  - test
  - deploy

variables:
  DOCKER_DRIVER: overlay2

build:
  stage: build
  tags:
    - php              # Uses Runner-PHP
    - docker
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t registry:latest .
    - docker save registry:latest -o registry.tar
  artifacts:
    paths:
      - registry.tar

lint:
  stage: quality
  tags:
    - php              # Uses Runner-PHP
  image: php:8.2
  script:
    - composer install
    - ./vendor/bin/pint --test

test:
  stage: test
  tags:
    - php              # Uses Runner-PHP
  image: php:8.2
  script:
    - composer install
    - php artisan test
```

### Example: Next.js Project (Node)

```yaml
# .gitlab-ci.yml for Next.js project
stages:
  - build
  - test
  - deploy

build:
  stage: build
  tags:
    - node             # Uses Runner-Node
    - nextjs
  image: node:20
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .next/
      - out/

test:
  stage: test
  tags:
    - node             # Uses Runner-Node
  image: node:20
  script:
    - npm ci
    - npm run test
    - npm run lint
```

### Example: Python Project

```yaml
# .gitlab-ci.yml for Python project
stages:
  - test
  - deploy

test:
  stage: test
  tags:
    - python           # Uses Runner-Python
  image: python:3.11
  script:
    - pip install -r requirements.txt
    - pytest
    - pylint src/

deploy:
  stage: deploy
  tags:
    - python           # Uses Runner-Python
  image: python:3.11
  script:
    - pip install -r requirements.txt
    - python setup.py install
```

## 🔧 Configuration

### Concurrent Jobs

Edit `/opt/gitlab-runner-{type}/config/config.toml`:

```toml
concurrent = 2  # Change from 1 to allow 2 jobs at once

[session_server]
  session_timeout = 1800
```

Then restart:
```bash
sudo systemctl restart gitlab-runner-php
```

### Docker Volumes

Runners are configured with:
- `/var/run/docker.sock:/var/run/docker.sock` - Access to host Docker
- `/cache` - Build cache for faster builds

### Custom Docker Images

You can override the default image per-job:

```yaml
job:
  tags:
    - php
  image: php:8.3-alpine  # Override default php:8.2
  script:
    - composer install
```

## 🐛 Troubleshooting

### Runner not showing in GitLab

```bash
# Check if runner is running
sudo systemctl status gitlab-runner-php

# Check logs
sudo journalctl -u gitlab-runner-php -n 50

# Verify registration
sudo gitlab-runner verify --config /opt/gitlab-runner-php/config/config.toml
```

### Docker permission errors

```bash
# Ensure gitlab-runner user is in docker group
sudo usermod -aG docker gitlab-runner

# Restart runner
sudo systemctl restart gitlab-runner-php
```

### Jobs stuck in "pending"

**Possible causes:**

1. **No runner with matching tags**
   - Check your .gitlab-ci.yml tags match runner tags
   - View runner tags: `https://gitlab.liauw-media.de/admin/runners`

2. **Runner is paused**
   - Go to GitLab → Admin → Runners
   - Click on runner → Click "Resume"

3. **Concurrent limit reached**
   - Increase `concurrent` in config.toml
   - Restart runner

### Docker-in-Docker issues

If you get "Cannot connect to Docker daemon":

```bash
# Ensure privileged mode is enabled
# In /opt/gitlab-runner-php/config/config.toml:
[[runners]]
  [runners.docker]
    privileged = true
```

### Clean up old jobs

```bash
# Clear cache and old builds
docker system prune -a

# Restart runner
sudo systemctl restart gitlab-runner-php
```

## 🔄 Updating Runners

```bash
# Update GitLab Runner package
sudo apt-get update
sudo apt-get install gitlab-runner

# Restart all runners
sudo /opt/manage-gitlab-runners.sh restart
```

## 🗑️ Unregistering Runners

To remove a specific runner:

```bash
# Unregister from GitLab
sudo gitlab-runner unregister \
  --config /opt/gitlab-runner-php/config/config.toml \
  --name "Runner-PHP"

# Stop and disable service
sudo systemctl stop gitlab-runner-php
sudo systemctl disable gitlab-runner-php

# Remove service file
sudo rm /etc/systemd/system/gitlab-runner-php.service

# Remove directory
sudo rm -rf /opt/gitlab-runner-php

# Reload systemd
sudo systemctl daemon-reload
```

## 📊 Monitoring

### Check Runner Activity

```bash
# View active jobs
sudo gitlab-runner list --config /opt/gitlab-runner-php/config/config.toml

# Monitor logs in real-time
sudo journalctl -u gitlab-runner-php -f
```

### GitLab Web Interface

Go to `https://gitlab.liauw-media.de/admin/runners` to see:
- ✅ Online/Offline status
- 📊 Jobs run count
- 🏷️ Runner tags
- 🔒 Runner assignment (shared, group, project-specific)

## 🎯 Best Practices

1. **Use specific tags** in .gitlab-ci.yml to target correct runner
2. **Set concurrent = 1** for heavy builds to avoid resource issues
3. **Monitor disk space** - Docker builds can consume a lot
4. **Regular cleanup** - Run `docker system prune` weekly
5. **Separate runners** for different environments (dev, staging, prod)
6. **Use caching** to speed up builds

## 📚 Runner Directory Structure

```
/opt/
├── gitlab-runner-php/
│   ├── config/
│   │   └── config.toml          # PHP runner config
│   └── builds/                   # Job workspaces (created automatically)
│
├── gitlab-runner-node/
│   ├── config/
│   │   └── config.toml          # Node runner config
│   └── builds/
│
├── gitlab-runner-python/
│   ├── config/
│   │   └── config.toml          # Python runner config
│   └── builds/
│
├── gitlab-runner-general/
│   ├── config/
│   │   └── config.toml          # General runner config
│   └── builds/
│
├── register-gitlab-runners.sh   # Registration helper
└── manage-gitlab-runners.sh     # Management helper
```

## 🔐 Security Notes

- Runners use Docker privileged mode for DinD (required for building images)
- Each runner is isolated in its own systemd service
- Config files are `chmod 600` (readable only by root)
- Consider using project-specific runners for sensitive projects

## ✅ Quick Reference

```bash
# Setup (one-time)
sudo /tmp/setup-gitlab-runners.sh
sudo /opt/register-gitlab-runners.sh

# Daily operations
sudo /opt/manage-gitlab-runners.sh status
sudo /opt/manage-gitlab-runners.sh logs php

# Per-runner control
sudo systemctl status gitlab-runner-php
sudo systemctl restart gitlab-runner-node

# Verification
sudo gitlab-runner verify --config /opt/gitlab-runner-php/config/config.toml
```

---

**Support:** Check GitLab Runner docs at https://docs.gitlab.com/runner/
