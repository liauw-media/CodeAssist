# GitLab Runner Setup Guide v2.0

*Efficient runner architecture with proper separation of concerns*

---

## 🎯 Overview

This v2 setup creates **2 efficient runners** instead of 4 redundant ones:

| Runner | Purpose | Executor | Tags | Concurrent | Use Cases |
|--------|---------|----------|------|------------|-----------|
| **Runner-Docker** | Multi-purpose builds & tests | `docker` | `docker`, `build`, `test`, `linux` | 5 | Building images, running tests, linting, CI jobs |
| **Runner-Deploy** | Production deployments | `shell` | `deploy`, `shell`, `production` | 1 | Deployments, server provisioning, shell tasks |

### **Why This is Better**

**❌ Old Design (4 runners)**:
- Separate runners for PHP, Node, Python, General
- All use Docker executor → no real isolation
- "Specialization" was just different default images
- Resources wasted on multiple systemd services
- Complex management

**✅ New Design (2 runners)**:
- One Docker runner handles ALL container-based jobs
- Specify image in `.gitlab-ci.yml` (more flexible)
- Separate deploy runner for production access
- Real separation: Docker vs Shell executor
- Simpler to manage and monitor

---

## 📋 Prerequisites

- **Ubuntu/Debian** server
- **Root access** (sudo)
- **Docker** installed and running
- **GitLab instance** URL (e.g., `https://gitlab.liauw-media.de`)
- **Registration tokens** from GitLab

---

## 🚀 Installation

### Step 1: Download and Run Setup Script

```bash
# Download the setup script
wget https://raw.githubusercontent.com/your-repo/setup-gitlab-runners-v2.sh

# Make executable
chmod +x setup-gitlab-runners-v2.sh

# Run as root
sudo ./setup-gitlab-runners-v2.sh
```

This creates:
```
/opt/
├── gitlab-runner-docker/
│   └── config/
│       └── config.toml          # Docker runner (concurrent=5)
├── gitlab-runner-deploy/
│   └── config/
│       └── config.toml          # Deploy runner (concurrent=1)
├── register-gitlab-runners.sh   # Registration helper
└── manage-gitlab-runners.sh     # Management commands

/etc/systemd/system/
├── gitlab-runner-docker.service
└── gitlab-runner-deploy.service
```

### Step 2: Get Registration Tokens

**Option A: Instance-wide runners** (Admin only - Recommended)

