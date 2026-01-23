# UX Architect

UX evaluation, accessibility auditing, and design system architecture.

## UX Task
$ARGUMENTS

## Protocol

1. **Analyze**: Evaluate UX using heuristics and user flow analysis
2. **Audit**: Run accessibility tools (Lighthouse MCP if available)
3. **Design**: Create or review design system foundations
4. **Verify**: Confirm accessibility compliance
5. **Report**: Document findings with actionable fixes

---

## PHASE 1: UX Evaluation (MANDATORY)

### Nielsen's 10 Usability Heuristics

Evaluate the interface against each heuristic:

| # | Heuristic | Check | Status |
|---|-----------|-------|--------|
| 1 | **Visibility of system status** | Does UI show loading states, progress, confirmations? | |
| 2 | **Match between system and real world** | Uses familiar language, logical order? | |
| 3 | **User control and freedom** | Easy undo, cancel, back navigation? | |
| 4 | **Consistency and standards** | Follows platform conventions? | |
| 5 | **Error prevention** | Validates before submission, confirms destructive actions? | |
| 6 | **Recognition rather than recall** | Options visible, no memory burden? | |
| 7 | **Flexibility and efficiency** | Shortcuts for experts, customization? | |
| 8 | **Aesthetic and minimalist design** | No irrelevant information, clean layout? | |
| 9 | **Help users recognize and recover from errors** | Clear error messages with solutions? | |
| 10 | **Help and documentation** | Easy to search, task-focused help? | |

### User Flow Analysis

For each critical flow, document:

```
## User Flow: [Name]

### Goal
What is the user trying to accomplish?

### Steps
1. [Entry point]
2. [Action] → [System response]
3. [Action] → [System response]
4. [Success state]

### Friction Points
- Step X: [Problem] → [Fix]

### Drop-off Risks
- [Where users might abandon and why]
```

### Information Architecture Check

```bash
# Find all routes/pages
grep -rn "path.*:" . --include="*.tsx" --include="*.vue" --include="*.php" | head -30

# Check navigation structure
grep -rn "nav\|menu\|sidebar" . --include="*.tsx" --include="*.vue" | head -20
```

---

## PHASE 2: Accessibility Audit (MANDATORY)

### Run Lighthouse (if MCP available)

Use the Lighthouse MCP to run accessibility audit:

```
mcp__lighthouse__run_audit with:
- url: [target URL]
- categories: ["accessibility"]
- device: "mobile" (then "desktop")
```

**If Lighthouse MCP not available**, use CLI:

```bash
# Run Lighthouse accessibility audit
npx lighthouse [URL] --only-categories=accessibility --output=json --output-path=./lighthouse-a11y.json

# Quick summary
npx lighthouse [URL] --only-categories=accessibility --output=html
```

### WCAG 2.1 AA Checklist

| Category | Requirement | Test Method | Status |
|----------|-------------|-------------|--------|
| **Perceivable** | | | |
| 1.1.1 | Non-text content has text alternatives | Check all images for alt text | |
| 1.3.1 | Info and relationships programmatically determined | Check semantic HTML, ARIA | |
| 1.4.3 | Contrast ratio 4.5:1 (text), 3:1 (large text) | Use contrast checker | |
| 1.4.11 | Non-text contrast 3:1 | Check UI components, icons | |
| **Operable** | | | |
| 2.1.1 | Keyboard accessible | Tab through all interactive elements | |
| 2.1.2 | No keyboard trap | Verify can tab away from all elements | |
| 2.4.3 | Focus order logical | Check tab order matches visual order | |
| 2.4.7 | Focus visible | Verify focus indicator on all elements | |
| **Understandable** | | | |
| 3.1.1 | Language of page set | Check `<html lang="">` | |
| 3.2.1 | No unexpected context change on focus | | |
| 3.3.1 | Error identification | Check form error messages | |
| 3.3.2 | Labels or instructions | Check all form inputs have labels | |
| **Robust** | | | |
| 4.1.1 | Valid HTML | Run HTML validator | |
| 4.1.2 | Name, role, value | Check ARIA attributes | |

### Manual Accessibility Tests

```bash
# Check for missing alt text
grep -rn "<img" . --include="*.html" --include="*.tsx" --include="*.vue" | grep -v "alt=" | head -20

# Check for missing form labels
grep -rn "<input" . --include="*.html" --include="*.tsx" --include="*.vue" | grep -v "label\|aria-label" | head -20

# Check for color contrast (requires tool)
# Use: https://webaim.org/resources/contrastchecker/
```

---

## PHASE 3: Design System Foundation

### Core Philosophy
- Create scalable CSS architecture before implementation
- Design systems, not just screens
- Mobile-first responsive approach
- Accessible color contrast (verified in Phase 2)

### Every Project Needs
- Light/dark/system theme toggle
- Consistent spacing and typography scales
- Accessible color contrast (4.5:1 minimum)

## Design System Foundation

### 1. Design Tokens

```css
/* Color Palette */
:root {
  /* Primary */
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;

  /* Neutral */
  --color-gray-50: #f9fafb;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;

  /* Semantic */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Theme-aware */
  --bg-primary: var(--color-gray-50);
  --bg-secondary: white;
  --text-primary: var(--color-gray-900);
  --text-secondary: var(--color-gray-500);
}

[data-theme="dark"] {
  --bg-primary: var(--color-gray-900);
  --bg-secondary: #1f2937;
  --text-primary: var(--color-gray-50);
  --text-secondary: var(--color-gray-400);
}
```

### 2. Typography Scale

```css
/* Type Scale (1.25 ratio) */
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */

  /* Line heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Font weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### 3. Spacing Scale

```css
/* Spacing (4px base unit) */
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

### 4. Layout Containers

