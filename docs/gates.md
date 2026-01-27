# Quality Gates Configuration

Quality gates are automated checks that run during autonomous development. Each gate evaluates a specific aspect of code quality and contributes to the overall score.

## Gate Overview

| Gate | Weight | Required | Description |
|------|--------|----------|-------------|
| `test` | 20 | Yes | Tests pass with coverage >= 80% |
| `security` | 20 | Yes | No critical/high vulnerabilities |
| `build` | 10 | Yes | Project compiles successfully |
| `review` | 15 | No | Code quality, smells, duplication |
| `mentor` | 15 | Yes | Architecture review, design patterns |
| `architect` | 10 | No | System security & performance |
| `ux` | 5 | No | Accessibility (frontend only) |
| `devops` | 5 | No | CI/CD configuration review |

**Total: 100 points**

## Gate Presets

Presets provide pre-configured gate weights for different scenarios.

### balanced (default)

The default configuration. Good for most projects.

```yaml
target_score: 95
gates:
  test:     { weight: 20, required: true }
  security: { weight: 20, required: true }
  build:    { weight: 10, required: true }
  review:   { weight: 15, required: false }
  mentor:   { weight: 15, required: true }
  architect: { weight: 10, required: false }
  ux:       { weight: 5, required: false }
  devops:   { weight: 5, required: false }
```

### strict

Maximum quality. All major gates required. Use for production releases.

```yaml
target_score: 98
max_iterations: 20
gates:
  test:     { weight: 20, required: true }
  security: { weight: 25, required: true }
  build:    { weight: 10, required: true }
  review:   { weight: 15, required: true }
  mentor:   { weight: 15, required: true }
  architect: { weight: 10, required: true }
  ux:       { weight: 5, required: false }
  devops:   { weight: 0, required: false }
```

### production

Alias for `strict`. Use when deploying to production.

### fast

Minimal gates for quick iterations. Use for prototypes or experiments.

```yaml
target_score: 85
max_iterations: 5
gates:
  test:     { weight: 40, required: true }
  security: { weight: 30, required: true }
  build:    { weight: 30, required: true }
  review:   { weight: 0, required: false }
  mentor:   { weight: 0, required: false }
  architect: { weight: 0, required: false }
  ux:       { weight: 0, required: false }
  devops:   { weight: 0, required: false }
```

### prototype

Lowest barrier. Just verify tests pass. Use for hackathons or MVPs.

```yaml
target_score: 80
max_iterations: 3
gates:
  test:     { weight: 50, required: true }
  security: { weight: 20, required: false }
  build:    { weight: 30, required: true }
  review:   { weight: 0, required: false }
  mentor:   { weight: 0, required: false }
  architect: { weight: 0, required: false }
  ux:       { weight: 0, required: false }
  devops:   { weight: 0, required: false }
```

### frontend

Frontend-focused. UX gate required, higher weight on review.

```yaml
target_score: 95
max_iterations: 15
gates:
  test:     { weight: 20, required: true }
  security: { weight: 15, required: true }
  build:    { weight: 10, required: true }
  review:   { weight: 20, required: true }
  mentor:   { weight: 10, required: false }
  architect: { weight: 5, required: false }
  ux:       { weight: 15, required: true }
  devops:   { weight: 5, required: false }
```

## Usage

### With /autonomous Command

```bash
# Use a preset
/autonomous --issue 123 --preset strict

# Use default (balanced)
/autonomous --issue 123

# Override target score
/autonomous --issue 123 --preset fast --target 90
```

### With Ralph (Headless Runner)

```bash
# Use a preset
npx tsx ralph-runner.ts --issue=123 --preset=production

# Combined with Ollama
npx tsx ralph-runner.ts --issue=123 --preset=fast --ollama
```

### In Configuration File

Create `.claude/autonomous.yml`:

```yaml
# Use a preset as base
preset: balanced

# Override target score
target_score: 92

# Customize individual gates
gates:
  mentor:
    weight: 20
    required: true
  ux:
    weight: 0
    required: false
```

## Configuration Hierarchy

