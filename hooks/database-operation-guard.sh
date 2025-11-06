#!/bin/bash

# Database Operation Guard Hook
# Intercepts database operations to ensure database-backup skill is used first

set -e

# Get tool call details from arguments
TOOL_NAME="$1"
TOOL_COMMAND="$2"

# Check if this is a database operation
DATABASE_KEYWORDS=("test" "migrate" "seed" "artisan" "pytest" "npm test" "paratest" "alembic" "prisma migrate")

IS_DATABASE_OP=false
for keyword in "${DATABASE_KEYWORDS[@]}"; do
    if [[ "$TOOL_COMMAND" == *"$keyword"* ]]; then
        IS_DATABASE_OP=true
        break
    fi
done

# If not a database operation, allow it
if [ "$IS_DATABASE_OP" = false ]; then
    cat <<EOF
{
  "hookEventName": "PreToolCall",
  "hookName": "database-operation-guard",
  "action": "allow",
  "message": ""
}
EOF
    exit 0
fi

# Check if safe wrapper is being used
SAFE_WRAPPERS=("safe-test.sh" "safe-migrate.sh" "backup-database.sh")

IS_USING_SAFE_WRAPPER=false
for wrapper in "${SAFE_WRAPPERS[@]}"; do
    if [[ "$TOOL_COMMAND" == *"$wrapper"* ]]; then
        IS_USING_SAFE_WRAPPER=true
        break
    fi
done

# If using safe wrapper, allow
if [ "$IS_USING_SAFE_WRAPPER" = true ]; then
    cat <<EOF
{
  "hookEventName": "PreToolCall",
  "hookName": "database-operation-guard",
  "action": "allow",
  "message": "✅ Safe wrapper detected. Proceeding with database operation."
}
EOF
    exit 0
fi

# Dangerous database operation detected without safety wrapper
cat <<EOF
{
  "hookEventName": "PreToolCall",
  "hookName": "database-operation-guard",
  "action": "block",
  "priority": "critical",
  "message": "🚨 BLOCKED: Direct database operation detected without safety wrapper!

Command: $TOOL_COMMAND

This command could modify or wipe the database without backup.

MANDATORY: Use the database-backup skill FIRST.

Safe alternatives:
- For tests: ./scripts/safe-test.sh $TOOL_COMMAND
- For migrations: ./scripts/safe-migrate.sh $TOOL_COMMAND
- Manual backup: ./scripts/backup-database.sh

The database-backup skill is NON-NEGOTIABLE. Production data is irreplaceable.

To proceed:
1. Load and use the database-backup skill from skills/safety/database-backup/SKILL.md
2. Use appropriate safety wrapper script
3. Only then execute the operation

Do NOT bypass this protection. It exists because of real production incidents."
}
EOF
exit 1
