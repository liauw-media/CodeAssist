# Autonomous Development

Run autonomous development loop with quality gates on GitHub/GitLab issues.

## Arguments
$ARGUMENTS

## Usage

```bash
# Run on a specific epic
/autonomous --epic 200

# Run on a single issue
/autonomous --issue 201

# With custom target score
/autonomous --epic 200 --target 95

# Use a preset
/autonomous --epic 200 --preset production

# Supervised mode (pause after each iteration)
/autonomous --epic 200 --supervised
```

## Protocol

You are now operating as the **autonomous-loop-runner** agent.

### Pre-Flight Checks

1. **Load configuration**: Read `.claude/autonomous.yml` or use defaults
2. **Verify MCP**: Ensure GitHub or GitLab MCP is available
3. **Fetch epic/issues**: Get issue details and dependencies
4. **Verify Ralph**: Check Ralph is installed (or use internal loop)

### Configuration Defaults

```yaml
target_score: 95
max_iterations: 15
gates:
  test:     { weight: 25, required: true,  auto_fix: true  }
  security: { weight: 25, required: true,  auto_fix: true  }
  review:   { weight: 20, required: false, auto_fix: true  }
  build:    { weight: 15, required: true,  auto_fix: true  }
  mentor:   { weight: 10, required: false, auto_fix: false }
  ux:       { weight: 5,  required: false, auto_fix: false }
```

---

## Main Loop

```
FOR each issue in epic (respecting dependencies):

  1. CREATE BRANCH
     └── /branch {issue-id} {issue-title}
     └── Post: "🚀 Starting work on this issue..."

  2. IMPLEMENT
     └── Read issue description and acceptance criteria
     └── Implement the feature/fix
     └── Commit changes

  3. RUN QUALITY GATES
     └── Execute each gate in sequence
     └── Calculate scores
     └── Auto-fix where possible
     └── Create issues for unfixable items

  4. EVALUATE
     └── IF score >= target: Create PR
     └── IF score < target AND retries left: Loop back to step 2
     └── IF max retries reached: Flag for human, pause

  5. WAIT FOR PR
     └── Post summary to issue
     └── Wait for human approval
     └── On merge: Close issue, next issue
```

---

## Quality Gate Execution

### Gate: /test (25 points)

```
RUN: /test --json

EVALUATE:
  - All tests pass? → +20 points
  - Coverage >= 80%? → +5 points
  - Coverage >= 90%? → +2 bonus points

ON FAIL:
  - Analyze failures
  - Attempt fix
  - Re-run (max 3 retries)

POST TO ISSUE:
  ## Test Results
  | Metric | Value | Status |
  |--------|-------|--------|
  | Tests | 47 passed, 0 failed | ✅ |
  | Coverage | 92% | ✅ |
  | **Score** | **25/25** | |
```

### Gate: /security (25 points)

```
RUN: /security --json

EVALUATE:
  - 0 critical vulns? → Required (blocker if fails)
  - 0 high vulns? → Required (blocker if fails)
  - Medium vulns → -1 point each (max -5)
  - Low vulns → Create issues, no point deduction

ON FAIL (critical/high):
  - Attempt auto-fix
  - Re-run (max 3 retries)
  - If still fails → BLOCKER, pause loop

CREATE ISSUES FOR:
  - Each medium vulnerability
  - Each low vulnerability (labeled as tech-debt)

POST TO ISSUE:
  ## Security Audit
  | Severity | Count | Status |
  |----------|-------|--------|
  | Critical | 0 | ✅ |
  | High | 0 | ✅ |
  | Medium | 1 | ⚠️ Created #207 |
  | Low | 2 | ℹ️ Created #208, #209 |
  | **Score** | **24/25** | |
```

### Gate: /build-fix (15 points)

```
RUN: Build project (auto-detect: npm, composer, cargo, etc.)

EVALUATE:
  - Build succeeds? → +15 points
  - Build fails? → 0 points (blocker)

ON FAIL:
  - Run /build-fix
  - Re-run build (max 5 retries)
  - If still fails → BLOCKER, pause loop

POST TO ISSUE:
  ## Build Status
  | Check | Status |
  |-------|--------|
  | Compilation | ✅ Pass |
  | Type checking | ✅ Pass |
  | **Score** | **15/15** |
```

### Gate: /review (20 points)

