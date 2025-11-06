# Command: /brainstorm

## Description

Thin wrapper command that activates the `brainstorming` skill.

## Usage

```
/brainstorm
```

Or with context:

```
/brainstorm [feature description]
```

## What This Command Does

1. Loads the `brainstorming` skill from `skills/core/brainstorming/SKILL.md`
2. Activates brainstorming protocol
3. Guides through: Clarify → Present Options → Discuss Trade-offs → Get Approval

## When to Use

- Starting a new feature
- Major architectural changes
- Unclear or ambiguous requirements
- Multiple possible approaches
- Before writing any code

## Example

**User**: `/brainstorm authentication`

**Response**:
```
I'm using the brainstorming skill to discuss authentication approach.

I understand you want to add authentication to the application.

Before I start, let me clarify:
- Do you need social login (Google, GitHub) or email/password?
- Should this be stateless (JWT) or session-based?
- Do you need role-based permissions?

I see a few approaches:

[Options presented with pros/cons]

My recommendation: [Suggested approach with reasoning]

Does this make sense? Any concerns or changes?
```

## Command Implementation

This command simply ensures the brainstorming skill is loaded and activated:

```bash
#!/bin/bash
# Load brainstorming skill
cat skills/core/brainstorming/SKILL.md

echo "I'm using the brainstorming skill to discuss the approach."
```

## Integration with Workflow

**Typical Flow:**
1. User: `/brainstorm [feature]`
2. Agent: Uses brainstorming skill
3. User: Approves approach
4. Agent: `/write-plan` to create implementation plan
5. Agent: `/execute-plan` to implement

## Related Commands

- `/write-plan` - Create plan after brainstorming
- `/execute-plan` - Execute the plan
- `/code-review` - Review completed work

## Related Skills

- `brainstorming` - Core skill this command activates
- `writing-plans` - Next step after brainstorming
