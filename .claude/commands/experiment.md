# Experiment Tracker

A/B testing, feature flags, and data-driven experimentation framework.

## Experiment Task
$ARGUMENTS

## Core Philosophy

### Scientific Method
- Hypothesis before implementation
- Control groups are mandatory
- Statistical significance matters
- Document everything

### Experimentation Targets
| Metric | Target |
|--------|--------|
| Statistical confidence | >95% |
| Sample size accuracy | Proper power analysis |
| Documentation | 100% experiments tracked |
| Learning velocity | Weekly insights |

## Experiment Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│  1. Hypothesis Formation                                │
│     └── What do we believe? Why?                       │
├─────────────────────────────────────────────────────────┤
│  2. Experiment Design                                   │
│     └── Control, variants, metrics, duration           │
├─────────────────────────────────────────────────────────┤
│  3. Implementation                                      │
│     └── Feature flags, tracking, segmentation          │
├─────────────────────────────────────────────────────────┤
│  4. Execution                                           │
│     └── Run experiment, monitor health                 │
├─────────────────────────────────────────────────────────┤
│  5. Analysis                                            │
│     └── Statistical analysis, segment breakdown        │
├─────────────────────────────────────────────────────────┤
│  6. Decision                                            │
│     └── Ship, iterate, or kill                         │
└─────────────────────────────────────────────────────────┘
```

## Hypothesis Template

```
We believe that [change]
for [user segment]
will result in [outcome]
because [rationale].

We will know this is true when we see [metric] change by [X%].
```

### Example
```
We believe that simplifying the checkout form from 5 fields to 3 fields
for mobile users
will result in increased conversion rate
because mobile users abandon long forms.

We will know this is true when we see checkout completion increase by 15%.
```

## Sample Size Calculation

### Formula
```
n = (2 * (Z_α + Z_β)² * σ²) / δ²

Where:
- n = sample size per variant
- Z_α = Z-score for significance level (1.96 for 95%)
- Z_β = Z-score for power (0.84 for 80%)
- σ = standard deviation
- δ = minimum detectable effect
```

### Quick Reference
| Baseline Rate | MDE 5% | MDE 10% | MDE 20% |
|--------------|--------|---------|---------|
| 1% | 31,000 | 7,800 | 2,000 |
| 5% | 6,000 | 1,500 | 400 |
| 10% | 2,800 | 700 | 180 |
| 20% | 1,300 | 330 | 90 |

*Sample size per variant for 95% confidence, 80% power*

## Feature Flag Implementation

### Basic Setup
```typescript
// Feature flag configuration
interface Experiment {
  id: string;
  name: string;
  variants: Variant[];
  allocation: number; // % of traffic
  targeting?: TargetingRule[];
  startDate: Date;
  endDate?: Date;
}

interface Variant {
  id: string;
  name: string;
  weight: number; // % within experiment
}

// Assignment logic
function getVariant(userId: string, experiment: Experiment): Variant {
  const hash = hashUserId(userId, experiment.id);
  const bucket = hash % 100;

  if (bucket >= experiment.allocation) {
    return null; // Not in experiment
  }

  let cumulative = 0;
  for (const variant of experiment.variants) {
    cumulative += variant.weight;
    if (bucket < cumulative) {
      return variant;
    }
  }
}
```

### Usage
```typescript
// In application code
const variant = getVariant(user.id, 'checkout-simplification');

if (variant?.id === 'simplified') {
  return <SimplifiedCheckout />;
} else {
  return <StandardCheckout />;
}

// Track exposure
analytics.track('experiment_exposure', {
  experimentId: 'checkout-simplification',
  variantId: variant?.id || 'control',
  userId: user.id
});
```

## Metrics Framework

### Primary Metrics (OEC)
```
Overall Evaluation Criterion - the ONE metric that determines success

Examples:
- E-commerce: Revenue per visitor
- SaaS: Trial-to-paid conversion
- Social: Daily active users
```

### Guardrail Metrics
```
Metrics that must NOT degrade:
- Page load time
- Error rate
- Support ticket volume
- Customer satisfaction
```

### Secondary Metrics
```
Metrics that provide additional context:
- Click-through rate
- Time on page
- Feature adoption
- Engagement depth
```

## Statistical Analysis

### A/B Test Analysis
```python
from scipy import stats
import numpy as np