```
RUN: /review --json

EVALUATE:
  - No critical smells? → +10 points
  - No duplication > 5%? → +5 points
  - No complexity issues? → +5 points
  - Minor smells (< 3)? → Acceptable

ON FAIL:
  - Run /cleanup for auto-fixable issues
  - Re-run review
  - Create issues for unfixable items

CREATE ISSUES FOR:
  - High complexity functions
  - Significant duplication
  - Architectural smells

POST TO ISSUE:
  ## Code Review
  | Check | Status | Details |
  |-------|--------|---------|
  | Code smells | ⚠️ | 2 minor (acceptable) |
  | Duplication | ✅ | 2.1% |
  | Complexity | ✅ | All functions < 15 |
  | **Score** | **18/20** | |
```

### Gate: /mentor (10 points)

```
TRIGGER: Only when score > 80 (on_first_pass)

RUN: /mentor --json

EVALUATE:
  - No critical concerns? → +10 points
  - Minor concerns? → -2 points each (max -6)
  - Recommendations? → Create issues, no deduction

CREATE ISSUES FOR:
  - Architectural concerns (labeled: tech-debt, architecture)
  - Performance recommendations
  - Scalability concerns

POST TO ISSUE:
  ## Architecture Review
  | Aspect | Status | Notes |
  |--------|--------|-------|
  | Patterns | ✅ | SOLID principles followed |
  | Scalability | ⚠️ | Consider caching → #210 |
  | Security design | ✅ | Auth properly layered |
  | **Score** | **8/10** | |
```

### Gate: /ux (5 points) - Frontend Only

```
APPLIES TO: Issues labeled 'frontend', 'ui', 'component'

RUN: /ux --json

EVALUATE:
  - Accessibility pass? → +2 points
  - Responsive design? → +1 point
  - Consistent styling? → +1 point
  - User flow logical? → +1 point

CREATE ISSUES FOR:
  - Accessibility violations (labeled: a11y)
  - UX improvements (labeled: ux, enhancement)

POST TO ISSUE:
  ## UX Review
  | Check | Status |
  |-------|--------|
  | Accessibility | ✅ WCAG 2.1 AA |
  | Responsive | ✅ |
  | Consistency | ✅ |
  | **Score** | **5/5** |
```

---

## Score Calculation

```
TOTAL = test + security + build + review + mentor + ux + bonus

WHERE:
  test     = (tests_pass ? 20 : 0) + (coverage >= 80 ? 5 : 0)
  security = 25 - (medium_vulns * 1) - (critical_or_high ? 25 : 0)
  build    = build_success ? 15 : 0
  review   = 20 - (smells * 2) - (duplication > 5 ? 5 : 0)
  mentor   = 10 - (concerns * 2)
  ux       = (if frontend) accessibility + responsive + consistency

  bonus    = (coverage > 90 ? 2 : 0) + (zero_smells ? 2 : 0)

TARGET: 95/100

EXIT CONDITIONS:
  - score >= 95 → Create PR, continue to next issue
  - score 85-94 after 10 iterations → Create PR with "needs-review" label
  - score < 85 after max_iterations → BLOCKED, pause for human
  - Any required gate fails after retries → BLOCKED, pause for human
```

---

## Issue Comment Templates

### Progress Update

```markdown
## 🔄 Autonomous Run - Iteration {n}

**Status:** In Progress
**Current Score:** {score}/100 (Target: 95)

| Gate | Score | Status |
|------|-------|--------|
| /test | {test_score}/25 | {status_emoji} |
| /security | {security_score}/25 | {status_emoji} |
| /build | {build_score}/15 | {status_emoji} |
| /review | {review_score}/20 | {status_emoji} |
| /mentor | {mentor_score}/10 | {status_emoji} |

### This Iteration
- {action_taken_1}
- {action_taken_2}

### Next Steps
- {next_action}

---
*Iteration {n}/{max} | Duration: {time}*
```

### Final Summary (Success)

```markdown
## ✅ Autonomous Run Complete

**Final Score:** {score}/100 ✅
**Target:** 95/100
**Iterations:** {n}
**Duration:** {total_time}

### Quality Gates

| Gate | Score | Details |
|------|-------|---------|
| /test | 25/25 | 47 tests, 94% coverage |
| /security | 25/25 | 0 vulnerabilities |
| /build | 15/15 | Build successful |
| /review | 18/20 | 2 minor smells (acceptable) |
| /mentor | 8/10 | 1 recommendation → #{issue_id} |
| **Bonus** | +2 | Coverage > 90% |
| **Total** | **{score}/100** | |

### Auto-fixes Applied
- Fixed {n} issues automatically
- See commits: {commit_list}

### Issues Created
- #{id1}: "{title1}" (security, medium)
- #{id2}: "{title2}" (tech-debt)

### Pull Request
**PR #{pr_id}:** {pr_title}
Ready for human review.

---
*Generated by CodeAssist /autonomous*
```

