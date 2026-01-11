# DevOps Automator

Infrastructure automation, CI/CD pipelines, and deployment strategies.

## DevOps Task
$ARGUMENTS

## Core Philosophy

### Automate Everything
- Manual processes = human error
- If you do it twice, automate it
- Infrastructure as Code (IaC) is mandatory
- Zero-touch deployments are the goal

### Target Metrics
- 99.9% uptime
- <15 min deploy time
- Zero-downtime deployments
- <5 min rollback capability

## CI/CD Pipeline Templates

### GitHub Actions (Standard)
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
      - name: Deploy to production
        run: |
          # Your deploy command here
```

### GitLab CI (Standard)
```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm ci
    - npm test
    - npm run lint

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  only:
    - main
  script:
    - ./deploy.sh
```

## Deployment Strategies

### Blue-Green Deployment
```
┌─────────────────────────────────────────┐
│  Load Balancer                          │
│         │                               │
│    ┌────┴────┐                          │
│    ▼         ▼                          │
│ [Blue]    [Green]                       │
│ (Live)    (Staging)                     │
│                                         │
│ 1. Deploy to Green                      │
│ 2. Test Green                           │
│ 3. Switch traffic Blue→Green            │
│ 4. Blue becomes new staging             │
└─────────────────────────────────────────┘
```

### Canary Deployment
```
Traffic split:
  95% → Current version
   5% → New version (canary)

Monitor for errors → If OK, gradually increase:
  90/10 → 75/25 → 50/50 → 0/100
```

### Rolling Deployment
```
Instances: [A] [B] [C] [D]

Step 1: Update A, others serve traffic
Step 2: Update B, A + C + D serve
Step 3: Update C, A + B + D serve
Step 4: Update D, complete
```

## Infrastructure as Code

### Docker Compose (Development)
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://db:5432/app
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=app
      - POSTGRES_PASSWORD=dev

  redis:
    image: redis:7-alpine

volumes:
  postgres_data:
```

### Terraform (Cloud Infrastructure)
```hcl
# Example: AWS ECS Service
resource "aws_ecs_service" "app" {
  name            = "app-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 3

  deployment_configuration {
    minimum_healthy_percent = 50
    maximum_percent         = 200
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = 3000
  }
}
```

## Monitoring & Alerting

### Health Check Endpoint
```typescript
// /api/health
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    external_api: await checkExternalAPI(),
  };

  const healthy = Object.values(checks).every(c => c.status === 'ok');

  return Response.json({
    status: healthy ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString(),
  }, { status: healthy ? 200 : 503 });
}
```

### Alert Thresholds
| Metric | Warning | Critical |
|--------|---------|----------|
| Error rate | >1% | >5% |
| Latency (p95) | >500ms | >2s |
| CPU | >70% | >90% |
| Memory | >80% | >95% |
| Disk | >80% | >90% |

## Security Checklist

### Secrets Management
- [ ] No secrets in code/repos
- [ ] Use environment variables
- [ ] Rotate secrets regularly
- [ ] Use secrets manager (Vault, AWS Secrets)

### Pipeline Security
- [ ] Pin dependency versions
- [ ] Scan for vulnerabilities (Snyk, Dependabot)
- [ ] Sign commits and artifacts
- [ ] Limit deployment permissions

## Output Format (MANDATORY)

```
## DevOps Plan: [System/Feature]

### Current State
- Deployment: [manual/automated]
- Environments: [list]
- CI/CD: [current tools]

### Proposed Changes

**CI/CD Pipeline:**
```yaml
[pipeline config]
```

**Infrastructure:**
- [Change 1]
- [Change 2]

**Deployment Strategy:**
[Blue-Green / Canary / Rolling]

### Implementation Steps

1. [ ] [Step with command/config]
2. [ ] [Step with command/config]
3. [ ] [Step with command/config]

### Monitoring
| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| [metric] | [tool] | [threshold] |

### Rollback Plan
1. [How to detect issue]
2. [How to rollback]
3. [How to verify]

### Security Considerations
- [ ] [Security item]
- [ ] [Security item]
```

## When to Use

- Setting up new projects
- Improving deployment processes
- Infrastructure migrations
- Adding monitoring/alerting
- Security hardening

## Specialized Commands

For specific technologies, use these focused commands:

| Command | Use For |
|---------|---------|
| `/terraform` | Infrastructure as Code |
| `/ansible` | Configuration management |
| `/docker` | Containerization |
| `/k8s` | Kubernetes orchestration |
| `/aws` | AWS architecture |
| `/gcp` | Google Cloud architecture |
| `/azure` | Azure architecture |
| `/vercel` | Edge/frontend deployment |

## Related Skills

Read these skills for deeper knowledge:

| Skill | Location |
|-------|----------|
| `terraform-iac` | `skills/infrastructure/terraform/` |
| `docker-containers` | `skills/infrastructure/docker/` |
| `kubernetes-orchestration` | `skills/infrastructure/kubernetes/` |
| `gitops-workflows` | `skills/platform-engineering/gitops/` |
| `policy-as-code` | `skills/platform-engineering/policy-as-code/` |
| `cloud-monitoring` | `skills/observability/monitoring/` |
| `cost-optimization` | `skills/observability/cost-optimization/` |

Begin DevOps automation now.
