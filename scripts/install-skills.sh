#!/bin/bash
# install-skills.sh - Install all CodeAssist skills locally
# Usage: ./scripts/install-skills.sh
# Version: 1.0.3

set -e

SKILLS_BASE_URL="https://raw.githubusercontent.com/liauw-media/CodeAssist/main/skills"

echo "Installing CodeAssist Skills..."
echo ""

# Create base directory in .claude/skills (unified location)
mkdir -p .claude/skills

# Fetch skills index
curl -fsSL --retry 2 "$SKILLS_BASE_URL/README.md" -o .claude/skills/README.md 2>/dev/null || true

# Counters
SUCCESS=0
FAILED=0

# Function to fetch skill
fetch_skill() {
    local path=$1
    mkdir -p ".claude/skills/$(dirname "$path")"
    if curl -fsSL --retry 2 --retry-delay 1 "$SKILLS_BASE_URL/$path" -o ".claude/skills/$path" 2>/dev/null; then
        ((SUCCESS++))
    else
        ((FAILED++))
        echo "  Failed: $path"
    fi
}

# Core skills
fetch_skill "using-skills/SKILL.md"
fetch_skill "core/brainstorming/SKILL.md"
fetch_skill "core/writing-plans/SKILL.md"
fetch_skill "core/executing-plans/SKILL.md"
fetch_skill "core/code-review/SKILL.md"
fetch_skill "core/requesting-code-review/SKILL.md"
fetch_skill "core/receiving-code-review/SKILL.md"
fetch_skill "core/verification-before-completion/SKILL.md"

# Safety skills
fetch_skill "safety/database-backup/SKILL.md"
fetch_skill "safety/defense-in-depth/SKILL.md"
fetch_skill "safety/pre-commit-hooks/SKILL.md"

# Testing skills
fetch_skill "testing/test-driven-development/SKILL.md"
fetch_skill "testing/condition-based-waiting/SKILL.md"
fetch_skill "testing/testing-anti-patterns/SKILL.md"
fetch_skill "testing/playwright-frontend-testing/SKILL.md"
fetch_skill "testing/lighthouse-performance-optimization/SKILL.md"

# Debugging skills
fetch_skill "debugging/systematic-debugging/SKILL.md"
fetch_skill "debugging/root-cause-tracing/SKILL.md"
fetch_skill "debugging/browser-automation-debugging/SKILL.md"

# Workflow skills
fetch_skill "workflow/git-platform-cli/SKILL.md"
fetch_skill "workflow/git-workflow/SKILL.md"
fetch_skill "workflow/git-worktrees/SKILL.md"
fetch_skill "workflow/dispatching-parallel-agents/SKILL.md"
fetch_skill "workflow/finishing-a-development-branch/SKILL.md"
fetch_skill "workflow/subagent-driven-development/SKILL.md"
fetch_skill "workflow/remote-code-agents/SKILL.md"

# Design skills
fetch_skill "design/brand-guidelines/SKILL.md"
fetch_skill "design/frontend-design/SKILL.md"

# Meta skills
fetch_skill "meta/writing-skills/SKILL.md"
fetch_skill "meta/writing-skills/anthropic-best-practices.md"
fetch_skill "meta/writing-skills/persuasion-principles.md"
fetch_skill "meta/testing-skills-with-subagents/SKILL.md"
fetch_skill "meta/sharing-skills/SKILL.md"

# Summary
echo ""
if [ $FAILED -gt 0 ]; then
    echo "${SUCCESS} skills installed, ${FAILED} failed"
    echo "Re-run to retry failed downloads"
else
    echo "${SUCCESS} skills installed"
fi
