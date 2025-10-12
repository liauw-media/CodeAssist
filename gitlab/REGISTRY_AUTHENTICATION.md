# GitLab Runner - Private Container Registry Authentication

*Quick reference guide for authenticating runners with private container registries*

---

## 🎯 Quick Start

### GitLab Container Registry (Built-in)

**No setup needed!** GitLab automatically provides authentication:

```yaml
build:
  tags:
    - docker
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" "$CI_REGISTRY" --password-stdin
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
```

**To pull private images:**
```yaml
test:
  tags:
    - docker
  image: registry.gitlab.com/your-group/project/base:latest  # Authentication automatic!
  script:
    - npm test
```

---

## 📚 Available CI Variables

GitLab provides these automatically:

| Variable | Description | Example |
|----------|-------------|---------|
| `$CI_REGISTRY` | Registry URL | `registry.gitlab.com` |
| `$CI_REGISTRY_USER` | Username | `gitlab-ci-token` |
| `$CI_REGISTRY_PASSWORD` | Auth token | (auto-generated per job) |
| `$CI_REGISTRY_IMAGE` | Full image path | `registry.gitlab.com/group/project` |

---

## 🔧 Authentication Methods

### Method 1: CI/CD Variables (Recommended)

**For additional registries (DockerHub, private registry, etc.)**

1. **Add variables in GitLab:**
   - Go to: Project → Settings → CI/CD → Variables
   - Add:
     - `DOCKER_REGISTRY_URL` = `docker.io` (or your registry)
     - `DOCKER_REGISTRY_USER` = your username
     - `DOCKER_REGISTRY_PASSWORD` = your password (masked, protected)

2. **Use in pipeline:**
```yaml
before_script:
  - echo "$DOCKER_REGISTRY_PASSWORD" | docker login -u "$DOCKER_REGISTRY_USER" "$DOCKER_REGISTRY_URL" --password-stdin
```

### Method 2: DOCKER_AUTH_CONFIG

**For multiple registries**

1. **Generate config locally:**
```bash
docker login registry1.example.com
docker login registry2.example.com
cat ~/.docker/config.json  # Copy this
```

2. **Add to GitLab CI/CD Variables:**
   - Variable: `DOCKER_AUTH_CONFIG`
   - Value: (paste config.json content)
   - Type: File
   - Masked: Yes

3. **Use automatically:**
```yaml
# No before_script needed - authentication is automatic!
script:
  - docker pull registry1.example.com/image:latest
  - docker pull registry2.example.com/other:latest
```

### Method 3: Runner Pre-configuration

**Configure during runner setup or manually:**

```bash
# Login as gitlab-runner user
sudo su - gitlab-runner

# Login to registry
docker login my-registry.example.com -u myuser

# Credentials stored in:
# /home/gitlab-runner/.docker/config.json
```

**When to use:**
- Frequently used base images
- All jobs need access to same registry
- Don't want to add before_script to every job

---

## ☁️ Cloud Provider Examples

### AWS ECR

```yaml
variables:
  ECR_REGISTRY: 123456789.dkr.ecr.us-east-1.amazonaws.com

build:
  before_script:
    - apk add --no-cache aws-cli
    - aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY
  script:
    - docker build -t $ECR_REGISTRY/myapp:$CI_COMMIT_SHORT_SHA .
    - docker push $ECR_REGISTRY/myapp:$CI_COMMIT_SHORT_SHA
```

**Required CI Variables:**
- `AWS_ACCESS_KEY_ID` (masked)
- `AWS_SECRET_ACCESS_KEY` (masked, protected)
- `AWS_DEFAULT_REGION`

### Google GCR

```yaml
build:
  before_script:
    - echo "$GCR_SERVICE_ACCOUNT_KEY" | docker login -u _json_key --password-stdin https://gcr.io
  script:
    - docker build -t gcr.io/my-project/app:$CI_COMMIT_SHORT_SHA .
    - docker push gcr.io/my-project/app:$CI_COMMIT_SHORT_SHA
```

**Required CI Variables:**
- `GCR_SERVICE_ACCOUNT_KEY` - JSON key content (masked, protected)

### Azure ACR

```yaml
build:
  before_script:
    - echo "$ACR_PASSWORD" | docker login $ACR_REGISTRY -u $ACR_USERNAME --password-stdin
  script:
    - docker build -t $ACR_REGISTRY/app:$CI_COMMIT_SHORT_SHA .
    - docker push $ACR_REGISTRY/app:$CI_COMMIT_SHORT_SHA
```

**Required CI Variables:**
- `ACR_REGISTRY` = `myregistry.azurecr.io`
- `ACR_USERNAME` (masked)
- `ACR_PASSWORD` (masked, protected)

### DockerHub