1. Go to `https://your-gitlab.com/admin/runners`
2. Click **"Register an instance runner"**
3. Copy the registration token
4. Use same token for both runners (they'll be available to all projects)

**Option B: Group runners**

1. Go to your group → **Settings → CI/CD → Runners**
2. Click **"New group runner"**
3. Copy the registration token

**Option C: Project-specific runners**

1. Go to project → **Settings → CI/CD → Runners**
2. Click **"New project runner"**
3. Copy the registration token

### Step 3: Register Runners

```bash
# Run registration script (interactive)
sudo /opt/register-gitlab-runners.sh

# You'll be prompted for:
# 1. GitLab instance URL: https://your-gitlab.com
# 2. Token for Runner-Docker: glrt-xxxxxxxxxxxxxxxxxxxxx
# 3. Token for Runner-Deploy: [press Enter to use same token]
```

**Registration Details:**

**Runner-Docker** registers with:
- **Executor**: docker
- **Default image**: alpine:latest
- **Tags**: docker, build, test, linux
- **Privileged**: true (for Docker-in-Docker)
- **Volumes**: `/var/run/docker.sock`, `/cache`
- **Concurrent**: 5 jobs

**Runner-Deploy** registers with:
- **Executor**: shell
- **Tags**: deploy, shell, production
- **Concurrent**: 1 job (safe for deployments)

### Step 4: Start Runners

```bash
# Start all runners
sudo /opt/manage-gitlab-runners.sh start

# Check status
sudo /opt/manage-gitlab-runners.sh status
```

### Step 5: Verify in GitLab

Go to `https://your-gitlab.com/admin/runners` to see:
- ✅ **Runner-Docker** (online, green dot)
- ✅ **Runner-Deploy** (online, green dot)

---

## 🎮 Managing Runners

### Using the Management Script

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
sudo /opt/manage-gitlab-runners.sh logs docker
sudo /opt/manage-gitlab-runners.sh logs deploy
```

### Using systemctl Directly

```bash
# Individual runner control
sudo systemctl status gitlab-runner-docker
sudo systemctl start gitlab-runner-deploy
sudo systemctl restart gitlab-runner-docker

# View logs
sudo journalctl -u gitlab-runner-docker -f
sudo journalctl -u gitlab-runner-deploy -n 100
```

---

## 📝 Using Runners in .gitlab-ci.yml

### Example: PHP Laravel Project

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

variables:
  DOCKER_DRIVER: overlay2

# Build stage - uses Docker runner
build:
  stage: build
  tags:
    - docker      # Uses Runner-Docker
  image: php:8.2
  script:
    - composer install --no-dev --optimize-autoloader
  artifacts:
    paths:
      - vendor/

# Test stage - uses Docker runner
test:unit:
  stage: test
  tags:
    - docker      # Uses Runner-Docker
  image: php:8.2
  script:
    - composer install
    - php artisan test
  coverage: '/^\s*Lines:\s*\d+\.\d+\%/'

# Linting - uses Docker runner
lint:
  stage: test
  tags:
    - docker      # Uses Runner-Docker
  image: php:8.2
  script:
    - composer install
    - ./vendor/bin/pint --test

# Deploy - uses Deploy runner
deploy:production:
  stage: deploy
  tags:
    - deploy      # Uses Runner-Deploy (shell executor)
  script:
    - ssh user@production-server "cd /var/www && git pull"
    - ssh user@production-server "cd /var/www && composer install --no-dev"
    - ssh user@production-server "cd /var/www && php artisan migrate --force"
  only:
    - main
  when: manual
```

### Example: Node.js/Next.js Project

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

# Build - uses Docker runner
build:
  stage: build
  tags:
    - docker      # Uses Runner-Docker
  image: node:20
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .next/
      - node_modules/

# Test - uses Docker runner
test:
  stage: test
  tags:
    - docker      # Uses Runner-Docker
  image: node:20
  script:
    - npm ci
    - npm run test
    - npm run lint

# Deploy - uses Deploy runner
deploy:production:
  stage: deploy
  tags:
    - deploy      # Uses Runner-Deploy
  script:
    - cd /var/www/nextjs-app
    - git pull origin main
    - npm ci
    - npm run build
    - pm2 restart nextjs-app
  only:
    - main
```

### Example: Docker Image Build

```yaml
# .gitlab-ci.yml for building Docker images
stages:
  - build
  - push

# Build Docker image - uses Docker runner with DinD
build:image:
  stage: build
  tags:
    - docker      # Uses Runner-Docker
  image: docker:latest
  services:
    - docker:dind    # Docker-in-Docker service
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  script:
    - docker build -t myapp:$CI_COMMIT_SHORT_SHA .
    - docker save myapp:$CI_COMMIT_SHORT_SHA -o myapp.tar
  artifacts:
    paths:
      - myapp.tar

# Push to registry - uses Docker runner
push:registry:
  stage: push
  tags:
    - docker      # Uses Runner-Docker
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker load -i myapp.tar
    - docker tag myapp:$CI_COMMIT_SHORT_SHA registry.liauw-media.de/myapp:latest
    - docker push registry.liauw-media.de/myapp:latest
  only:
    - main
```

### Example: Python Project

```yaml
# .gitlab-ci.yml
stages:
  - test
  - deploy

# Test - uses Docker runner
test:
  stage: test
  tags:
    - docker      # Uses Runner-Docker
  image: python:3.11
  script:
    - pip install -r requirements.txt
    - pytest --cov
    - pylint src/

# Deploy - uses Deploy runner
deploy:production:
  stage: deploy
  tags:
    - deploy      # Uses Runner-Deploy
  script:
    - cd /opt/myapp
    - git pull
    - source venv/bin/activate
    - pip install -r requirements.txt
    - systemctl restart myapp
  only:
    - main
```

### Example: Multi-Language Monorepo

```yaml
# .gitlab-ci.yml for monorepo with multiple languages
stages:
  - build
  - test
  - deploy

# PHP backend
build:backend:
  stage: build
  tags:
    - docker      # Uses Runner-Docker
  image: php:8.2
  script:
    - cd backend
    - composer install

# Node.js frontend
build:frontend:
  stage: build
  tags:
    - docker      # Uses Runner-Docker
  image: node:20
  script:
    - cd frontend
    - npm ci
    - npm run build

# Python microservice
build:microservice:
  stage: build
  tags:
    - docker      # Uses Runner-Docker
  image: python:3.11
  script:
    - cd microservice
    - pip install -r requirements.txt

# Deploy all
deploy:production:
  stage: deploy
  tags:
    - deploy      # Uses Runner-Deploy
  script:
    - ./scripts/deploy-all.sh
  only:
    - main
```

---

## 🔧 Configuration

### Adjust Concurrent Jobs

**For Runner-Docker** (if you have more CPU/RAM):

Edit `/opt/gitlab-runner-docker/config/config.toml`:
```toml
concurrent = 10  # Increase from 5 to 10 jobs

[session_server]
  session_timeout = 1800

[[runners]]
  name = "Runner-Docker"
  # ... rest of config
```

Then restart:
```bash
sudo systemctl restart gitlab-runner-docker
```

### Enable Additional Docker Volumes

Edit `/opt/gitlab-runner-docker/config/config.toml`:
```toml
[[runners]]
  [runners.docker]
    volumes = [
      "/var/run/docker.sock:/var/run/docker.sock",
      "/cache",
      "/builds:/builds",           # Add persistent build cache
      "/home/data:/data:ro"        # Mount read-only data
    ]
```

### Configure Deploy Runner Environment

Edit `/opt/gitlab-runner-deploy/config/config.toml` to set environment variables:
```toml
[[runners]]
  [runners.shell]
    environment = [
      "PATH=/usr/local/bin:/usr/bin:/bin",
      "DEPLOY_ENV=production"
    ]
```

---

## 🐛 Troubleshooting

### Runner Not Showing in GitLab

```bash
# Check if runner is running
sudo systemctl status gitlab-runner-docker

# Check logs
sudo journalctl -u gitlab-runner-docker -n 50

# Verify registration
sudo gitlab-runner verify --config /opt/gitlab-runner-docker/config/config.toml
```

### Docker Permission Errors

```bash
# Ensure gitlab-runner user is in docker group
sudo usermod -aG docker gitlab-runner

# Log out gitlab-runner user sessions
sudo pkill -u gitlab-runner

# Restart runner
sudo systemctl restart gitlab-runner-docker
```

### Jobs Stuck in "Pending"

**Possible causes:**

1. **No runner with matching tags**
   ```bash
   # Check your .gitlab-ci.yml tags match runner tags
   # Runner-Docker tags: docker, build, test, linux
   # Runner-Deploy tags: deploy, shell, production
   ```

2. **Runner is paused**
   - Go to GitLab → Admin → Runners
   - Click on runner → Click "Resume"

3. **Concurrent limit reached**
   - Runner-Docker: 5 concurrent jobs max
   - Runner-Deploy: 1 concurrent job max
   - Increase `concurrent` in config.toml

### Docker-in-Docker (DinD) Issues

If you get "Cannot connect to Docker daemon":

```bash
# 1. Ensure privileged mode is enabled
grep "privileged" /opt/gitlab-runner-docker/config/config.toml
# Should show: privileged = true

# 2. Check Docker socket is mounted
grep "docker.sock" /opt/gitlab-runner-docker/config/config.toml

# 3. Restart runner
sudo systemctl restart gitlab-runner-docker
```

### Deploy Runner Cannot Access Server

```bash
# 1. Ensure SSH keys are set up
sudo -u gitlab-runner ssh-keygen -t ed25519

# 2. Copy public key to deployment server
sudo cat /home/gitlab-runner/.ssh/id_ed25519.pub
# Add to ~/.ssh/authorized_keys on deployment server

# 3. Test SSH connection
sudo -u gitlab-runner ssh user@deployment-server
```

### Clean Up Disk Space

```bash
# Remove old Docker images and containers
docker system prune -a --volumes

# Check disk usage
df -h

# Clear GitLab Runner cache
sudo rm -rf /opt/gitlab-runner-docker/cache/*
sudo rm -rf /opt/gitlab-runner-deploy/cache/*
```

---

## 🔄 Updating Runners

```bash
# Update GitLab Runner package
sudo apt-get update
sudo apt-get install gitlab-runner

# Restart all runners
sudo /opt/manage-gitlab-runners.sh restart

# Verify version
gitlab-runner --version
```

---

## 🗑️ Unregistering Runners

### Remove Runner-Docker

```bash
# Unregister from GitLab
sudo gitlab-runner unregister \
  --config /opt/gitlab-runner-docker/config/config.toml \
  --name "Runner-Docker"

# Stop and disable service
sudo systemctl stop gitlab-runner-docker
sudo systemctl disable gitlab-runner-docker

# Remove service file
sudo rm /etc/systemd/system/gitlab-runner-docker.service

# Remove directory
sudo rm -rf /opt/gitlab-runner-docker

# Reload systemd
sudo systemctl daemon-reload
```

### Remove Runner-Deploy

```bash
# Unregister from GitLab
sudo gitlab-runner unregister \
  --config /opt/gitlab-runner-deploy/config/config.toml \
  --name "Runner-Deploy"

# Stop and disable service
sudo systemctl stop gitlab-runner-deploy
sudo systemctl disable gitlab-runner-deploy

# Remove service file
sudo rm /etc/systemd/system/gitlab-runner-deploy.service

# Remove directory
sudo rm -rf /opt/gitlab-runner-deploy

# Reload systemd
sudo systemctl daemon-reload
```

---

## 📊 Monitoring

### Check Runner Activity

```bash
# View active jobs on Docker runner
sudo gitlab-runner list --config /opt/gitlab-runner-docker/config/config.toml

# Monitor logs in real-time
sudo journalctl -u gitlab-runner-docker -f

# Check resource usage
htop
docker stats
```

### GitLab Web Interface

Go to `https://your-gitlab.com/admin/runners` to see:
- ✅ **Online/Offline** status
- 📊 **Jobs run** count
- 🏷️ **Runner tags**
- ⚙️ **Configuration** details
- 📈 **Activity** timeline

---

## 🔒 Private Container Registry Authentication

### GitLab Container Registry (Automatic)

GitLab automatically provides CI/CD variables for authenticating with the GitLab Container Registry. **No manual configuration needed!**

**Available Variables:**
- `$CI_REGISTRY` - Registry URL (e.g., `registry.gitlab.com`)
- `$CI_REGISTRY_USER` - Username (`gitlab-ci-token`)
- `$CI_REGISTRY_PASSWORD` - Authentication token
- `$CI_REGISTRY_IMAGE` - Full image path for your project

### Using GitLab Registry in Pipelines

#### Example 1: Building and Pushing Images

```yaml
build:image:
  stage: build
  tags:
    - docker
  image: docker:latest
  services:
    - docker:dind
  before_script:
    # Automatic authentication with GitLab registry
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" "$CI_REGISTRY" --password-stdin
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest
```

#### Example 2: Pulling Private Images

```yaml
test:
  stage: test
  tags:
    - docker
  # Pull from your private GitLab registry
  image: registry.gitlab.com/your-group/your-project/base-image:latest
  # Authentication is automatic - no before_script needed!
  script:
    - npm test
    - npm run lint
```

#### Example 3: Multi-stage with Private Base Images

```yaml
stages:
  - build
  - test
  - push

variables:
  # Use your private image as base
  BASE_IMAGE: $CI_REGISTRY_IMAGE/base:latest

build:app:
  stage: build
  tags:
    - docker
  image: $BASE_IMAGE
  script:
    - composer install
    - npm run build
  artifacts:
    paths:
      - vendor/
      - public/build/

test:app:
  stage: test
  tags:
    - docker
  image: $BASE_IMAGE
  script:
    - composer test
    - npm test

push:image:
  stage: push
  tags:
    - docker
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" "$CI_REGISTRY" --password-stdin
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_TAG .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_TAG
  only:
    - tags
```

### Additional Private Registry (DockerHub, AWS ECR, etc.)

If you need to authenticate with **non-GitLab registries**, you have two options:

#### Option 1: Using CI/CD Variables (Recommended)

1. **Add credentials as GitLab CI/CD variables:**
   - Go to: Project → Settings → CI/CD → Variables
   - Add variables:
     - `DOCKER_REGISTRY_URL` (e.g., `docker.io`, `123456789.dkr.ecr.us-east-1.amazonaws.com`)
     - `DOCKER_REGISTRY_USER`
     - `DOCKER_REGISTRY_PASSWORD` (mark as "Masked" and "Protected")

2. **Use in pipeline:**

```yaml
build:
  stage: build
  tags:
    - docker
  image: docker:latest
  services:
    - docker:dind
  before_script:
    # Login to GitLab registry
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" "$CI_REGISTRY" --password-stdin
    # Login to additional registry
    - echo "$DOCKER_REGISTRY_PASSWORD" | docker login -u "$DOCKER_REGISTRY_USER" "$DOCKER_REGISTRY_URL" --password-stdin
  script:
    - docker build -t $DOCKER_REGISTRY_URL/myapp:$CI_COMMIT_SHORT_SHA .
    - docker push $DOCKER_REGISTRY_URL/myapp:$CI_COMMIT_SHORT_SHA
```

#### Option 2: DOCKER_AUTH_CONFIG (Advanced)

For multiple registries or complex authentication:

1. **Generate Docker auth config locally:**

```bash
# Login to all your registries
docker login registry.gitlab.com
docker login docker.io
docker login my-registry.example.com

# Get the auth config
cat ~/.docker/config.json
```

2. **Add to GitLab CI/CD variables:**
   - Variable name: `DOCKER_AUTH_CONFIG`
   - Value: Content of `~/.docker/config.json`
   - Type: File
   - Masked: Yes
   - Protected: Yes (if only for protected branches)

3. **Use in pipeline (automatic):**

```yaml
build:
  stage: build
  tags:
    - docker
  image: docker:latest
  services:
    - docker:dind
  # No before_script needed - DOCKER_AUTH_CONFIG is used automatically
  script:
    - docker build -t my-registry.example.com/app:latest .
    - docker push my-registry.example.com/app:latest
```

#### Option 3: Pre-configured Registry Login (Setup Script)

During runner setup, the registration script asks if you want to configure additional registry credentials. This stores credentials for the `gitlab-runner` user.

**When to use:**
- When you want all jobs to automatically have access to a private registry
- For base images that are frequently used

**How it works:**
```bash
# During setup, you'll be prompted:
Configure additional registry? (yes/no) [no]: yes
Registry URL (e.g., registry.example.com): my-registry.com
Registry Username: myuser
Registry Password: ****

# This runs:
su - gitlab-runner -c "docker login my-registry.com -u myuser -p <password>"
```

**Credentials stored in:**
```bash
/home/gitlab-runner/.docker/config.json
```

**To add more registries later:**
```bash
# Login as gitlab-runner user
sudo su - gitlab-runner

# Login to registry
docker login my-registry.example.com -u myuser -p mypassword

# Verify
docker pull my-registry.example.com/private-image:latest
```

### AWS ECR Authentication

For AWS Elastic Container Registry:

```yaml
variables:
  AWS_DEFAULT_REGION: us-east-1
  ECR_REGISTRY: 123456789.dkr.ecr.us-east-1.amazonaws.com

build:ecr:
  stage: build
  tags:
    - docker
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - apk add --no-cache aws-cli
    # Get ECR login token (valid for 12 hours)
    - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
  script:
    - docker build -t $ECR_REGISTRY/myapp:$CI_COMMIT_SHORT_SHA .
    - docker push $ECR_REGISTRY/myapp:$CI_COMMIT_SHORT_SHA
```

**Required CI/CD Variables:**
- `AWS_ACCESS_KEY_ID` (masked, protected)
- `AWS_SECRET_ACCESS_KEY` (masked, protected)

### Google Container Registry (GCR) Authentication

```yaml
build:gcr:
  stage: build
  tags:
    - docker
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - echo "$GCR_SERVICE_ACCOUNT_KEY" | docker login -u _json_key --password-stdin https://gcr.io
  script:
    - docker build -t gcr.io/my-project/myapp:$CI_COMMIT_SHORT_SHA .
    - docker push gcr.io/my-project/myapp:$CI_COMMIT_SHORT_SHA
```

**Required CI/CD Variables:**
- `GCR_SERVICE_ACCOUNT_KEY` - JSON key file content (masked, protected)

### Azure Container Registry (ACR) Authentication

```yaml
build:acr:
  stage: build
  tags:
    - docker
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - echo "$ACR_PASSWORD" | docker login $ACR_REGISTRY -u $ACR_USERNAME --password-stdin
  script:
    - docker build -t $ACR_REGISTRY/myapp:$CI_COMMIT_SHORT_SHA .
    - docker push $ACR_REGISTRY/myapp:$CI_COMMIT_SHORT_SHA
```

**Required CI/CD Variables:**
- `ACR_REGISTRY` (e.g., `myregistry.azurecr.io`)
- `ACR_USERNAME` (masked)
- `ACR_PASSWORD` (masked, protected)

### Troubleshooting Registry Authentication

#### Issue: "Error response from daemon: pull access denied"

**Solution:**
```bash
# Check if credentials are configured
sudo su - gitlab-runner
docker login registry.gitlab.com
# Or check stored credentials
cat ~/.docker/config.json
```

#### Issue: "unauthorized: authentication required"

**Solution:**
1. Verify CI/CD variables are set correctly
2. Check that image path is correct
3. Ensure registry URL includes protocol if needed

```yaml
# ✅ Correct
image: registry.gitlab.com/group/project:latest

# ❌ Wrong - missing registry path
image: group/project:latest
```

#### Issue: Token expired (AWS ECR)

ECR tokens expire after 12 hours. For long-running pipelines:

```yaml
before_script:
  - |
    # Function to refresh ECR token
    refresh_ecr_token() {
      aws ecr get-login-password --region $AWS_DEFAULT_REGION | \
        docker login --username AWS --password-stdin $ECR_REGISTRY
    }
  - refresh_ecr_token
script:
  - docker build -t $ECR_REGISTRY/app:v1 .
  - refresh_ecr_token  # Refresh before push if job is long
  - docker push $ECR_REGISTRY/app:v1
```

### Security Best Practices

1. **Always use CI/CD variables for credentials** - Never hardcode in `.gitlab-ci.yml`
2. **Mark variables as "Masked"** - Prevents exposure in job logs
3. **Use "Protected" variables** - Only available on protected branches
4. **Rotate credentials regularly** - Update registry passwords/tokens periodically
5. **Use minimal permissions** - Registry credentials should only have push/pull access
6. **Use dedicated service accounts** - Don't use personal credentials

---

## 🎯 Best Practices

### 1. **Use Specific Tags**

```yaml
# ✅ Good - specific tags
build:
  tags:
    - docker
  script:
    - composer install

# ❌ Bad - no tags (might not run)
build:
  script:
    - composer install
```

### 2. **Specify Image in Jobs**

```yaml
# ✅ Good - explicit image
test:
  tags:
    - docker
  image: php:8.2    # Clear what environment is used
  script:
    - phpunit

# ❌ Bad - relying on default image
test:
  tags:
    - docker
  script:
    - phpunit  # Which PHP version?
```

### 3. **Use Artifacts Wisely**

```yaml
build:
  artifacts:
    paths:
      - vendor/
    expire_in: 1 hour  # ✅ Set expiration
```

### 4. **Limit Deploy Runner Access**

- Only use `deploy` tag for production deployments
- Restrict to specific branches (`only: - main`)
- Use `when: manual` for critical deployments
- Set up SSH keys properly

### 5. **Monitor Resource Usage**

```bash
# Check CPU/Memory/Disk regularly
htop
df -h
docker stats

# Set up alerts for high usage
# Consider upgrading server if consistently >80% usage
```

### 6. **Regular Maintenance**

```bash
# Weekly: Clean up Docker
docker system prune -a

# Monthly: Check runner logs for errors
sudo journalctl -u gitlab-runner-docker --since "30 days ago" | grep -i error

# Quarterly: Update GitLab Runner
sudo apt-get update && sudo apt-get install gitlab-runner
```

---

## 🔐 Security Notes

- **Runner-Docker**: Uses privileged mode for Docker-in-Docker (required for building images)
- **Runner-Deploy**: Has direct shell access (restrict to specific projects/groups)
- **Config files**: `chmod 600` (readable only by root and gitlab-runner user)
- **SSH keys**: Use dedicated deploy keys, not personal keys
- **Secrets**: Store in GitLab CI/CD variables, never in `.gitlab-ci.yml`
- **Network**: Consider firewall rules to restrict runner access

---

## ✅ Quick Reference

### Daily Operations

```bash
# Check status
sudo /opt/manage-gitlab-runners.sh status

# View logs
sudo /opt/manage-gitlab-runners.sh logs docker
sudo /opt/manage-gitlab-runners.sh logs deploy

# Restart if needed
sudo /opt/manage-gitlab-runners.sh restart
```

### Configuration Files

```bash
# Docker runner config
/opt/gitlab-runner-docker/config/config.toml

# Deploy runner config
/opt/gitlab-runner-deploy/config/config.toml

# Systemd services
/etc/systemd/system/gitlab-runner-docker.service
/etc/systemd/system/gitlab-runner-deploy.service
```

### Important Commands

```bash
# Verify runners
sudo gitlab-runner verify --config /opt/gitlab-runner-docker/config/config.toml

# List registered runners
sudo gitlab-runner list --config /opt/gitlab-runner-docker/config/config.toml

# Test SSH (for deploy runner)
sudo -u gitlab-runner ssh user@deployment-server
```

---

## 📚 Additional Resources

- **GitLab Runner Docs**: https://docs.gitlab.com/runner/
- **Docker Executor**: https://docs.gitlab.com/runner/executors/docker.html
- **Shell Executor**: https://docs.gitlab.com/runner/executors/shell.html
- **CI/CD Examples**: https://docs.gitlab.com/ee/ci/examples/

---

## 🆚 Comparison: v1 vs v2

| Feature | v1 (Old) | v2 (New) |
|---------|----------|----------|
| **Number of runners** | 4 (PHP, Node, Python, General) | 2 (Docker, Deploy) |
| **Separation logic** | By language/default image | By executor type (Docker vs Shell) |
| **Flexibility** | Limited to default images | Any image via `.gitlab-ci.yml` |
| **Resource efficiency** | 4 systemd services | 2 systemd services |
| **Concurrent jobs** | 1 per runner (4 total) | 5 + 1 (6 total) |
| **Real isolation** | No (all Docker executor) | Yes (Docker vs Shell) |
| **Management complexity** | High (4 services) | Low (2 services) |
| **Use case coverage** | Same languages only | All languages + deployments |

---

*v2.0 - Efficient, flexible, and properly separated architecture* 🚀