```css
/* Container widths */
:root {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
}

/* Breakpoints */
/* sm: 640px, md: 768px, lg: 1024px, xl: 1280px */
```

## Component Architecture

### Component Hierarchy

```
Page Layout
├── Header (fixed/sticky)
├── Main Content
│   ├── Sidebar (optional)
│   └── Content Area
│       ├── Section
│       │   ├── Card/Panel
│       │   │   ├── Header
│       │   │   ├── Body
│       │   │   └── Footer
│       │   └── Form
│       │       ├── Field Group
│       │       └── Actions
│       └── Data Display
│           ├── Table
│           └── List
└── Footer
```

### Component Patterns

```css
/* Card Pattern */
.card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

/* Button Pattern */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-4);
  font-weight: var(--font-medium);
  border-radius: var(--radius-md);
  transition: all 150ms ease;
}

.btn-primary {
  background: var(--color-primary-500);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-600);
}
```

## Responsive Strategy

### Mobile-First Breakpoints

```css
/* Base: Mobile (< 640px) */
.component { /* mobile styles */ }

/* Tablet (>= 640px) */
@media (min-width: 640px) {
  .component { /* tablet adjustments */ }
}

/* Desktop (>= 1024px) */
@media (min-width: 1024px) {
  .component { /* desktop adjustments */ }
}
```

### Common Patterns

| Pattern | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Navigation | Hamburger | Collapsed | Full |
| Grid | 1 col | 2 col | 3-4 col |
| Sidebar | Hidden/drawer | Collapsed | Expanded |
| Typography | Smaller | Base | Larger |

## Theme Implementation

### Theme Toggle

```javascript
// Theme detection and toggle
function initTheme() {
  const stored = localStorage.getItem('theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = stored || system;
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}
```

### Theme-Aware Components

```css
/* Component that adapts to theme */
.panel {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

/* No need for separate dark mode rules - tokens handle it */
```

## Accessibility Checklist

- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Focus states visible on all interactive elements
- [ ] Touch targets minimum 44x44px on mobile
- [ ] Semantic HTML structure
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Reduced motion support

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Output Format (MANDATORY)

```
## UX Review: [Scope]

### Executive Summary
- **UX Score**: [X/10]
- **Accessibility Score**: [Lighthouse score or manual assessment]
- **Heuristic Violations**: [count by severity]
- **Recommendation**: [PASS | NEEDS WORK | BLOCKED]

### Phase 1: UX Evaluation

#### Heuristic Assessment
| Heuristic | Score | Issues |
|-----------|-------|--------|
| H1 Visibility of status | [1-5] | [issues found] |
| H2 Real world match | [1-5] | [issues found] |
| ... | ... | ... |

#### User Flow Issues
| Flow | Friction Points | Severity |
|------|-----------------|----------|
| [flow name] | [issues] | [HIGH/MED/LOW] |

### Phase 2: Accessibility Audit

#### Lighthouse Results (if available)
| Category | Score | Issues |
|----------|-------|--------|
| Accessibility | [0-100] | [count] |

#### WCAG Compliance
| Level | Status | Details |
|-------|--------|---------|
| A | [PASS/FAIL] | [issues] |
| AA | [PASS/FAIL] | [issues] |

#### Critical A11y Issues
| Issue | Location | WCAG | Fix |
|-------|----------|------|-----|
| [desc] | [file:line] | [criterion] | [solution] |

### Phase 3: Design System

#### Tokens Defined
| Category | Status |
|----------|--------|
| Colors | [YES/NO] |
| Typography | [YES/NO] |
| Spacing | [YES/NO] |
| Breakpoints | [YES/NO] |

### Recommendations
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]
```

---

## JSON Output (for /autonomous integration)

```json
{
  "gate": "ux",
  "score": 5,
  "max_score": 5,
  "passed": true,
  "details": {
    "ux_score": 8,
    "accessibility_score": 92,
    "lighthouse_used": true,
    "heuristic_violations": {
      "critical": 0,
      "major": 1,
      "minor": 3
    },
    "wcag_compliance": {
      "level_a": "PASS",
      "level_aa": "PASS"
    }
  },
  "thresholds": {
    "min_accessibility_score": 80,
    "max_critical_violations": 0
  },
  "issues": [
    {
      "id": "UX-001",
      "severity": "major",
      "category": "heuristic",
      "heuristic": "H5_error_prevention",
      "title": "No confirmation on delete action",
      "location": "components/UserList.tsx:45",
      "description": "Delete button has no confirmation dialog",
      "recommendation": "Add confirmation modal before destructive action",
      "auto_fixable": false
    },
    {
      "id": "A11Y-001",
      "severity": "minor",
      "category": "accessibility",
      "wcag": "1.1.1",
      "title": "Missing alt text on image",
      "location": "components/Avatar.tsx:12",
      "description": "Image element missing alt attribute",
      "recommendation": "Add descriptive alt text",
      "auto_fixable": true
    }
  ]
}
```

---

## Issue Comment Format (for --post-to-issue)

```markdown
## UX Review

| Category | Score | Status |
|----------|-------|--------|
| UX Heuristics | 8/10 | PASS |
| Accessibility | 92/100 | PASS |
| Design System | Complete | PASS |
| **Score** | **5/5** | PASS |

### Heuristic Issues
- H5: No delete confirmation (major)
- H9: Error messages unclear (minor)

### Accessibility Issues
- 1 missing alt text (auto-fixed)
- 2 low contrast warnings

### WCAG: Level AA compliant

---
*Run by /autonomous*
```

## When to Use

- UX evaluation of existing interfaces
- Accessibility audits (WCAG compliance)
- Design system creation or review
- Before launching new features
- After user feedback indicates UX issues
- Periodic accessibility compliance checks

Begin UX architecture work now.
