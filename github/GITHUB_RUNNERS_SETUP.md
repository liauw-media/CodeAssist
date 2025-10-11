# GitHub Actions Multi-Runner Setup Guide

Complete guide for setting up multiple self-hosted GitHub Actions runners for different project types.

## 🎯 Overview

This setup creates **4 dedicated GitHub Actions self-hosted runners**:

| Runner | Purpose | Labels | Typical Use |
|--------|---------|--------|-------------|
| **Runner-PHP** | PHP/Laravel/Composer projects | `php`, `laravel`, `composer` | PHP applications, Laravel projects |
| **Runner-Node** | TypeScript/Next.js/npm projects | `node`, `typescript`, `nextjs`, `npm` | Node.js apps, React/Next.js |
| **Runner-Python** | Python/pip projects | `python`, `pip` | Python applications, Django, Flask |
| **Runner-General** | General-purpose tasks | `general`, `shell` | Shell scripts, deployment tasks |

Each runner:
- ✅ Runs as dedicated systemd service
- ✅ Has isolated working directory in `/opt/github-runner-{type}/`
- ✅ Can access Docker for containerized builds
- ✅ Has specific labels for workflow job targeting
- ✅ Auto-restarts on failure

## 📋 Prerequisites

- **Ubuntu/Debian** server
- **Regular user account** (not root!)
- **Docker** installed
- **GitHub repository** with admin access
- **Internet connection** for downloading runner software

## 🚀 Installation

### Step 1: Run Setup Script

```bash
# Make script executable
chmod +x /tmp/setup-github-runners.sh

# Run as regular user (NOT root!)
/tmp/setup-github-runners.sh
```

This creates:
```
/opt/
├── github-runner-php/
│   ├── config.sh
│   ├── run.sh
│   └── _work/            # Job workspaces
├── github-runner-node/
│   ├── config.sh
│   ├── run.sh
│   └── _work/
├── github-runner-python/
│   ├── config.sh
│   ├── run.sh
│   └── _work/
├── github-runner-general/
│   ├── config.sh
│   ├── run.sh
│   └── _work/
├── register-github-runners.sh
└── manage-github-runners.sh

/etc/systemd/system/
├── github-runner-php.service
├── github-runner-node.service
├── github-runner-python.service
└── github-runner-general.service
```

### Step 2: Get Registration Tokens

**Option A: Repository runners** (Most common)

1. Go to your repository: `https://github.com/owner/repo/settings/actions/runners/new`
2. Click **"New self-hosted runner"**
3. Select **Linux** and **x64**
4. Copy the registration token (starts with `AAAA...`)
5. Repeat for each runner (or use same token for all 4)

**Option B: Organization runners**

