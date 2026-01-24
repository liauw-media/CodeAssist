# Ralph Wiggum - Autonomous Development Runner

Headless autonomous development loop powered by the Claude Agent SDK. Runs quality gates, auto-fixes issues, and creates PRs when targets are met.

> **Note:** Ralph is a separate tool from the core CodeAssist installation. It's designed for CI/CD pipelines, overnight batch runs, and unattended development.

---

## Overview

### Two Modes of Autonomous Development

| Mode | Command | Use Case | Requirements |
|------|---------|----------|--------------|
| **Interactive** | `/autonomous --issue 123` | In-session, supervised | GitHub MCP, Claude Code |
| **Headless (Ralph)** | `npx tsx ralph-runner.ts --issue=123` | CI/CD, overnight runs | API key, Node.js 18+ |

### When to Use Ralph

- **Unattended overnight runs** - Process issues while you sleep
- **CI/CD integration** - Run quality gates in pipelines
- **Batch processing** - Work through multiple issues from an epic
- **Docker deployment** - Containerized autonomous development

### When to Use `/autonomous` Instead

- Active Claude Code session
- Real-time monitoring needed
- Single issue with potential intervention
- Learning the autonomous workflow

---

## Installation

Ralph is **not included** in the standard CodeAssist installation. Install separately:

```bash
# Clone or navigate to CodeAssist
cd /path/to/CodeAssist

# Install dependencies
cd scripts
npm install

# Verify installation
npx tsx ralph-runner.ts --help
```

### Prerequisites

