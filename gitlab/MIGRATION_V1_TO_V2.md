# GitLab Runners Migration Guide: v1 → v2

*How to migrate from 4 language-specific runners to 2 efficient runners*

---

## 📋 Overview

### What Changed

**v1 Architecture** (OLD):
```
Runner-PHP      → Docker executor, default: php:8.2, tags: php, laravel
Runner-Node     → Docker executor, default: node:20, tags: node, nextjs
Runner-Python   → Docker executor, default: python:3.11, tags: python
Runner-General  → Docker executor, default: alpine:latest, tags: general
```

**v2 Architecture** (NEW):
```
Runner-Docker   → Docker executor, default: alpine:latest, tags: docker, build, test, linux
                  → Handles ALL container-based jobs (concurrent=5)
Runner-Deploy   → Shell executor, tags: deploy, shell, production
                  → Handles deployments and direct server access (concurrent=1)
```

### Why Migrate?

✅ **Simpler management** - 2 services instead of 4
✅ **More flexible** - Any language/framework via image specification
✅ **Better resource usage** - 5 concurrent jobs vs 4
✅ **Real separation** - Docker builds vs Shell deployments
✅ **Easier troubleshooting** - Fewer moving parts

---

## 🚀 Migration Path

### Option 1: Clean Migration (Recommended)

**Best for**: When you can pause CI/CD briefly

1. Stop and unregister old runners
2. Install new runners
3. Update all `.gitlab-ci.yml` files
4. Test and deploy

**Downtime**: ~15-30 minutes

### Option 2: Parallel Migration

**Best for**: Production systems that can't pause

1. Install new runners alongside old ones
2. Update `.gitlab-ci.yml` files gradually
3. Monitor new runners
4. Remove old runners when no longer used

**Downtime**: 0 minutes

---

## 📝 Step-by-Step: Clean Migration

### Step 1: Backup Current Configuration

```bash
# Backup old runner configs
sudo cp -r /opt/gitlab-runner-php /tmp/backup-runner-php
sudo cp -r /opt/gitlab-runner-node /tmp/backup-runner-node
sudo cp -r /opt/gitlab-runner-python /tmp/backup-runner-python
sudo cp -r /opt/gitlab-runner-general /tmp/backup-runner-general

# List registered runners (save this output)
sudo gitlab-runner list --config /opt/gitlab-runner-php/config/config.toml > /tmp/runner-php-info.txt
sudo gitlab-runner list --config /opt/gitlab-runner-node/config/config.toml > /tmp/runner-node-info.txt
sudo gitlab-runner list --config /opt/gitlab-runner-python/config/config.toml > /tmp/runner-python-info.txt
sudo gitlab-runner list --config /opt/gitlab-runner-general/config/config.toml > /tmp/runner-general-info.txt
```

### Step 2: Stop and Unregister Old Runners

```bash
# Stop all old runners
sudo systemctl stop gitlab-runner-php
sudo systemctl stop gitlab-runner-node
sudo systemctl stop gitlab-runner-python
sudo systemctl stop gitlab-runner-general

# Unregister from GitLab
sudo gitlab-runner unregister --config /opt/gitlab-runner-php/config/config.toml --all-runners
sudo gitlab-runner unregister --config /opt/gitlab-runner-node/config/config.toml --all-runners
sudo gitlab-runner unregister --config /opt/gitlab-runner-python/config/config.toml --all-runners
sudo gitlab-runner unregister --config /opt/gitlab-runner-general/config/config.toml --all-runners

# Disable systemd services
sudo systemctl disable gitlab-runner-php
sudo systemctl disable gitlab-runner-node
sudo systemctl disable gitlab-runner-python
sudo systemctl disable gitlab-runner-general

# Remove service files
sudo rm /etc/systemd/system/gitlab-runner-php.service
sudo rm /etc/systemd/system/gitlab-runner-node.service
sudo rm /etc/systemd/system/gitlab-runner-python.service
sudo rm /etc/systemd/system/gitlab-runner-general.service

# Reload systemd
sudo systemctl daemon-reload
```

### Step 3: Remove Old Runner Directories (Optional)

