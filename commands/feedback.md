# Feedback

Submit feedback, bug reports, or feature requests.

## Feedback
$ARGUMENTS

## Execute

### Step 1: Get version info

```bash
cat .claude/VERSION 2>/dev/null || echo "VERSION file not found"
```

### Step 2: Determine feedback type

Based on $ARGUMENTS, categorize as:
- **Bug** - Something broken
- **Feature** - New functionality wanted
- **Improvement** - Existing feature could be better

### Step 3: Create issue

Using GitHub CLI:

```bash
gh issue create \
  --repo liauw-media/CodeAssist \
  --title "[TYPE]: [brief title]" \
  --body "[formatted body]"
```

## Issue Templates

### Bug Report
```
## Bug Report

**Version:** [from .claude/VERSION]
**OS:** [Windows/Mac/Linux]

### What happened
[description]

### Expected behavior
[what should happen]

### Steps to reproduce
1. ...
2. ...

### Additional context
[any relevant details]
```

### Feature Request
```
## Feature Request

**Version:** [from .claude/VERSION]

### Problem
[what problem this solves]

### Proposed solution
[how it should work]

### Alternatives
[other approaches considered]
```

## Output Format

```
## Feedback

**Type:** [Bug/Feature/Improvement]
**Version:** [installed version]

### Issue Preview

Title: [TYPE]: [title]

Body:
[formatted issue content]

### Submit

To create this issue:
gh issue create --repo liauw-media/CodeAssist --title "..." --body "..."

Or manually at: https://github.com/liauw-media/CodeAssist/issues/new
```

If `gh` is available and user confirms, create the issue directly.

Process the feedback now.
