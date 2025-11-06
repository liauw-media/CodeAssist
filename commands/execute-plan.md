# Command: /execute-plan

## Description

Thin wrapper command that activates the `executing-plans` skill or deploys the `plan-executor` agent for complex plans.

## Usage

```
/execute-plan
```

Or for complex plans:

```
/execute-plan --agent
```

## What This Command Does

### Simple Mode (Default)
1. Loads the `executing-plans` skill
2. Executes plan one task at a time
3. Verifies each task before proceeding
4. Reports progress

### Agent Mode (--agent flag)
1. Deploys the `plan-executor` agent
2. Agent autonomously executes plan with verification
3. Reports back when complete or blocked

## When to Use

- After `/write-plan` and user approval
- Ready to implement
- Have a written plan with TodoWrite entries

## Example - Simple Mode

**User**: `/execute-plan`

**Response**:
```
I'm using the executing-plans skill to implement this systematically.

Plan has 6 tasks. I'll execute them one at a time with verification.

Marking Task 1 as in_progress: Install and Configure Sanctum

Task 1 Actions:
1. Running: composer require laravel/sanctum
   ✅ Package installed

2. Publishing config...
   ✅ Config published

3. Database backup (MANDATORY)
   I'm using the database-backup skill.
   ✅ Backup created

4. Running migration...
   ✅ Completed

Verifying Task 1:
- Running: php artisan route:list | grep sanctum
- Expected: Sanctum routes visible
- Status: ✅ PASS

Task 1 completed. Moving to Task 2...
```

## Example - Agent Mode

**User**: `/execute-plan --agent`

**Response**:
```
Deploying plan-executor agent for systematic execution.

[Agent launches and begins execution]

Progress Update from Agent:
✅ Task 1: Install Sanctum - Completed
✅ Task 2: Create Controller - Completed
🔄 Task 3: Add Routes - In Progress
⏳ Task 4-6: Pending

[Agent continues until complete or blocked]
```

## Command Implementation

```bash
#!/bin/bash
# Execute plan with or without agent

if [ "$1" == "--agent" ]; then
    echo "Deploying plan-executor agent..."
    # Launch agent with plan context
else
    # Load executing-plans skill
    cat skills/core/executing-plans/SKILL.md
    echo "I'm using the executing-plans skill for systematic execution."
fi
```

## Integration with Workflow

**Typical Flow:**
1. `/brainstorm` - Discuss
2. `/write-plan` - Plan
3. `/execute-plan` - Implement
4. `/code-review` - Review
5. `/verify-complete` - Final checks

## Related Commands

- `/write-plan` - Creates the plan
- `/code-review` - Reviews results
- `/verify-complete` - Final verification

## Related Skills

- `executing-plans` - Core skill
- `database-backup` - Used during execution
- `test-driven-development` - Used for implementation

## Related Agents

- `plan-executor` - Autonomous execution agent
