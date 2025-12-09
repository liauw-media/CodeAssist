# CodeAssist Feedback

Submit feedback, feature requests, or bug reports to the CodeAssist repository.

## Feedback
$ARGUMENTS

## Feedback Protocol

Help users submit feedback to improve CodeAssist.

### Feedback Types

1. **Feature Request** - New functionality you'd like to see
2. **Bug Report** - Something isn't working correctly
3. **Improvement** - Existing feature could be better
4. **Documentation** - Docs are unclear or missing
5. **Agent Request** - New specialized agent needed

### Gather Information

If feedback type is unclear, ask:

1. **What type of feedback?**
   - Feature request
   - Bug report
   - Improvement suggestion
   - Documentation issue
   - New agent request

2. **What's the context?**
   - Which command/agent involved?
   - What were you trying to do?
   - What happened vs what you expected?

### Issue Templates

#### Feature Request
```
## Feature Request: [Title]

### Problem
[What problem does this solve?]

### Proposed Solution
[How should it work?]

### Alternatives Considered
[Other approaches you thought of]

### Additional Context
[Screenshots, examples, etc.]
```

#### Bug Report
```
## Bug Report: [Title]

### Description
[What's broken?]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- OS: [Windows/Mac/Linux]
- Claude Code version: [version]
- CodeAssist version: [version]

### Additional Context
[Logs, screenshots, etc.]
```

#### Agent Request
```
## Agent Request: [Agent Name]

### Purpose
[What would this agent do?]

### When to Deploy
[Triggers/scenarios]

### Skills Required
[Which CodeAssist skills should it use?]

### Example Usage
[How would users invoke it?]
```

### Create GitHub Issue

Once feedback is gathered, create the issue:

```bash
gh issue create \
  --repo liauw-media/CodeAssist \
  --title "[TYPE]: Title" \
  --body "Issue body here" \
  --label "feedback,TYPE"
```

### Output Format

```
## Feedback Submission

### Feedback Type
[Feature/Bug/Improvement/Docs/Agent]

### Summary
[Brief description]

### GitHub Issue

I'll create the following issue:

**Repository**: liauw-media/CodeAssist
**Title**: [TYPE]: [Title]
**Labels**: feedback, [type]

**Body**:
[Formatted issue body]

### Ready to Submit?

To create this issue, I need GitHub CLI (`gh`) authenticated.

If ready, I'll run:
\`\`\`bash
gh issue create --repo liauw-media/CodeAssist --title "..." --body "..."
\`\`\`

[Confirm to proceed or modify the issue first]
```

### After Submission

```
## Issue Created!

**Issue URL**: [URL from gh output]

Thank you for your feedback! The CodeAssist maintainers will review it.

Track your issue: [URL]
```

### Prerequisites

For issue creation to work:
1. GitHub CLI (`gh`) must be installed
2. Must be authenticated: `gh auth login`

If not authenticated:
```
To submit feedback directly, you need GitHub CLI:

1. Install: https://cli.github.com/
2. Authenticate: gh auth login

Or manually create an issue at:
https://github.com/liauw-media/CodeAssist/issues/new
```

Begin gathering feedback now.
