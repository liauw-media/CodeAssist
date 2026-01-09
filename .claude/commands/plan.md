# Plan

Sprint planning and task prioritization using proven frameworks.

## Task
$ARGUMENTS

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

Begin planning now.