```yaml
build:
  before_script:
    - echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
  script:
    - docker build -t $DOCKERHUB_USERNAME/myapp:$CI_COMMIT_SHORT_SHA .
    - docker push $DOCKERHUB_USERNAME/myapp:$CI_COMMIT_SHORT_SHA
```

**Required CI Variables:**
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_PASSWORD` (masked, protected) - Use access token, not password!

---

## 🎬 Complete Examples

### Example 1: Pull from GitLab, Push to AWS ECR

```yaml
stages:
  - build
  - push

build:
  stage: build
  tags:
    - docker
  image: $CI_REGISTRY_IMAGE/builder:latest  # Private GitLab image
  script:
    - composer install
    - npm run build
  artifacts:
    paths:
      - dist/

push:ecr:
  stage: push
  tags:
    - docker
  image: docker:latest
  services:
    - docker:dind
  before_script:
    # Login to ECR
    - apk add --no-cache aws-cli
    - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
  script:
    - docker build -t $ECR_REGISTRY/myapp:$CI_COMMIT_SHORT_SHA .
    - docker push $ECR_REGISTRY/myapp:$CI_COMMIT_SHORT_SHA
  only:
    - main
```

### Example 2: Multi-registry (GitLab + DockerHub)

```yaml
push:multiregistry:
  stage: push
  tags:
    - docker
  image: docker:latest
  services:
    - docker:dind
  before_script:
    # Login to GitLab registry
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" "$CI_REGISTRY" --password-stdin
    # Login to DockerHub
    - echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
  script:
    # Build once
    - docker build -t myapp:$CI_COMMIT_SHORT_SHA .

    # Tag for GitLab registry
    - docker tag myapp:$CI_COMMIT_SHORT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest

    # Tag for DockerHub
    - docker tag myapp:$CI_COMMIT_SHORT_SHA $DOCKERHUB_USERNAME/myapp:latest
    - docker push $DOCKERHUB_USERNAME/myapp:latest
```

### Example 3: Pull Base from Private, Build, Push

```yaml
build:app:
  stage: build
  tags:
    - docker
  image: docker:latest
  services:
    - docker:dind
  before_script:
    # Authenticate with private registry for base image
    - echo "$PRIVATE_REGISTRY_PASSWORD" | docker login -u "$PRIVATE_REGISTRY_USER" my-registry.example.com --password-stdin
    # Authenticate with GitLab registry for push
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" "$CI_REGISTRY" --password-stdin
  script:
    # Dockerfile uses: FROM my-registry.example.com/base:latest
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
```

---

## 🐛 Troubleshooting

### Error: "pull access denied"

```bash
# Check runner credentials
sudo su - gitlab-runner
cat ~/.docker/config.json
docker login registry.gitlab.com
```

### Error: "unauthorized: authentication required"

**Check:**
1. CI/CD variables are set
2. Variables are not expired
3. Image path is correct:
   ```yaml
   # ✅ Correct
   image: registry.gitlab.com/group/project:latest

   # ❌ Wrong
   image: project:latest
   ```

### Error: "denied: requested access to the resource is denied"

**Solution:**
- Check user has push permissions
- Verify registry URL is correct
- For GitLab registry: ensure Container Registry is enabled in project settings

### AWS ECR: Token expired

ECR tokens last 12 hours. For long jobs:

```yaml
before_script:
  - apk add --no-cache aws-cli
  - |
    ecr_login() {
      aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY
    }
  - ecr_login

script:
  - docker build -t app:v1 .
  - ecr_login  # Re-authenticate before push
  - docker push $ECR_REGISTRY/app:v1
```

---

## 🔐 Security Checklist

- [ ] Use CI/CD variables for credentials (never hardcode)
- [ ] Mark sensitive variables as "Masked"
- [ ] Use "Protected" variables for production
- [ ] Use access tokens instead of passwords (DockerHub, GitHub, etc.)
- [ ] Rotate credentials regularly
- [ ] Use minimal permissions (push/pull only)
- [ ] Use dedicated service accounts
- [ ] Review audit logs periodically

---

## 📋 Quick Command Reference

```bash
# Test authentication manually
sudo su - gitlab-runner
docker login registry.gitlab.com
docker pull registry.gitlab.com/group/project/image:latest

# Check stored credentials
cat ~/.docker/config.json

# Remove stored credentials
docker logout registry.gitlab.com

# Test ECR authentication
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
```

---

## 📚 Additional Resources

- [GitLab CI/CD Variables](https://docs.gitlab.com/ee/ci/variables/)
- [GitLab Container Registry](https://docs.gitlab.com/ee/user/packages/container_registry/)
- [Docker Login Documentation](https://docs.docker.com/engine/reference/commandline/login/)
- [AWS ECR Authentication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html)

---

*For full runner setup, see [GITLAB_RUNNERS_SETUP_V2.md](GITLAB_RUNNERS_SETUP_V2.md)*