| Requirement | How to Get |
|-------------|-----------|
| **Node.js 18+** | [nodejs.org](https://nodejs.org) |
| **Claude Code** | `curl -fsSL https://claude.ai/install.sh \| bash` |
| **Anthropic API Key** | [console.anthropic.com](https://console.anthropic.com) |
| **GitHub CLI** | `gh auth login` |

### Environment Variables

```bash
# Required
export ANTHROPIC_API_KEY=sk-ant-...

# Optional (falls back to gh CLI authentication)
export GITHUB_TOKEN=ghp_...

# Debug mode
export DEBUG=1
```

---

## Quick Start

```bash
# Validate configuration (no execution)
npx tsx ralph-runner.ts --issue=123 --dry-run

# Run on a single issue
npx tsx ralph-runner.ts --issue=123

# Run with production preset (stricter thresholds)
npx tsx ralph-runner.ts --issue=123 --preset=production

# Supervised mode (pause after each iteration)
npx tsx ralph-runner.ts --issue=123 --supervised

# Use Ollama for non-critical gates
npx tsx ralph-runner.ts --issue=123 --preset=ollama_hybrid
```

---

## CLI Reference

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `--issue=ID` | GitHub/GitLab issue number | Yes |
| `--preset=NAME` | Configuration preset | No |
| `--supervised` | Pause after each iteration | No |
| `--dry-run` | Validate config only | No |
| `--test-provider` | Test provider connectivity | No |

### Presets

| Preset | Description |
|--------|-------------|
| `default` | Standard thresholds (95 target) |
| `production` | Stricter thresholds (98 target) |
| `prototype` | Relaxed for rapid prototyping |
| `frontend` | Includes UX gate |
| `ollama_hybrid` | Claude for critical, Ollama for others |
| `ollama_only` | All gates use Ollama |

### Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success - PR created |
| `1` | Failure - blocked or max iterations |

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    RALPH WIGGUM LOOP                            │
├─────────────────────────────────────────────────────────────────┤
│  1. FETCH ISSUE → Read from GitHub/GitLab                       │
│  2. CREATE BRANCH → feature/{issue-id}-implement                │
│  3. IMPLEMENT → Code based on issue requirements                │
│  4. RUN QUALITY GATES (parallel groups)                         │
│     ├── Group 1: /test, /security, /build (required)            │
│     ├── Group 2: /review, /mentor (quality)                     │
│     └── Group 3: /architect, /devops, /ux (advisory)            │
│  5. EVALUATE → Score >= target? Create PR : Auto-fix & retry    │
│  6. CREATE PR → feature → staging (requires human review)       │
└─────────────────────────────────────────────────────────────────┘
```

### Quality Gates

| Gate | Weight | Required | Auto-Fix | Description |
|------|--------|----------|----------|-------------|
| `/test` | 25 | Yes | Yes | Tests pass + 80% coverage |
| `/security` | 25 | Yes | Yes | No critical/high vulnerabilities |
| `/build` | 15 | Yes | Yes | Project compiles |
| `/review` | 20 | No | Yes | Code quality, smells, duplication |
| `/mentor` | 10 | No | No | Architecture review |
| `/ux` | 5 | No | No | Accessibility (frontend only) |
| `/architect` | 0 | No | No | System security & performance |
| `/devops` | 0 | No | No | CI/CD and infrastructure |

### Scoring

```
TOTAL = test + security + build + review + mentor + ux + bonus

EXIT CONDITIONS:
  - score >= 95 → Create PR, success
  - score 85-94 after 10 iterations → Create PR with "needs-review" label
  - score < 85 after max_iterations → BLOCKED, exit 1
  - Any required gate fails after retries → BLOCKED, exit 1
```

---

## Configuration

Create `.claude/autonomous.yml` in your project:

```yaml
# Target score to create PR
target_score: 95

# Maximum iterations before giving up
max_iterations: 15

# Delay between iterations (seconds)
iteration_delay: 5

# Gate configuration
gates:
  test:
    weight: 25
    required: true
    auto_fix: true
    parallel_group: 1
    timeout_ms: 300000  # 5 minutes
    thresholds:
      min_coverage: 80

  security:
    weight: 25
    required: true
    auto_fix: true
    parallel_group: 1

  build:
    weight: 15
    required: true
    auto_fix: true
    parallel_group: 1

  review:
    weight: 20
    required: false
    auto_fix: true
    parallel_group: 2

  mentor:
    weight: 10
    required: false
    auto_fix: false
    parallel_group: 2

  ux:
    weight: 5
    required: false
    auto_fix: false
    parallel_group: 3

# Presets override base config
presets:
  production:
    target_score: 98
    gates:
      test:
        thresholds:
          min_coverage: 90

  prototype:
    target_score: 80
    max_iterations: 5
    gates:
      security:
        required: false

# Safety limits
safety:
  max_api_calls_per_hour: 500
  max_issues_created_per_run: 10
  forbidden:
    - "rm -rf /"
    - "DROP DATABASE"
    - "format c:"

# Git rules
git_rules:
  protected_branches:
    - main
    - master
    - staging
  commit_rules:
    forbidden_patterns:
      - "Co-Authored-By: Claude"
      - "Generated by AI"
    auto_strip: true

# Provider configuration (optional)
providers:
  default: claude
  ollama:
    enabled: true
    base_url: http://localhost:11434
    model: qwen3-coder
  gate_providers:
    test: claude
    security: claude
    build: ollama
    review: ollama
```

---

## Provider Configuration

Ralph supports multiple LLM providers for different gates.

### Claude Only (Default)

```yaml
providers:
  default: claude
```

### Hybrid Mode

Use Claude for critical gates, Ollama for others:

```yaml
providers:
  default: claude
  ollama:
    enabled: true
    base_url: http://localhost:11434
    model: qwen3-coder
  gate_providers:
    test: claude      # Critical - use Claude
    security: claude  # Critical - use Claude
    build: ollama     # Less critical
    review: ollama    # Less critical
    mentor: claude    # Architecture - use Claude
    ux: ollama
```

Or use the CLI preset:

```bash
npx tsx ralph-runner.ts --issue=123 --preset=ollama_hybrid
```

### Ollama Only

Fully local execution:

```yaml
providers:
  default: ollama
  ollama:
    enabled: true
    base_url: http://localhost:11434
    model: qwen3-coder
```

### Testing Provider Connectivity

```bash
npx tsx ralph-runner.ts --test-provider --preset=ollama_hybrid
```

---

## Custom Gates

Create custom quality gates in `scripts/gates/*.yml`:

```yaml
# gates/performance.yml
name: performance
description: Check for performance issues
tools:
  - Read
  - Glob
  - Grep
  - Bash
prompt: |
  You are a performance auditor. Analyze the codebase for:
  1. N+1 query patterns
  2. Missing database indexes
  3. Unbounded loops
  4. Memory leaks

  OUTPUT JSON ONLY:
  {
    "gate": "performance",
    "passed": boolean,
    "score": number (0-100),
    "issues": [
      {
        "severity": "critical|high|medium|low",
        "title": "Issue title",
        "file": "path/to/file",
        "line": 123,
        "description": "What's wrong",
        "recommendation": "How to fix"
      }
    ]
  }
```

Then add to your config:

```yaml
gates:
  performance:
    weight: 10
    required: false
    auto_fix: false
    command: performance
    parallel_group: 2
```

---

## Docker Deployment

### Build

```bash
cd scripts
docker build -t ralph-wiggum .
```

### Run

```bash
docker run \
  -e ANTHROPIC_API_KEY=your-key \
  -e GITHUB_TOKEN=your-token \
  -v $(pwd):/workspace \
  ralph-wiggum --issue=123
```

### Docker Compose

```yaml
# docker-compose.yml
services:
  ralph:
    build: ./scripts
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - GITHUB_TOKEN=${GITHUB_TOKEN}
    volumes:
      - .:/workspace
    command: ["--issue=123", "--preset=production"]
```

### CI/CD Integration (GitHub Actions)

```yaml
name: Autonomous Development
on:
  issues:
    types: [labeled]

jobs:
  ralph:
    if: github.event.label.name == 'auto-implement'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Ralph
        run: |
          cd scripts
          npm install

      - name: Run Ralph
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          cd scripts
          npx tsx ralph-runner.ts \
            --issue=${{ github.event.issue.number }} \
            --preset=production
```

---

## Human Intervention

Comment on the GitHub issue to control Ralph:

| Command | Action |
|---------|--------|
| `@claude {instruction}` | Execute instruction and continue |
| `@pause` | Pause the loop |
| `@resume` | Resume paused loop |
| `@skip-gate {gate} {reason}` | Skip a gate with justification |
| `@target {score}` | Adjust target score |

### Example

```markdown
@claude Use Redis for caching instead of in-memory storage
```

Ralph will incorporate the instruction and continue the loop.

---

## Safety Features

### Protected Branches

Ralph will **never**:
- Push directly to main/master/staging
- Force push
- Auto-merge PRs
- Include AI attribution in commits

### Rate Limiting

- Default: 500 API calls per hour
- Configurable in `safety.max_api_calls_per_hour`

### Circuit Breaker

- Trips after 5 consecutive failures
- 5-minute cooldown before retry
- Prevents runaway API usage

### Forbidden Commands

Customizable blocklist in `safety.forbidden`:

```yaml
safety:
  forbidden:
    - "rm -rf /"
    - "DROP DATABASE"
    - "git push --force"
```

---

## Architecture

```
ralph-runner.ts
├── RateLimiter        - API call rate limiting
├── CircuitBreaker     - Failure isolation (5 failures → 5min cooldown)
├── CheckpointManager  - Crash recovery state persistence
├── AuditLogger        - Tool call audit trail with rotation
├── MetricsCollector   - Run metrics and statistics
├── StructuredLogger   - JSON logging with levels
└── RunContext         - Coordinates all components
```

### State Files

| File | Purpose |
|------|---------|
| `.ralph-state.json` | Checkpoint for crash recovery |
| `autonomous-audit.log` | Tool call audit trail |
| `autonomous-metrics.json` | Run statistics |

---

## Troubleshooting

### "ANTHROPIC_API_KEY not set"

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

### "gh: not found"

Install GitHub CLI:
```bash
# macOS
brew install gh

# Ubuntu
sudo apt install gh

# Windows
winget install GitHub.cli
```

Then authenticate:
```bash
gh auth login
```

### Gate timeout

Increase timeout in config:
```yaml
gates:
  test:
    timeout_ms: 600000  # 10 minutes
```

### Circuit breaker tripped

Wait 5 minutes or fix the underlying issue causing failures.

### Debug mode

```bash
DEBUG=1 npx tsx ralph-runner.ts --issue=123
```

---

## See Also

- [scripts/README.md](../scripts/README.md) - Full scripts documentation
- [commands/autonomous.md](../commands/autonomous.md) - Interactive autonomous mode
- [templates/autonomous.yml](../templates/autonomous.yml) - Example configuration