```bash
# Only do this if you're SURE backups are good
sudo rm -rf /opt/gitlab-runner-php
sudo rm -rf /opt/gitlab-runner-node
sudo rm -rf /opt/gitlab-runner-python
sudo rm -rf /opt/gitlab-runner-general
```

### Step 4: Install New v2 Runners

```bash
# Download v2 setup script
wget https://raw.githubusercontent.com/your-repo/setup-gitlab-runners-v2.sh

# Make executable
chmod +x setup-gitlab-runners-v2.sh

# Run setup
sudo ./setup-gitlab-runners-v2.sh

# Register runners
sudo /opt/register-gitlab-runners.sh
# Use your GitLab URL and registration token

# Start runners
sudo /opt/manage-gitlab-runners.sh start

# Verify
sudo /opt/manage-gitlab-runners.sh status
```

### Step 5: Update All `.gitlab-ci.yml` Files

See [Tag Migration Reference](#tag-migration-reference) below.

### Step 6: Verify in GitLab

1. Go to `https://your-gitlab.com/admin/runners`
2. Verify new runners show as "online" (green)
3. Verify old runners are gone
4. Run a test pipeline

---

## 📝 Step-by-Step: Parallel Migration

### Step 1: Install New Runners Alongside Old

```bash
# Install v2 runners (doesn't conflict with v1)
wget https://raw.githubusercontent.com/your-repo/setup-gitlab-runners-v2.sh
chmod +x setup-gitlab-runners-v2.sh
sudo ./setup-gitlab-runners-v2.sh

# Register new runners
sudo /opt/register-gitlab-runners.sh

# Start new runners
sudo /opt/manage-gitlab-runners.sh start
```

**Both v1 and v2 runners are now active!**

### Step 2: Update One Project at a Time

```bash
# Update one project's .gitlab-ci.yml
# Change tags from: php → docker
# Change tags from: node → docker
# Change tags from: deploy → deploy (stays same)

# Commit and test
git add .gitlab-ci.yml
git commit -m "ci: migrate to v2 runners"
git push
```

### Step 3: Monitor New Runners

```bash
# Watch new runner logs
sudo /opt/manage-gitlab-runners.sh logs docker

# Check GitLab runner page
# Verify jobs are running on new runners
```

### Step 4: Update All Projects Gradually

Update each project's `.gitlab-ci.yml` over days/weeks.

### Step 5: Remove Old Runners

Once all projects migrated and tested:

```bash
# Stop old runners
sudo systemctl stop gitlab-runner-php gitlab-runner-node gitlab-runner-python gitlab-runner-general

# Monitor for 1-2 days to ensure no issues

# If all good, unregister and remove (see Step 2-3 from Clean Migration)
```

---

## 🏷️ Tag Migration Reference

### Quick Reference Table

| Old Tag | New Tag | Runner | Notes |
|---------|---------|--------|-------|
| `php` | `docker` | Runner-Docker | Specify `image: php:8.2` in job |
| `laravel` | `docker` | Runner-Docker | Specify `image: php:8.2` in job |
| `composer` | `docker` | Runner-Docker | Specify `image: composer:latest` or `php:8.2` |
| `node` | `docker` | Runner-Docker | Specify `image: node:20` in job |
| `nextjs` | `docker` | Runner-Docker | Specify `image: node:20` in job |
| `npm` | `docker` | Runner-Docker | Specify `image: node:20` in job |
| `typescript` | `docker` | Runner-Docker | Specify `image: node:20` in job |
| `python` | `docker` | Runner-Docker | Specify `image: python:3.11` in job |
| `pip` | `docker` | Runner-Docker | Specify `image: python:3.11` in job |
| `general` | `docker` | Runner-Docker | Already uses `alpine:latest` |
| `shell` | `deploy` | Runner-Deploy | No change needed |

### Before & After Examples

#### Example 1: PHP/Laravel Project

**Before (v1)**:
```yaml
stages:
  - build
  - test

build:
  tags:
    - php      # Old tag
  script:
    - composer install

test:
  tags:
    - php      # Old tag
  script:
    - php artisan test
```

**After (v2)**:
```yaml
stages:
  - build
  - test

build:
  tags:
    - docker   # New tag
  image: php:8.2    # Explicitly specify image
  script:
    - composer install

test:
  tags:
    - docker   # New tag
  image: php:8.2    # Explicitly specify image
  script:
    - php artisan test
```

#### Example 2: Node.js Project

**Before (v1)**:
```yaml
stages:
  - build
  - test

build:
  tags:
    - node     # Old tag
  script:
    - npm ci
    - npm run build

test:
  tags:
    - node     # Old tag
  script:
    - npm test
```

**After (v2)**:
```yaml
stages:
  - build
  - test

build:
  tags:
    - docker   # New tag
  image: node:20    # Explicitly specify image
  script:
    - npm ci
    - npm run build

test:
  tags:
    - docker   # New tag
  image: node:20    # Explicitly specify image
  script:
    - npm test
```

#### Example 3: Python Project

**Before (v1)**:
```yaml
stages:
  - test

test:
  tags:
    - python   # Old tag
  script:
    - pip install -r requirements.txt
    - pytest
```

**After (v2)**:
```yaml
stages:
  - test

test:
  tags:
    - docker   # New tag
  image: python:3.11    # Explicitly specify image
  script:
    - pip install -r requirements.txt
    - pytest
```

#### Example 4: Docker Image Build

**Before (v1)**:
```yaml
build:image:
  tags:
    - general  # Old tag (or php/node/python - all worked)
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t myapp .
```

**After (v2)**:
```yaml
build:image:
  tags:
    - docker   # New tag
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t myapp .
```

#### Example 5: Mixed Project (PHP + Node + Deploy)

**Before (v1)**:
```yaml
stages:
  - build
  - test
  - deploy

build:backend:
  tags:
    - php      # Old tag
  script:
    - cd backend && composer install

build:frontend:
  tags:
    - node     # Old tag
  script:
    - cd frontend && npm ci && npm run build

test:backend:
  tags:
    - php      # Old tag
  script:
    - cd backend && php artisan test

deploy:production:
  tags:
    - general  # Old tag (or shell)
  script:
    - ./deploy.sh
```

**After (v2)**:
```yaml
stages:
  - build
  - test
  - deploy

build:backend:
  tags:
    - docker   # New tag
  image: php:8.2    # Explicitly specify
  script:
    - cd backend && composer install

build:frontend:
  tags:
    - docker   # New tag
  image: node:20    # Explicitly specify
  script:
    - cd frontend && npm ci && npm run build

test:backend:
  tags:
    - docker   # New tag
  image: php:8.2    # Explicitly specify
  script:
    - cd backend && php artisan test

deploy:production:
  tags:
    - deploy   # Use deploy tag for shell runner
  script:
    - ./deploy.sh
```

---

## 🔄 Automated Tag Migration Script

Use this script to bulk-update `.gitlab-ci.yml` files:

```bash
#!/bin/bash
# migrate-gitlab-ci-tags.sh
# Automatically updates tags in .gitlab-ci.yml files

for file in $(find . -name ".gitlab-ci.yml"); do
    echo "Processing: $file"

    # Create backup
    cp "$file" "${file}.backup"

    # Replace old tags with docker
    sed -i 's/    - php$/    - docker/' "$file"
    sed -i 's/    - node$/    - docker/' "$file"
    sed -i 's/    - python$/    - docker/' "$file"
    sed -i 's/    - general$/    - docker/' "$file"
    sed -i 's/    - laravel$/    - docker/' "$file"
    sed -i 's/    - nextjs$/    - docker/' "$file"

    # Add image specification where missing
    # (This is a simplified version - review manually!)

    echo "✅ Updated: $file"
    echo "⚠️  REVIEW MANUALLY to add 'image:' specifications!"
done

echo ""
echo "Migration complete!"
echo "⚠️  IMPORTANT: Review all changes and add 'image:' specifications!"
echo "Backups saved as .gitlab-ci.yml.backup"
```

**Usage**:
```bash
chmod +x migrate-gitlab-ci-tags.sh
./migrate-gitlab-ci-tags.sh
```

**⚠️ WARNING**: This script is a starting point. **Always review changes manually** and add `image:` specifications!

---

## ✅ Post-Migration Checklist

### Verify Runners

- [ ] Old runners removed from GitLab web interface
- [ ] New runners show as "online" (green dot)
- [ ] Runner-Docker shows: concurrent=5, tags: docker, build, test, linux
- [ ] Runner-Deploy shows: concurrent=1, tags: deploy, shell, production

### Test Each Project Type

- [ ] PHP/Laravel project builds and tests successfully
- [ ] Node.js/Next.js project builds and tests successfully
- [ ] Python project runs tests successfully
- [ ] Docker image builds successfully
- [ ] Deployments work correctly

### Monitor Performance

```bash
# Check runner logs for errors
sudo /opt/manage-gitlab-runners.sh logs docker

# Monitor resource usage
htop
docker stats

# Check GitLab job queue
# Verify jobs aren't stuck in "pending"
```

### Update Documentation

- [ ] Update team wiki/docs with new runner tags
- [ ] Update CI/CD templates with new format
- [ ] Notify team about migration
- [ ] Update onboarding docs for new developers

---

## 🐛 Troubleshooting Migration Issues

### Issue: Jobs Stuck in "Pending"

**Cause**: Tags don't match or runner offline

**Solution**:
```bash
# 1. Check runner status
sudo /opt/manage-gitlab-runners.sh status

# 2. Verify tags in GitLab
# Go to: Admin → Runners → View runner details

# 3. Check .gitlab-ci.yml tags match
# Should be: docker or deploy
```

### Issue: "Image not found" errors

**Cause**: Missing `image:` specification in `.gitlab-ci.yml`

**Solution**:
Add explicit image specification:
```yaml
job:
  tags:
    - docker
  image: php:8.2  # ← Add this!
  script:
    - composer install
```

### Issue: Docker build fails with permission errors

**Cause**: gitlab-runner user not in docker group

**Solution**:
```bash
sudo usermod -aG docker gitlab-runner
sudo systemctl restart gitlab-runner-docker
```

### Issue: Deploy jobs fail with "command not found"

**Cause**: Shell executor missing tools

**Solution**:
```bash
# Install missing tools on runner server
# (Not in Docker container - this is shell executor!)
sudo apt-get install <missing-package>

# Or specify in job:
deploy:
  tags:
    - deploy
  before_script:
    - which rsync || apt-get install -y rsync
  script:
    - ./deploy.sh
```

---

## 📚 Additional Resources

- [v2 Setup Guide](GITLAB_RUNNERS_SETUP_V2.md)
- [Tag Migration Reference](#tag-migration-reference)
- [GitLab Runner Docs](https://docs.gitlab.com/runner/)
- [Docker Executor Docs](https://docs.gitlab.com/runner/executors/docker.html)

---

## 🆘 Rollback Plan

If migration fails, you can rollback:

### Quick Rollback

```bash
# Stop new runners
sudo systemctl stop gitlab-runner-docker gitlab-runner-deploy

# Restore old configs
sudo cp -r /tmp/backup-runner-php /opt/gitlab-runner-php
sudo cp -r /tmp/backup-runner-node /opt/gitlab-runner-node
sudo cp -r /tmp/backup-runner-python /opt/gitlab-runner-python
sudo cp -r /tmp/backup-runner-general /opt/gitlab-runner-general

# Restore systemd services
# (You'll need to recreate service files or restore from backup)

# Start old runners
sudo systemctl start gitlab-runner-php
sudo systemctl start gitlab-runner-node
sudo systemctl start gitlab-runner-python
sudo systemctl start gitlab-runner-general

# Re-register if needed
sudo gitlab-runner register --config /opt/gitlab-runner-php/config/config.toml
# ... repeat for each runner
```

---

**Need help?** Check logs with:
```bash
sudo /opt/manage-gitlab-runners.sh logs docker
sudo journalctl -u gitlab-runner-docker -n 100
```

*Migration guide v2.0 - Last updated: 2025-01-11* 🚀
