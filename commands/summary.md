# Executive Summary Generator

Transform complex information into concise, decision-ready summaries for stakeholders.

## Summary Task
$ARGUMENTS

## Core Principles

### Insight Over Information
- Summaries should enable decisions within 3 minutes
- Every finding must include quantified or comparative data
- Strategic implications bolded throughout
- Content ordered by business impact
- Recommendations include owner and expected results

### Quality Standards
- Word count: 325-475 words (500 maximum)
- No assumptions beyond provided data
- Maintain objectivity
- Flag uncertainties explicitly

## Framework: SCQA

Structure summaries using the Situation-Complication-Question-Answer framework:

```
Situation:  [Current state - what's happening]
Complication: [Problem or change - why it matters now]
Question:    [What needs to be decided/understood]
Answer:      [Recommendation or key insight]
```

## Summary Structure

### Section 1: Situation Overview (50-75 words)
- Context and urgency
- Why this matters now
- Who is affected

### Section 2: Key Findings (125-175 words)
- 3-5 insights maximum
- Each with quantified data point
- **Strategic implications bolded**
- Ordered by impact

### Section 3: Business Impact (50-75 words)
- Quantified gains or losses
- Timeframes specified
- Risk if no action taken

### Section 4: Recommendations (75-100 words)
- Prioritized actions
- Owner assigned to each
- Expected outcome stated
- Timeline included

### Section 5: Next Steps (25-50 words)
- Immediate actions (next 48 hours)
- Decision deadlines
- Follow-up schedule

## Data Requirements

Every key finding MUST include at least one:
- Percentage change: "Revenue increased 23%"
- Absolute number: "47 new customers acquired"
- Comparison: "2x faster than previous quarter"
- Ratio: "3:1 customer satisfaction improvement"

**No vague statements.** Replace:
- "Significant improvement" → "34% improvement"
- "Many users affected" → "2,400 users affected"
- "Soon" → "by March 15"

## Formatting Rules

### Bold for Emphasis
- **Strategic implications**
- **Key numbers**
- **Action owners**
- **Deadlines**

### Tables for Comparison
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| [metric] | [value] | [value] | [+/-X%] |

### Bullet Points for Lists
- Keep to 3-5 items
- Front-load important information
- Consistent parallel structure

## Output Format (MANDATORY)

```
## Executive Summary: [Topic]

**Date:** [date]
**Prepared for:** [audience]
**Decision needed by:** [deadline or "For information only"]

---

### Situation
[50-75 words: Context, why now, who's affected]

### Key Findings

1. **[Finding 1]**: [Description with data point]. **Implication: [strategic meaning]**

2. **[Finding 2]**: [Description with data point]. **Implication: [strategic meaning]**

3. **[Finding 3]**: [Description with data point]. **Implication: [strategic meaning]**

### Business Impact

| Impact Area | Quantified Effect | Timeframe |
|-------------|-------------------|-----------|
| [area] | [+/- X% or $X] | [when] |

**Risk if no action:** [quantified consequence]

### Recommendations

| Priority | Action | Owner | Expected Result | By |
|----------|--------|-------|-----------------|-----|
| 1 | [action] | [who] | [outcome] | [date] |
| 2 | [action] | [who] | [outcome] | [date] |
| 3 | [action] | [who] | [outcome] | [date] |

### Next Steps

**Immediate (48 hours):**
- [ ] [Action] - [Owner]

**This week:**
- [ ] [Action] - [Owner]

**Decision required:** [What decision, by whom, by when]

---

*Word count: [X] | Confidence: [High/Medium/Low]*
*Uncertainties: [List any caveats or data gaps]*
```

## Summary Types

### Status Update Summary
Focus: Progress, blockers, timeline
Audience: Sponsors, stakeholders
Frequency: Weekly/bi-weekly

### Decision Summary
Focus: Options, trade-offs, recommendation
Audience: Decision makers
Trigger: When decision needed

### Incident Summary
Focus: What happened, impact, response, prevention
Audience: Leadership, affected parties
Trigger: After incidents

### Project Completion Summary
Focus: Outcomes vs objectives, lessons, next phase
Audience: Sponsors, team
Trigger: Project milestones

## Anti-Patterns to Avoid

- Burying the lead (put most important info first)
- Vague language without data
- Too much background (executives know context)
- Missing recommendations
- No clear next steps
- Exceeding word count

## When to Use

- Stakeholder updates
- Project status reports
- Decision briefs
- Incident post-mortems
- Quarterly reviews
- Board/leadership communications

Generate the executive summary now.
