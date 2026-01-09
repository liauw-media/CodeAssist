# Feedback Synthesizer

Aggregate and analyze feedback from multiple sources into actionable insights.

## Synthesis Task
$ARGUMENTS

## Core Philosophy

### Pattern Recognition
- Volume indicates importance
- Emotion reveals urgency
- Repetition confirms validity
- Context determines priority

### Synthesis Targets
| Metric | Target |
|--------|--------|
| Source coverage | 100% of channels |
| Theme accuracy | >95% |
| Sentiment accuracy | >90% |
| Actionability | Every insight has action |

## Feedback Sources

### Internal Sources
```
- Code reviews
- Retrospectives
- 1:1 meetings
- Team surveys
- Bug reports
- Support tickets
```

### External Sources
```
- User interviews
- App store reviews
- Social media
- Customer support
- NPS surveys
- Usage analytics
```

## Analysis Framework

### 1. Collection Phase
```
For each source:
1. Gather raw feedback
2. Normalize format
3. Remove duplicates
4. Tag metadata (date, source, user type)
```

### 2. Categorization
```
Primary Categories:
├── Bugs & Issues
│   ├── Critical (blocking)
│   ├── Major (degraded experience)
│   └── Minor (cosmetic)
├── Feature Requests
│   ├── New functionality
│   ├── Enhancements
│   └── Integrations
├── Usability
│   ├── Confusion points
│   ├── Workflow issues
│   └── Performance
└── Praise
    ├── What's working
    └── Competitive advantages
```

### 3. Sentiment Analysis
```
Scoring Scale:
-2: Very Negative (angry, frustrated)
-1: Negative (disappointed, confused)
 0: Neutral (informational)
+1: Positive (satisfied, pleased)
+2: Very Positive (delighted, advocates)

Indicators:
- Negative: "broken", "terrible", "hate", "waste"
- Positive: "love", "amazing", "finally", "perfect"
- Urgency: "ASAP", "blocking", "critical", "immediately"
```

### 4. Theme Extraction
```
Clustering Approach:
1. Extract keywords from feedback
2. Group similar keywords
3. Name themes based on clusters
4. Calculate theme frequency
5. Rank by impact × frequency
```

## Prioritization Matrix

### Impact vs Frequency
```
                    HIGH FREQUENCY
                         │
        ┌────────────────┼────────────────┐
        │   CONSIDER     │    PRIORITY    │
        │                │    (Do First)  │
LOW     │                │                │ HIGH
IMPACT ─┼────────────────┼────────────────┤ IMPACT
        │   BACKLOG      │    SCHEDULE    │
        │   (Maybe)      │    (Plan It)   │
        │                │                │
        └────────────────┼────────────────┘
                         │
                    LOW FREQUENCY
```

### Scoring Formula
```
Priority Score = (Impact × 3) + (Frequency × 2) + (Sentiment × 1)

Where:
- Impact: 1-5 (business value)
- Frequency: 1-5 (how often mentioned)
- Sentiment: 1-5 (emotional intensity)
```

## Synthesis Techniques

### Affinity Mapping
```
Step 1: Write each feedback on virtual card
Step 2: Group similar cards together
Step 3: Name each group (theme)
Step 4: Identify relationships between groups
Step 5: Prioritize themes
```

### Voice of Customer Table
| Verbatim | Interpreted Need | Priority |
|----------|-----------------|----------|
| "I can't find the export button" | Discoverability | High |
| "This is too slow" | Performance | High |
| "Wish I could customize colors" | Personalization | Medium |

### Jobs-to-be-Done
```
When [situation],
I want to [motivation],
So I can [expected outcome].

Example:
"When I'm reviewing monthly reports,
I want to export to PDF,
So I can share with stakeholders who don't have access."
```

## Reporting Templates

### Executive Summary
```
Key Findings:
1. [Theme] - [X]% of feedback, [sentiment] sentiment
2. [Theme] - [X]% of feedback, [sentiment] sentiment
3. [Theme] - [X]% of feedback, [sentiment] sentiment

Urgent Issues: [X] items requiring immediate attention
Opportunities: [X] feature requests with high demand
Wins: [X] areas receiving positive feedback
```

### Detailed Analysis
```
Theme: [Theme Name]
├── Volume: [X] mentions ([Y]% of total)
├── Sentiment: [score] ([trend])
├── Sources: [list of sources]
├── Sample Quotes:
│   - "[quote 1]"
│   - "[quote 2]"
├── Root Cause: [analysis]
└── Recommendation: [action]
```

## Output Format (MANDATORY)

```
## Feedback Synthesis Report

### Overview
| Metric | Value |
|--------|-------|
| Total Feedback Items | [X] |
| Sources Analyzed | [X] |
| Time Period | [date range] |
| Overall Sentiment | [score] |

### Sentiment Distribution
| Sentiment | Count | Percentage |
|-----------|-------|------------|
| Very Positive | [X] | [X]% |
| Positive | [X] | [X]% |
| Neutral | [X] | [X]% |
| Negative | [X] | [X]% |
| Very Negative | [X] | [X]% |

### Top Themes

**1. [Theme Name]** - Priority: [Critical/High/Medium/Low]
- Volume: [X] mentions ([Y]%)
- Sentiment: [score]
- Key Quotes:
  > "[representative quote]"
  > "[representative quote]"
- Root Cause: [analysis]
- Recommendation: [action item]

**2. [Theme Name]** - Priority: [Critical/High/Medium/Low]
...

### Source Breakdown
| Source | Items | Avg Sentiment | Top Theme |
|--------|-------|---------------|-----------|
| [source] | [X] | [score] | [theme] |

### Urgent Items
| Issue | Frequency | Sentiment | Action |
|-------|-----------|-----------|--------|
| [issue] | [X] | [score] | [fix] |

### Feature Requests
| Request | Demand | Effort | ROI |
|---------|--------|--------|-----|
| [feature] | [X mentions] | [S/M/L] | [High/Med/Low] |

### Wins to Celebrate
- [Positive finding with supporting data]
- [Positive finding with supporting data]

### Recommended Actions
| Priority | Action | Expected Impact | Owner |
|----------|--------|-----------------|-------|
| 1 | [action] | [impact] | [team] |
| 2 | [action] | [impact] | [team] |
| 3 | [action] | [impact] | [team] |

### Trends
[Comparison to previous period, emerging patterns]
```

## When to Use

- Sprint planning input
- Product roadmap decisions
- After user research sessions
- Quarterly reviews
- Post-launch analysis
- Customer success reviews

Begin feedback synthesis now.
