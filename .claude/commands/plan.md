# Plan

Sprint planning and task prioritization using proven frameworks.

## Task
$ARGUMENTS

## Flags

| Flag | Purpose |
|------|---------|
| `--issues` | Create GitHub epic + child issues for autonomous processing |
| `--epic` | Same as --issues |
| `--dry-run` | Show what would be created without actually creating |

## Prioritization Frameworks

### RICE Scoring (for feature prioritization)
```
Score = (Reach × Impact × Confidence) ÷ Effort

Reach:    How many users affected? (1-10)
Impact:   How much value? (0.25=minimal, 0.5=low, 1=medium, 2=high, 3=massive)
Confidence: How sure are we? (100%=high, 80%=medium, 50%=low)
Effort:   Person-days to complete (1-10)
```

### MoSCoW (for scope decisions)
- **Must Have**: Critical path, blocking
- **Should Have**: Important but not blocking
- **Could Have**: Nice to have
- **Won't Have**: Out of scope (this iteration)

## Planning Process

### Step 1: Task Discovery
1. Break down the work into discrete tasks
2. Identify dependencies between tasks
3. Estimate effort for each (use T-shirt sizes: S/M/L/XL)

### Step 2: Prioritize
For each task, consider:
- **Value**: What's the business/user impact?
- **Risk**: What could go wrong?
- **Dependencies**: What blocks this? What does this block?
- **Effort**: How complex is implementation?

### Step 3: Sequence
1. Critical path first (blockers)
2. High-value/low-effort quick wins
3. Dependencies respected
4. Risk mitigation early

### Step 4: Capacity Check
- What's realistic for this sprint/session?
- Buffer 15-20% for unknowns
- Identify scope that should be deferred

## Risk Assessment

For complex tasks, identify:
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [What could go wrong] | High/Med/Low | High/Med/Low | [How to prevent/handle] |

## Output Format (MANDATORY)

```
## Sprint Plan: [Feature/Goal]

### Objective
[1-2 sentence goal statement]

### Tasks (Prioritized)

| # | Task | Priority | Effort | Dependencies | RICE |
|---|------|----------|--------|--------------|------|
| 1 | [task] | Must | S | None | 8.5 |
| 2 | [task] | Must | M | #1 | 6.0 |
| 3 | [task] | Should | L | #1, #2 | 4.2 |

### Critical Path
```
[Task 1] → [Task 2] → [Task 4]
              ↘ [Task 3] (parallel)
```

### Risk Register
| Risk | P×I | Mitigation |
|------|-----|------------|
| [risk] | H×H | [action] |

### Success Criteria
- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]

### Out of Scope (This Sprint)
- [Deferred item]

### Estimated Completion
[X tasks, Y effort units]
Buffer: 15%

---
Does this plan look right? Any adjustments needed?
```

## When to Use

- Sprint planning sessions
- Before starting multi-task work
- Feature prioritization
- Scope negotiation

---

## GitHub Issue Creation (--issues flag)

When `--issues` flag is provided, create GitHub issues after planning.

### Epic Issue Format

```markdown
# Epic: [Feature Name]

## Objective
[1-2 sentence goal statement]

## Child Issues
- [ ] #[ID]: [Task 1 title]
- [ ] #[ID]: [Task 2 title]
- [ ] #[ID]: [Task 3 title]

## Success Criteria
- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]

## Quality Gates
- Target score: 95/100
- Required: /test, /security, /build
- Quality: /review, /mentor

---
*Ready for `/autonomous --epic [NUMBER]` or `/orchestrate --epic [NUMBER] --background`*
```

### Child Issue Format

```markdown
## Description
[What needs to be done]

## Acceptance Criteria
- [ ] [Specific requirement 1]
- [ ] [Specific requirement 2]

## Technical Notes
[Implementation hints, constraints, dependencies]

## Dependencies
- Blocked by: #[ID] (if any)
- Blocks: #[ID] (if any)

---
Labels: `autonomous-ready`, `priority-[must/should/could]`
```

### Issue Creation Commands

```bash
# Create epic
gh issue create --title "Epic: [Feature]" --body "[epic body]" --label "epic"

# Create child issues
gh issue create --title "[Task title]" --body "[task body]" --label "autonomous-ready,priority-must"

# Link child to epic (via task list in epic body)
```

### Output with --issues

```
## Sprint Plan: [Feature]

[... standard plan output ...]

---

## GitHub Issues Created

### Epic
- **#100**: [Feature Name] (epic)
  - URL: https://github.com/owner/repo/issues/100

### Child Issues
| # | Title | Priority | Labels |
|---|-------|----------|--------|
| #101 | [Task 1] | Must | `autonomous-ready` |
| #102 | [Task 2] | Must | `autonomous-ready` |
| #103 | [Task 3] | Should | `autonomous-ready` |

### Next Steps

**Start autonomous development:**
```bash
# Interactive (in this session)
/autonomous --epic 100

# Background (parallel to your work)
/orchestrate --epic 100 --background
```

**Monitor progress:**
- Epic: https://github.com/owner/repo/issues/100
- Notifications: PRs will be created when tasks complete
```

Begin planning now.
