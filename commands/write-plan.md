# Command: /write-plan

## Description

Thin wrapper command that activates the `writing-plans` skill.

## Usage

```
/write-plan
```

Or with context:

```
/write-plan [feature description]
```

## What This Command Does

1. Loads the `writing-plans` skill from `skills/core/writing-plans/SKILL.md`
2. Activates planning protocol
3. Breaks work into discrete, actionable tasks
4. Identifies dependencies
5. Creates TodoWrite entries
6. Gets user approval

## When to Use

- After completing `/brainstorm` and getting user approval
- Before implementation begins
- Task has 3+ steps
- Work involves multiple files/systems
- Dependencies between tasks exist

## Example

**User**: `/write-plan`

**Response**:
```
I'm using the writing-plans skill to create a detailed implementation plan.

# Implementation Plan: User Authentication

## Overview
Goal: Add token-based authentication with social OAuth
Approach: Laravel Sanctum + Clerk
Estimated tasks: 6
Estimated time: 60-90 minutes

## Tasks

### Task 1: Install and Configure Sanctum
Purpose: Add Sanctum package
Complexity: Simple
Actions:
1. composer require laravel/sanctum
2. Publish config
3. Run migration (with backup!)
Files affected: composer.json, config/sanctum.php
Verification: Routes show in artisan route:list
Dependencies: None

[... more tasks ...]

Does this plan make sense? Any tasks to add, remove, or change?
```

## Command Implementation

```bash
#!/bin/bash
# Load writing-plans skill
cat skills/core/writing-plans/SKILL.md

echo "I'm using the writing-plans skill to break this down into actionable tasks."
```

## Integration with Workflow

**Typical Flow:**
1. `/brainstorm` - Discuss approach
2. User approves approach
3. `/write-plan` - Create detailed plan
4. User approves plan
5. `/execute-plan` - Implement systematically

## Related Commands

- `/brainstorm` - Precedes planning
- `/execute-plan` - Executes the plan
- `/code-review` - Reviews completed work

## Related Skills

- `writing-plans` - Core skill this command activates
- `brainstorming` - Comes before planning
- `executing-plans` - Comes after planning