1. Go to: `https://github.com/organizations/YOUR_ORG/settings/actions/runners/new`
2. Click **"New runner"**
3. Copy the registration token
4. Use same token for all runners (they'll be available to all org repos)

### Step 3: Register Runners

```bash
# Run registration script
sudo /opt/register-github-runners.sh

# It will prompt for:
# Repository URL: https://github.com/owner/repo
# Enter registration token for PHP runner: AAAA...
# Enter registration token for Node runner: AAAA...
# Enter registration token for Python runner: AAAA...
# Enter registration token for General runner: AAAA...
```

**Tip:** You can use the **same token for all 4 runners** if you want them all available to the same repository.

### Step 4: Verify Installation

```bash
# Check status of all runners
sudo /opt/manage-github-runners.sh status

# Check in GitHub web interface
# Go to: https://github.com/owner/repo/settings/actions/runners
# You should see all 4 runners with "Idle" status (green circle)
```

## 🎮 Managing Runners

Use the management script:

```bash
# Show status of all runners
sudo /opt/manage-github-runners.sh status

# Start all runners
sudo /opt/manage-github-runners.sh start

# Stop all runners
sudo /opt/manage-github-runners.sh stop

# Restart all runners
sudo /opt/manage-github-runners.sh restart

# View logs for specific runner
sudo /opt/manage-github-runners.sh logs php
sudo /opt/manage-github-runners.sh logs node
sudo /opt/manage-github-runners.sh logs python
sudo /opt/manage-github-runners.sh logs general
```

Or use systemctl directly:

```bash
# Individual runner control
sudo systemctl status github-runner-php
sudo systemctl start github-runner-node
sudo systemctl stop github-runner-python
sudo systemctl restart github-runner-general

# View logs
sudo journalctl -u github-runner-php -f
```

## 📝 Using Runners in GitHub Actions Workflows

### Target Specific Runner by Labels

```yaml
# Use PHP runner
jobs:
  build-php:
    runs-on: [self-hosted, php]
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: composer install
      - name: Run tests
        run: php artisan test

# Use Node runner
jobs:
  build-node:
    runs-on: [self-hosted, node]
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build

# Use Python runner
jobs:
  test-python:
    runs-on: [self-hosted, python]
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: pytest

# Use general runner
jobs:
  deploy:
    runs-on: [self-hosted, general]
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        run: ./deploy.sh
```

### Example: PHP/Laravel Project

```yaml
# .github/workflows/laravel.yml
name: Laravel CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint:
    runs-on: [self-hosted, php, laravel]
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress

      - name: Run Laravel Pint
        run: ./vendor/bin/pint --test

  test:
    runs-on: [self-hosted, php, laravel]
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_DATABASE: test_db
          MYSQL_ROOT_PASSWORD: password
        ports:
          - 3306:3306

    steps:
      - uses: actions/checkout@v3

      - name: Copy .env
        run: cp .env.example .env

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress

      - name: Generate key
        run: php artisan key:generate

      - name: Run tests
        run: php artisan test

  build-docker:
    runs-on: [self-hosted, php, docker]
    needs: [lint, test]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t myapp:latest .

      - name: Save image
        run: docker save myapp:latest -o myapp.tar

      - uses: actions/upload-artifact@v3
        with:
          name: docker-image
          path: myapp.tar
```

### Example: Next.js Project

```yaml
# .github/workflows/nextjs.yml
name: Next.js CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: [self-hosted, node, nextjs]
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

      - uses: actions/upload-artifact@v3
        with:
          name: nextjs-build
          path: |
            .next/
            out/

  test:
    runs-on: [self-hosted, node]
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run coverage
        run: npm run test:coverage

      - uses: actions/upload-artifact@v3
        with:
          name: coverage
          path: coverage/
```

### Example: Python Project

```yaml
# .github/workflows/python.yml
name: Python CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: [self-hosted, python]
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov

      - name: Lint with flake8
        run: |
          pip install flake8
          flake8 src tests

      - name: Type check with mypy
        run: |
          pip install mypy
          mypy src

      - name: Run tests
        run: pytest --cov=src --cov-report=html

      - uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: htmlcov/
```

## 🔧 Configuration

### Runner Group Access

For organization runners, control which repositories can use them:

1. Go to: `https://github.com/organizations/YOUR_ORG/settings/actions/runner-groups`
2. Create a runner group
3. Add runners to the group
4. Select which repositories can access the group

### Environment Variables

Create a `.env` file in each runner directory:

```bash
# /opt/github-runner-php/.env
PHP_VERSION=8.2
COMPOSER_ALLOW_SUPERUSER=1
```

### Docker Access

Runners are configured with Docker access by default. Test with:

```yaml
jobs:
  test-docker:
    runs-on: [self-hosted, php]
    steps:
      - name: Test Docker access
        run: docker ps
```

## 🐛 Troubleshooting

### Runner not showing in GitHub

```bash
# Check if runner is running
sudo systemctl status github-runner-php

# Check logs
sudo journalctl -u github-runner-php -n 50

# Verify configuration
cat /opt/github-runner-php/.runner
```

### Runner showing "Offline"

**Possible causes:**

1. **Service stopped**
   ```bash
   sudo systemctl start github-runner-php
   ```

2. **Network connectivity**
   ```bash
   ping github.com
   ```

3. **Runner token expired**
   - Tokens expire after 1 hour if not used
   - Get a new token and re-register

### Jobs stuck in "Queued"

**Possible causes:**

1. **No runner with matching labels**
   - Check your workflow uses correct labels
   - View runner labels: Repository → Settings → Actions → Runners

2. **All runners busy**
   - Wait for current jobs to complete
   - Or add more runners

3. **Runner offline**
   - Check runner status in GitHub web interface
   - Restart runner: `sudo systemctl restart github-runner-php`

### Docker permission errors

```bash
# Ensure user is in docker group
sudo usermod -aG docker $USER

# Log out and log back in

# Restart runner
sudo systemctl restart github-runner-php
```

### Disk space issues

```bash
# Clean up Docker
docker system prune -a

# Clear old workflow runs
rm -rf /opt/github-runner-php/_work/_temp
```

## 🔄 Updating Runners

```bash
# Stop all runners
sudo /opt/manage-github-runners.sh stop

# Download new version
cd /opt/github-runner-php
wget https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf actions-runner-linux-x64-2.311.0.tar.gz

# Repeat for each runner type

# Start all runners
sudo /opt/manage-github-runners.sh start
```

## 🗑️ Removing Runners

To remove a specific runner:

```bash
# Stop service
sudo systemctl stop github-runner-php
sudo systemctl disable github-runner-php

# Remove from GitHub
cd /opt/github-runner-php
./config.sh remove --token YOUR_REMOVAL_TOKEN

# Remove service file
sudo rm /etc/systemd/system/github-runner-php.service

# Remove directory
sudo rm -rf /opt/github-runner-php

# Reload systemd
sudo systemctl daemon-reload
```

## 📊 Monitoring

### Check Runner Activity

```bash
# View runner logs
sudo journalctl -u github-runner-php -f

# Check runner status
sudo systemctl status github-runner-php

# Monitor all runners
watch 'systemctl status github-runner-* --no-pager'
```

### GitHub Web Interface

Go to `https://github.com/owner/repo/settings/actions/runners` to see:
- ✅ Online/Offline status
- 📊 Jobs run count
- 🏷️ Runner labels
- 🔒 Runner scope (repo, org)
- 📝 Recent job history

## 🎯 Best Practices

1. **Use specific labels** to target correct runner
2. **Monitor disk space** - GitHub Actions can consume a lot
3. **Regular cleanup** - Run `docker system prune` weekly
4. **Separate runners** for different environments (dev, staging, prod)
5. **Use runner groups** for access control (organizations)
6. **Keep runners updated** to latest version
7. **Set up monitoring** for runner availability

## 🔐 Security Notes

- Runners run as regular user (not root)
- Each runner is isolated in its own systemd service
- Use runner groups to control repository access
- **Never use self-hosted runners for public repositories** (security risk)
- Consider using runner groups for sensitive projects
- Regularly audit runner logs for suspicious activity

## ✅ Quick Reference

```bash
# Setup (one-time)
./setup-github-runners.sh
sudo /opt/register-github-runners.sh

# Daily operations
sudo /opt/manage-github-runners.sh status
sudo /opt/manage-github-runners.sh logs php

# Per-runner control
sudo systemctl status github-runner-php
sudo systemctl restart github-runner-node

# Logs
sudo journalctl -u github-runner-php -f
```

## 📚 Comparison with GitLab Runners

| Feature | GitHub Actions | GitLab CI |
|---------|----------------|-----------|
| **Executor** | Direct execution | Docker executor |
| **Labels/Tags** | Labels in `runs-on` | Tags in `.gitlab-ci.yml` |
| **Configuration** | Per-runner directory | `config.toml` |
| **Service** | systemd service | systemd service |
| **Management** | GitHub web UI | GitLab web UI |
| **Access Control** | Runner groups | Instance/Group/Project runners |

---

**Support:** Check GitHub Actions docs at https://docs.github.com/en/actions/hosting-your-own-runners
