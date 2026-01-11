#!/bin/bash

# ============================================
# playwright-post-test.sh - Run after Playwright tests
# ============================================
#
# Wrapper that runs tests and syncs results to NAS.
#
# Usage:
#   ./scripts/playwright-post-test.sh                    # Run all tests
#   ./scripts/playwright-post-test.sh --headed           # Run headed
#   ./scripts/playwright-post-test.sh tests/login.spec   # Run specific test
#
# This script:
#   1. Runs Playwright tests with trace enabled
#   2. Syncs results to NAS (if configured)
#   3. Outputs link to view results
#
# ============================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Playwright Test Runner"
echo "======================"
echo ""

# Check for playwright
if [ ! -f "playwright.config.ts" ] && [ ! -f "playwright.config.js" ]; then
    echo -e "${YELLOW}Warning: No playwright.config found in current directory${NC}"
fi

# Build test command with sensible defaults
TEST_ARGS="$@"

# Add trace if not specified
if [[ ! "$TEST_ARGS" =~ "--trace" ]]; then
    TEST_ARGS="$TEST_ARGS --trace=retain-on-failure"
fi

# Run tests
echo -e "Running: ${BLUE}npx playwright test $TEST_ARGS${NC}"
echo ""

EXIT_CODE=0
npx playwright test $TEST_ARGS || EXIT_CODE=$?

echo ""

# Report results
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
else
    echo -e "${RED}Some tests failed (exit code: $EXIT_CODE)${NC}"
fi

# Sync to NAS if configured
echo ""
if [ -f "$SCRIPT_DIR/playwright-report-sync.sh" ]; then
    # Check if NAS is configured
    if [ -n "$PLAYWRIGHT_NAS_HOST" ] || [ -f ".playwright-report.env" ] || [ -f "$HOME/.playwright-report.env" ]; then
        echo "Syncing results to NAS..."
        "$SCRIPT_DIR/playwright-report-sync.sh" || {
            echo -e "${YELLOW}Warning: Could not sync to NAS${NC}"
        }
    else
        echo -e "${YELLOW}NAS not configured. View results locally:${NC}"
        echo "  npx playwright show-report"
        echo ""
        echo "To enable remote viewing, configure NAS sync:"
        echo "  cp scripts/playwright-report.env.example .playwright-report.env"
        echo "  # Edit .playwright-report.env with your NAS details"
    fi
else
    echo "View results locally:"
    echo "  npx playwright show-report"
fi

exit $EXIT_CODE
