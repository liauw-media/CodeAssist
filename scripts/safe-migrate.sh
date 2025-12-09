#!/bin/bash

# Safe Migration Runner
# Creates a database backup before running migrations
#
# Usage: ./scripts/safe-migrate.sh [migration command]
#
# Examples:
#   ./scripts/safe-migrate.sh php artisan migrate
#   ./scripts/safe-migrate.sh npx prisma migrate deploy
#   ./scripts/safe-migrate.sh python manage.py migrate
#   ./scripts/safe-migrate.sh alembic upgrade head

set -e

if [ -z "$1" ]; then
    echo "Usage: ./scripts/safe-migrate.sh [migration command]"
    echo ""
    echo "Examples:"
    echo "  ./scripts/safe-migrate.sh php artisan migrate"
    echo "  ./scripts/safe-migrate.sh npx prisma migrate deploy"
    echo "  ./scripts/safe-migrate.sh python manage.py migrate"
    exit 1
fi

echo "Safe Migration Runner"
echo "====================="
echo ""

# Create backup first
echo "Step 1: Creating database backup"
if ./scripts/backup-database.sh; then
    echo ""
else
    echo ""
    echo "Backup failed. Not running migration."
    exit 1
fi

# Run the migration command
echo "Step 2: Running migration"
echo "Command: $@"
echo ""

"$@"
MIGRATE_EXIT=$?

echo ""
if [ $MIGRATE_EXIT -eq 0 ]; then
    echo "Migration completed successfully"
else
    echo "Migration failed (exit code: $MIGRATE_EXIT)"
    echo ""
    echo "To restore database from backup:"
    echo "  ./scripts/restore-database.sh --latest"
fi

exit $MIGRATE_EXIT