### Blocked

```markdown
## 🚫 Autonomous Run Blocked

**Current Score:** {score}/100 ❌
**Target:** 95/100
**Reason:** {blocker_reason}

### Blocker Details
{blocker_details}

### What Was Tried
- Iteration 1: {attempt_1}
- Iteration 2: {attempt_2}
- ...

### Human Action Required
{required_action}

**To resume:** Comment `@resume` after addressing the blocker.
**To skip gate:** Comment `@skip-gate {gate} {justification}`

---
*Paused at iteration {n}/{max}*
```

---

## Human Intervention

### Supported Commands (via issue comments)

| Command | Action |
|---------|--------|
| `@claude {instruction}` | Execute instruction, continue loop |
| `@pause` | Pause loop, preserve state |
| `@resume` | Resume paused loop |
| `@skip-gate {gate} {reason}` | Skip gate with justification |
| `@priority high` | Escalate issue priority |
| `@target {score}` | Adjust target score for this issue |

### Example Intervention

```markdown
<!-- User comments on issue -->
@claude Use Redis for session storage instead of JWT tokens

<!-- Bot responds -->
@user Understood. Implementing Redis sessions:

**Changes:**
- Added `redis` dependency
- Created `SessionService` class
- Updated auth middleware
- Removed JWT token generation

Re-running quality gates...
```

---

## Output Format

On completion, post to epic issue:

```markdown
## 🎉 Epic Complete: {epic_title}

**Issues Completed:** {completed}/{total}
**Average Score:** {avg_score}/100
**Total Duration:** {duration}

### Summary

| Issue | Score | PR | Status |
|-------|-------|-----|--------|
| #201 | 96 | #210 | ✅ Merged |
| #202 | 95 | #211 | ✅ Merged |
| #203 | 92 | #212 | 🔍 In Review |

### Technical Debt Created
- #215: "Consider caching" (tech-debt)
- #216: "Rate limiting" (security, medium)

### Metrics
| Metric | Value |
|--------|-------|
| Total commits | {n} |
| Lines added | {added} |
| Lines removed | {removed} |
| Test coverage | {coverage}% |

---
*Generated by CodeAssist /autonomous*
```

---

## Safety Checks

Before each iteration:
- [ ] API rate limit not exceeded
- [ ] Circuit breaker not tripped
- [ ] No forbidden actions queued
- [ ] Branch is up to date with staging/main
- [ ] Not on protected branch (main, master, staging)

Before every commit:
- [ ] No "Co-Authored-By: Claude" or AI attribution
- [ ] Commit message follows format: `type: description`
- [ ] No debug code (console.log, dd(), var_dump)
- [ ] No hardcoded secrets

Before creating PR:
- [ ] All required gates pass
- [ ] Score >= target (or 85+ with needs-review)
- [ ] No uncommitted changes
- [ ] Branch has no conflicts
- [ ] PR targets correct branch (feature → staging, staging → main)

**NEVER:**
- Push directly to `main`, `master`, or `staging`
- Include "Co-Authored-By: Claude" in commits
- Auto-merge PRs (always require human approval)
- Force push
- Modify CI/CD configuration without explicit permission
- Delete protected branches
- Bypass required gates

## Git Workflow Enforcement

```
┌─────────────────────────────────────────────────────────────┐
│ BRANCH FLOW (Strictly Enforced)                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   feature/123-task  ──PR──►  staging  ──PR──►  main         │
│         │                       │               │           │
│     Development              Testing        Production      │
│                                                             │
│   ❌ Direct push to main/staging = BLOCKED                  │
│   ❌ Claude co-author mention = STRIPPED                    │
│   ✓ All merges require PR + review                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Commit Sanitization

Before every commit, automatically strip:
```
- Co-Authored-By: Claude
- Co-Authored-By: Claude <noreply@anthropic.com>
- Generated by Claude
- AI-generated
- Any anthropic.com or openai.com references
```

---

## Execute

Parse arguments and begin autonomous loop:

1. Load config from `.claude/autonomous.yml` (or defaults)
2. Fetch epic/issue from GitHub/GitLab
3. Validate dependencies and prerequisites
4. Start loop for first open issue
5. Post progress to issues
6. Create PRs when gates pass
7. Continue until all issues complete or blocked

Begin autonomous development now.