Settings are applied in this order (later overrides earlier):

1. **Built-in defaults** (balanced preset)
2. **Preset** (if specified via `--preset` or config)
3. **Config file** (`.claude/autonomous.yml`)
4. **CLI flags** (`--target`, `--max-iterations`)

## Customizing Gates

### Adjusting Weight

Change how much a gate contributes to the total score:

```yaml
gates:
  mentor:
    weight: 25  # Increase from 15 to 25
```

### Making Gates Required

Required gates must pass for the run to succeed, regardless of score:

```yaml
gates:
  architect:
    required: true  # Now blocks if fails
```

### Disabling Gates

Set weight to 0 to disable a gate:

```yaml
gates:
  ux:
    weight: 0
    required: false
```

### Parallel Groups

Gates in the same parallel group run concurrently:

```yaml
gates:
  test:
    parallel_group: 1
  security:
    parallel_group: 1  # Runs with test
  review:
    parallel_group: 2  # Runs after group 1
```

## Gate Details

### test

Runs project tests and checks coverage.

- **Pass criteria**: All tests pass, coverage >= 80%
- **Auto-fix**: Attempts to fix failing tests
- **Commands**: `/test --json`

### security

Scans for vulnerabilities using OWASP guidelines.

- **Pass criteria**: No critical or high vulnerabilities
- **Auto-fix**: Patches vulnerable dependencies, fixes SQL injection, XSS
- **Commands**: `/security --json`

### build

Compiles the project.

- **Pass criteria**: Build succeeds without errors
- **Auto-fix**: Fixes type errors, missing imports
- **Commands**: `/build-fix`

### review

Code quality analysis.

- **Pass criteria**: No critical smells, duplication < 5%
- **Auto-fix**: Runs `/cleanup` for auto-fixable issues
- **Commands**: `/review --json`

### mentor

Architecture and design review.

- **Pass criteria**: No critical concerns, score >= 6/10
- **Auto-fix**: None (requires human judgment)
- **Commands**: `/mentor --json`

### architect

System security and performance analysis.

- **Pass criteria**: No critical security gaps, acceptable performance
- **Auto-fix**: None (requires human judgment)
- **Commands**: `/architect --json`

### ux

Accessibility and UX review (frontend only).

- **Pass criteria**: WCAG 2.1 AA compliance, responsive design
- **Auto-fix**: None (requires human judgment)
- **Commands**: `/ux --json`
- **Triggers**: Only runs on issues labeled `frontend`, `ui`, or `component`

### devops

CI/CD configuration review.

- **Pass criteria**: Pipeline follows best practices
- **Auto-fix**: None (requires human judgment)
- **Commands**: `/devops --json`

## Choosing a Preset

| Scenario | Preset | Why |
|----------|--------|-----|
| Regular development | `balanced` | Good coverage, reasonable speed |
| Production release | `strict` | Maximum quality assurance |
| Quick fix | `fast` | Core checks only |
| Hackathon/MVP | `prototype` | Just verify it works |
| UI component | `frontend` | UX and accessibility focus |

## Examples

### Strict Production Pipeline

```bash
# GitHub Actions / GitLab CI
npx tsx ralph-runner.ts --epic=100 --preset=strict --target=98
```

### Quick Feature Branch

```bash
/autonomous --issue 456 --preset=fast
```

### Frontend Component

```bash
/autonomous --issue 789 --preset=frontend
```

### Custom Configuration

```yaml
# .claude/autonomous.yml
target_score: 93
max_iterations: 12

gates:
  test:
    weight: 25
    required: true
  security:
    weight: 25
    required: true
  build:
    weight: 15
    required: true
  review:
    weight: 15
    required: false
  mentor:
    weight: 20
    required: true
  architect:
    weight: 0
    required: false
  ux:
    weight: 0
    required: false
  devops:
    weight: 0
    required: false
```

## Related

- [Ralph Wiggum (Headless Runner)](ralph.md)
- [Autonomous Development Skill](../skills/workflow/autonomous-development/SKILL.md)
- [Ollama Integration](ollama.md)
