#!/bin/bash

# Safe Test Runner
# Creates a database backup before running tests
#
# Usage: ./scripts/safe-test.sh [test command]
#
# Examples:
#   ./scripts/safe-test.sh npm test
#   ./scripts/safe-test.sh php artisan test
#   ./scripts/safe-test.sh pytest
#   ./scripts/safe-test.sh vendor/bin/pest

set -e

if [ -z "$1" ]; then
    echo "Usage: ./scripts/safe-test.sh [test command]"
    echo ""
    echo "Examples:"
    echo "  ./scripts/safe-test.sh npm test"
    echo "  ./scripts/safe-test.sh php artisan test"
    echo "  ./scripts/safe-test.sh pytest"
    exit 1
fi

echo "Safe Test Runner"
echo "================"
echo ""

# Create backup first
echo "Step 1: Creating database backup"
if ./scripts/backup-database.sh; then
    echo ""
else
    echo ""
    echo "Backup failed. Not running tests."
    exit 1
fi

# Run the test command
echo "Step 2: Running tests"
echo "Command: $@"
echo ""

"$@"
TEST_EXIT=$?

echo ""
if [ $TEST_EXIT -eq 0 ]; then
    echo "Tests passed"
else
    echo "Tests failed (exit code: $TEST_EXIT)"
    echo ""
    echo "To restore database from backup:"
    echo "  ./scripts/restore-database.sh --latest"
fi

exit $TEST_EXIT
