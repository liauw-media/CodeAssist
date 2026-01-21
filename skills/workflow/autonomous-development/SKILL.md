# Autonomous Development

## Description

Execute iterative development loops with automated quality gates, issue tracking integration, and intelligent remediation. Achieve 95/100 quality score before creating pull requests.

## When to Use

- Large features broken into multiple issues
- Repetitive tasks that benefit from automation
- When consistent quality enforcement is needed
- Overnight/background development runs

## Prerequisites

- GitHub or GitLab MCP configured
- Issues/epic created via `/plan --issues`
- `.claude/autonomous.yml` configured (or use defaults)

---

## Quality Gates

### Required Gates (Blockers)

| Gate | Weight | Threshold | Remediation |
|------|--------|-----------|-------------|
| `/test` | 25 | 80% coverage, 0 failures | Auto-fix test failures |
| `/security` | 25 | 0 critical/high vulns | Auto-fix vulnerabilities |
| `/build` | 15 | Build succeeds | `/build-fix` |

### Quality Gates

| Gate | Weight | Threshold | Remediation |
|------|--------|-----------|-------------|
| `/review` | 20 | < 3 smells | `/cleanup` |
| `/mentor` | 10 | No critical concerns | Create issues |
| `/ux` | 5 | A11y + responsive | Create issues |

### Scoring

```
Target: 95/100

Score = test + security + build + review + mentor + ux + bonus

Bonus:
  +2 for coverage > 90%
  +2 for zero code smells
  +1 for zero security issues
```

---

## Workflow

### Phase 1: Planning

```bash
# Create epic with child issues
/plan "User authentication system" --issues

# Result:
# Epic #100: "User Authentication System"
# ├── Issue #101: "Create User model"
# ├── Issue #102: "Login endpoint"
# ├── Issue #103: "Session management"
# └── Issue #104: "Password reset"
```

### Phase 2: Autonomous Execution

```bash
# Start autonomous development
/autonomous --epic 100 --target 95

# Or for a single issue
/autonomous --issue 101
```

### Phase 3: Monitoring

Watch progress via:
- Issue comments (real-time updates)
- GitHub/GitLab notifications
- `/gate-status` command

### Phase 4: Review & Merge

- PRs created automatically when score >= 95
- Human reviews and approves
- On merge, loop continues to next issue

---

## Configuration

### Basic Config (`.claude/autonomous.yml`)

```yaml
target_score: 95
max_iterations: 15

gates:
  test:
    weight: 25
    required: true
    thresholds:
      min_coverage: 80
      max_failures: 0

  security:
    weight: 25
    required: true
    thresholds:
      critical_vulns: 0
      high_vulns: 0

  review:
    weight: 20
    auto_fix: true
```

### Presets

| Preset | Target | Use Case |
|--------|--------|----------|
| `default` | 95 | Standard development |
| `prototype` | 80 | Quick prototypes, MVPs |
| `production` | 98 | Production-critical code |
| `frontend` | 95 | UI components (UX required) |

```bash
/autonomous --epic 100 --preset production
```

---

## Issue Integration

### Issue Lifecycle

```
OPEN → IN PROGRESS → PR CREATED → IN REVIEW → MERGED → CLOSED
                         ↓
                   (if blocked)
                         ↓
                     BLOCKED → (human intervention) → IN PROGRESS
```

### Labels Applied

| Label | Meaning |
|-------|---------|
| `in-progress` | Autonomous loop working on issue |
| `blocked` | Loop paused, human needed |
| `ready-for-review` | PR created, awaiting approval |
| `auto-generated` | Issue created by autonomous run |
| `tech-debt` | Deferred improvement |

### Sub-Issue Creation

Unresolved items become linked issues:

```
Issue #101: "Create User model" [CLOSED]
├── PR #110 [MERGED]
└── Sub-issues created:
    ├── #105: "[Security] Add rate limiting" (medium vuln)
    └── #106: "[Tech Debt] Consider caching" (mentor recommendation)
```

---

## Human Intervention

### Via Issue Comments

| Command | Action |
|---------|--------|
| `@claude [instruction]` | Execute instruction |
| `@pause` | Pause loop |
| `@resume` | Resume loop |
| `@skip-gate [gate] [reason]` | Skip a gate |
| `@target [score]` | Change target score |

### Example

```markdown
<!-- User comments -->
@claude Use bcrypt instead of argon2 for password hashing

<!-- Bot responds -->
@user Understood. Switching to bcrypt:
- Updated User model
- Modified password service
- Updated tests

Re-running quality gates...
```

---

## Exit Conditions

### Success (Create PR)

- Score >= 95 (or target)
- All required gates pass

### Success with Review

- Score 85-94
- 10+ iterations attempted
- All required gates pass
- PR labeled `needs-review`

### Blocked (Pause)

- Required gate fails after max retries
- Score < 85 after max iterations
- Human intervention requested

---

## Best Practices

### Do

- Break features into small, focused issues
- Set realistic acceptance criteria
- Review autonomous PRs carefully
- Address tech-debt issues promptly

### Don't

- Create overly complex single issues
- Ignore blocked notifications
- Auto-merge PRs (always review)
- Skip security gates without justification

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Loop stuck on same score | Check for flaky tests, review gate output |
| Too many sub-issues created | Adjust thresholds in config |
| PR has conflicts | Rebase branch, resume loop |
| Rate limited | Increase `iteration_delay` |

---

## Metrics

Track autonomous development effectiveness:

| Metric | Target |
|--------|--------|
| Average score | > 90 |
| Iterations per issue | < 5 |
| Auto-fix success rate | > 80% |
| Human interventions | < 10% of issues |

---

## Related

- `/plan` - Create issues from feature request
- `/orchestrate` - Coordinate multiple autonomous runs
- `/review` - Code review gate
- `/security` - Security audit gate
- `/mentor` - Architecture review gate
