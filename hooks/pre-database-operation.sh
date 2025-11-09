#!/bin/bash
# Pre-Database Operation Hook
# BLOCKS database operations without backup confirmation
# Triggered: Before migrate, test, seed, db: commands

set -e

# Hook metadata
HOOK_NAME="pre-database-operation"
HOOK_VERSION="3.1.1"

# Check if this is a database operation
is_database_operation() {
    local command="$1"

    # Patterns that indicate database operations
    if echo "$command" | grep -qE "(migrate|artisan test|php artisan test|npm test|npm run test|pytest|seed|db:|mysql|psql|sqlite)"; then
        return 0
    fi

    return 1
}

# Main hook logic
main() {
    # Get the command being executed (passed as argument or from stdin)
    COMMAND="${1:-$(cat)}"

    # Check if this is a database operation
    if ! is_database_operation "$COMMAND"; then
        # Not a database operation, allow
        exit 0
    fi

    # DATABASE OPERATION DETECTED - ENFORCE BACKUP
    echo ""
    echo "🛑 ============================================ 🛑"
    echo "   DATABASE OPERATION DETECTED - BLOCKED"
    echo "🛑 ============================================ 🛑"
    echo ""
    echo "Command: $COMMAND"
    echo ""
    echo "⚠️  MANDATORY: database-backup skill REQUIRED"
    echo ""
    echo "📖 Read the full skill:"
    echo "   .claude/skills/safety/database-backup/SKILL.md"
    echo ""
    echo "✅ Required Actions (choose ONE):"
    echo ""
    echo "1. Create backup NOW:"
    echo "   ./scripts/backup-database.sh"
    echo "   (Then retry your command)"
    echo ""
    echo "2. Use safety wrapper:"
    echo "   ./scripts/safe-test.sh $COMMAND"
    echo "   ./scripts/safe-migrate.sh php artisan migrate"
    echo ""
    echo "3. Override (DANGEROUS - production data is IRREPLACEABLE):"
    echo "   export SKIP_BACKUP_CHECK=1"
    echo "   $COMMAND"
    echo "   (Only use if backup just created)"
    echo ""
    echo "🔴 AUTHORITY: Based on 2 production database wipes"
    echo "   - 2024-03: Tests wiped production (6 months data lost)"
    echo "   - 2024-07: migrate:fresh wiped staging (4 hours recovery)"
    echo ""
    echo "💾 Production data is IRREPLACEABLE. You only get ONE chance."
    echo ""

    # Check if user has override set
    if [ -n "$SKIP_BACKUP_CHECK" ]; then
        echo "⚠️  SKIP_BACKUP_CHECK detected - allowing operation"
        echo "   (Make sure backup exists!)"
        echo ""
        exit 0
    fi

    # Check if recent backup exists
    BACKUP_DIR="./backups"
    if [ -d "$BACKUP_DIR" ]; then
        LATEST_BACKUP=$(find "$BACKUP_DIR" -name "*.sql" -o -name "*.dump" -o -name "*.db" 2>/dev/null | sort | tail -1)

        if [ -n "$LATEST_BACKUP" ]; then
            BACKUP_AGE=$(($(date +%s) - $(stat -c %Y "$LATEST_BACKUP" 2>/dev/null || stat -f %m "$LATEST_BACKUP" 2>/dev/null || echo 0)))
            BACKUP_AGE_HOURS=$((BACKUP_AGE / 3600))

            echo "📊 Latest Backup Status:"
            echo "   File: $LATEST_BACKUP"
            echo "   Age: ${BACKUP_AGE_HOURS} hours ago"
            echo ""

            # If backup is less than 1 hour old, allow
            if [ $BACKUP_AGE_HOURS -lt 1 ]; then
                echo "✅ Recent backup found (< 1 hour old)"
                echo "   Allowing operation to proceed"
                echo ""
                exit 0
            else
                echo "⚠️  Backup is ${BACKUP_AGE_HOURS} hours old"
                echo "   Consider creating fresh backup"
                echo ""
            fi
        fi
    fi

    # BLOCK - no valid backup found
    echo "🛑 OPERATION BLOCKED"
    echo "   Create backup first, then retry"
    echo ""

    exit 1
}

# Run main function
main "$@"
