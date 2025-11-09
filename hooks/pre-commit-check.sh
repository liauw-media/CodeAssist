#!/bin/bash
# Pre-Commit Check Hook
# BLOCKS commits without verification
# Triggered: Before git commit

set -e

# Hook metadata
HOOK_NAME="pre-commit-check"
HOOK_VERSION="3.1.1"

# Files to track verification
VERIFICATION_FILE=".claude/.verification_done"
CODE_REVIEW_FILE=".claude/.code_review_done"

echo ""
echo "🛑 ============================================ 🛑"
echo "   PRE-COMMIT VERIFICATION - BLOCKING"
echo "🛑 ============================================ 🛑"
echo ""

# Check 1: Code Review Done?
echo "📋 Checkpoint 1: Code Review"
if [ -f "$CODE_REVIEW_FILE" ]; then
    REVIEW_TIME=$(cat "$CODE_REVIEW_FILE")
    REVIEW_AGE=$(($(date +%s) - $REVIEW_TIME))
    REVIEW_AGE_MIN=$((REVIEW_AGE / 60))

    if [ $REVIEW_AGE_MIN -lt 60 ]; then
        echo "✅ Code review completed (${REVIEW_AGE_MIN} minutes ago)"
    else
        echo "⚠️  Code review is ${REVIEW_AGE_MIN} minutes old"
        echo "   Consider re-reviewing if significant time passed"
    fi
else
    echo "❌ NO code review found"
    echo ""
    echo "MANDATORY: Use code-review skill first"
    echo "   .claude/skills/core/code-review/SKILL.md"
    echo ""
    echo "After completing review:"
    echo "   date +%s > $CODE_REVIEW_FILE"
    echo ""
    exit 1
fi
echo ""

# Check 2: Verification Done?
echo "📋 Checkpoint 2: Verification Before Completion"
if [ -f "$VERIFICATION_FILE" ]; then
    VERIFY_TIME=$(cat "$VERIFICATION_FILE")
    VERIFY_AGE=$(($(date +%s) - $VERIFY_TIME))
    VERIFY_AGE_MIN=$((VERIFY_AGE / 60))

    if [ $VERIFY_AGE_MIN -lt 30 ]; then
        echo "✅ Verification completed (${VERIFY_AGE_MIN} minutes ago)"
    else
        echo "⚠️  Verification is ${VERIFY_AGE_MIN} minutes old"
        echo "   Consider re-verifying"
    fi
else
    echo "❌ NO verification found"
    echo ""
    echo "MANDATORY: Use verification-before-completion skill"
    echo "   .claude/skills/core/verification-before-completion/SKILL.md"
    echo ""
    echo "After completing verification:"
    echo "   date +%s > $VERIFICATION_FILE"
    echo ""
    exit 1
fi
echo ""

# Check 3: Tests Passed?
echo "📋 Checkpoint 3: Tests Status"

# Check for test results
TEST_RESULTS_FILE=".claude/.test_results"
if [ -f "$TEST_RESULTS_FILE" ]; then
    TEST_STATUS=$(cat "$TEST_RESULTS_FILE")
    if [ "$TEST_STATUS" = "PASSED" ]; then
        echo "✅ Tests passed"
    else
        echo "❌ Tests FAILED"
        echo ""
        echo "BLOCKED: Cannot commit with failing tests"
        echo "   Fix tests first, then retry"
        echo ""
        exit 1
    fi
else
    echo "⚠️  No test results found"
    echo ""
    echo "Did you run tests?"
    echo "   ./scripts/safe-test.sh npm test"
    echo "   ./scripts/safe-test.sh vendor/bin/paratest"
    echo ""
    echo "After tests pass:"
    echo "   echo 'PASSED' > $TEST_RESULTS_FILE"
    echo ""

    # Ask user to confirm
    read -p "Override and commit anyway? (yes/NO): " OVERRIDE
    if [ "$OVERRIDE" != "yes" ]; then
        echo "BLOCKED: Run tests first"
        exit 1
    fi
fi
echo ""

# Check 4: /commit-checklist completed?
echo "📋 Checkpoint 4: Commit Checklist"
CHECKLIST_FILE=".claude/.commit_checklist_done"
if [ -f "$CHECKLIST_FILE" ]; then
    echo "✅ /commit-checklist completed"
else
    echo "⚠️  /commit-checklist not found"
    echo ""
    echo "RECOMMENDED: Run /commit-checklist command"
    echo "   (10-point verification checklist)"
    echo ""
    echo "After completing:"
    echo "   date +%s > $CHECKLIST_FILE"
    echo ""
fi
echo ""

# Check 5: Commit size check
echo "📋 Checkpoint 5: Commit Size"
STAGED_FILES=$(git diff --cached --name-only | wc -l)

if [ $STAGED_FILES -gt 10 ]; then
    echo "⚠️  Large commit detected: $STAGED_FILES files"
    echo ""
    echo "RECOMMENDATION: Small, precise commits"
    echo "   - One logical change per commit"
    echo "   - Makes debugging easier"
    echo "   - Easier code review"
    echo ""
    read -p "Continue with large commit? (yes/NO): " CONTINUE
    if [ "$CONTINUE" != "yes" ]; then
        echo "BLOCKED: Split into smaller commits"
        exit 1
    fi
else
    echo "✅ Commit size OK: $STAGED_FILES files"
fi
echo ""

# Check 6: Commit message quality
echo "📋 Checkpoint 6: Commit Message"
echo ""
echo "Good commit message format:"
echo "   feat(scope): add feature description"
echo "   fix(scope): fix bug description"
echo "   docs: update documentation"
echo ""
echo "Bad:"
echo "   'fix stuff'"
echo "   'update code'"
echo "   'Co-Authored-By: Claude <...>' (FORBIDDEN)"
echo ""

# All checks passed
echo "🛑 ============================================ 🛑"
echo ""
echo "✅ ALL CHECKPOINTS PASSED"
echo ""
echo "You may now commit:"
echo "   git commit -m 'your message here'"
echo ""
echo "Remember: NO AI co-author attribution!"
echo ""
echo "After commit, clean up:"
echo "   rm $CODE_REVIEW_FILE $VERIFICATION_FILE"
echo "   rm .claude/.code_edits_count"
echo "   rm $CHECKLIST_FILE"
echo ""

exit 0