def analyze_ab_test(control, treatment):
    """
    Analyze A/B test results for conversion rate
    """
    # Calculate rates
    control_rate = control['conversions'] / control['visitors']
    treatment_rate = treatment['conversions'] / treatment['visitors']

    # Relative lift
    lift = (treatment_rate - control_rate) / control_rate * 100

    # Statistical significance (chi-squared test)
    contingency = [
        [control['conversions'], control['visitors'] - control['conversions']],
        [treatment['conversions'], treatment['visitors'] - treatment['conversions']]
    ]
    chi2, p_value, _, _ = stats.chi2_contingency(contingency)

    # Confidence interval
    se = np.sqrt(
        control_rate * (1 - control_rate) / control['visitors'] +
        treatment_rate * (1 - treatment_rate) / treatment['visitors']
    )
    ci_lower = (treatment_rate - control_rate) - 1.96 * se
    ci_upper = (treatment_rate - control_rate) + 1.96 * se

    return {
        'control_rate': control_rate,
        'treatment_rate': treatment_rate,
        'lift': lift,
        'p_value': p_value,
        'significant': p_value < 0.05,
        'confidence_interval': (ci_lower, ci_upper)
    }
```

### Decision Framework
| p-value | Lift | Decision |
|---------|------|----------|
| < 0.05 | Positive | Ship it |
| < 0.05 | Negative | Kill it |
| > 0.05 | Any | Need more data or iterate |

## Common Pitfalls

### 1. Peeking Problem
```
DON'T: Check results daily and stop when significant
DO: Pre-define sample size and duration, analyze only at end
```

### 2. Multiple Comparisons
```
DON'T: Test 20 metrics and celebrate any p < 0.05
DO: Define primary metric upfront, apply Bonferroni correction for multiple tests
```

### 3. Selection Bias
```
DON'T: Compare users who opted-in vs opted-out
DO: Random assignment before exposure to feature
```

### 4. Novelty Effect
```
DON'T: Conclude after 3 days of elevated metrics
DO: Run long enough for novelty to wear off (usually 2+ weeks)
```

## Output Format (MANDATORY)

```
## Experiment Report: [Experiment Name]

### Hypothesis
We believe that [change]
for [segment]
will result in [outcome]
because [rationale].

### Design
| Parameter | Value |
|-----------|-------|
| Experiment ID | [ID] |
| Status | [Planning/Running/Complete] |
| Start Date | [date] |
| End Date | [date] |
| Traffic Allocation | [X]% |

### Variants
| Variant | Description | Weight |
|---------|-------------|--------|
| Control | [description] | [X]% |
| [Name] | [description] | [X]% |

### Metrics
| Type | Metric | Target |
|------|--------|--------|
| Primary | [metric] | +[X]% |
| Guardrail | [metric] | No degradation |
| Secondary | [metric] | Directional |

### Results

**Sample Size**
| Variant | Users | Conversions | Rate |
|---------|-------|-------------|------|
| Control | [X] | [X] | [X]% |
| Treatment | [X] | [X] | [X]% |

**Statistical Analysis**
| Metric | Control | Treatment | Lift | p-value | Significant |
|--------|---------|-----------|------|---------|-------------|
| [primary] | [X] | [X] | [X]% | [X] | [Yes/No] |

**Confidence Interval:** [X]% to [X]% (95% CI)

### Segment Analysis
| Segment | Control | Treatment | Lift | Notes |
|---------|---------|-----------|------|-------|
| Mobile | [X]% | [X]% | [X]% | [note] |
| Desktop | [X]% | [X]% | [X]% | [note] |

### Decision
**Recommendation:** [Ship / Iterate / Kill]

**Rationale:**
[Explanation of decision based on data]

### Learnings
1. [Key insight]
2. [Key insight]
3. [Key insight]

### Next Steps
- [ ] [Action item]
- [ ] [Action item]
```

## When to Use

- Before launching new features
- Optimizing conversion funnels
- UI/UX improvements
- Pricing experiments
- Algorithm changes
- Performance optimizations

Begin experiment tracking now.
