#!/bin/bash

# ============================================
# CodeAssist Installation Script
# Version 1.0.4
# ============================================
#
# An assistant library for Claude Code
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
#
# ============================================

set -e

VERSION="1.0.4"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo "CodeAssist Installation - v${VERSION}"
echo "======================================"
echo ""

BASE_URL="https://raw.githubusercontent.com/liauw-media/CodeAssist/main"

# ============================================
# Step 1: Clean up old installation
# ============================================
echo -e "${CYAN}[1/7] Cleaning up old installation...${NC}"

if [ -d ".claude/skills" ]; then
    rm -rf .claude/skills
    echo -e "${GREEN}  Removed old skills${NC}"
else
    echo -e "${GREEN}  No old skills to remove${NC}"
fi

if [ -d ".claude/commands" ]; then
    rm -rf .claude/commands
    echo -e "${GREEN}  Removed old commands${NC}"
else
    echo -e "${GREEN}  No old commands to remove${NC}"
fi
echo ""

# ============================================
# Step 2: Create directories
# ============================================
echo -e "${CYAN}[2/7] Creating directories...${NC}"

mkdir -p .claude/commands
mkdir -p .claude/skills

echo -e "${GREEN}  Done${NC}"
echo ""

# ============================================
# Step 3: Install Skills
# ============================================
echo -e "${CYAN}[3/7] Installing skills...${NC}"

if curl -fsSL "${BASE_URL}/scripts/install-skills.sh" -o "/tmp/install-skills.sh" 2>/dev/null; then
    chmod +x /tmp/install-skills.sh
    bash /tmp/install-skills.sh > /dev/null 2>&1 || true
    SKILLS_COUNT=$(find .claude/skills -name "SKILL.md" 2>/dev/null | wc -l)
    echo -e "${GREEN}  ${SKILLS_COUNT} skills installed${NC}"
else
    echo -e "${YELLOW}  Skipped (network issue)${NC}"
fi
echo ""

# ============================================
# Step 4: Install Slash Commands
# ============================================
echo -e "${CYAN}[4/7] Installing commands...${NC}"

COMMANDS=(
    "guide.md"
    "mentor.md"
    "feedback.md"
    "status.md"
    "review.md"
    "test.md"
    "backup.md"
    "commit.md"
    "update.md"
    "brainstorm.md"
    "plan.md"
    "verify.md"
    "laravel.md"
    "php.md"
    "react.md"
    "python.md"
    "db.md"
    "security.md"
    "docs.md"
    "refactor.md"
    "explore.md"
    "research.md"
    "agent-select.md"
    "orchestrate.md"
)

CMD_SUCCESS=0
CMD_FAILED=0
for cmd in "${COMMANDS[@]}"; do
    if curl -fsSL --retry 2 --retry-delay 1 "${BASE_URL}/commands/${cmd}" -o ".claude/commands/${cmd}" 2>/dev/null; then
        ((CMD_SUCCESS++))
    else
        ((CMD_FAILED++))
        echo -e "${YELLOW}  Failed: ${cmd}${NC}"
    fi
done

if [ $CMD_FAILED -gt 0 ]; then
    echo -e "${YELLOW}  ${CMD_SUCCESS} commands installed, ${CMD_FAILED} failed${NC}"
    echo -e "${YELLOW}  Re-run the install script to retry failed downloads${NC}"
else
    echo -e "${GREEN}  ${CMD_SUCCESS} commands installed${NC}"
fi
echo ""

# ============================================
# Step 5: Install CLAUDE.md
# ============================================
echo -e "${CYAN}[5/7] Installing configuration...${NC}"

if curl -fsSL "${BASE_URL}/.claude/CLAUDE.md" -o ".claude/CLAUDE.md" 2>/dev/null; then
    echo -e "${GREEN}  CLAUDE.md installed${NC}"
fi
echo ""

# ============================================
# Step 6: Create VERSION file
# ============================================
echo -e "${CYAN}[6/7] Creating version file...${NC}"

echo "${VERSION}" > .claude/VERSION
echo -e "${GREEN}  Version ${VERSION}${NC}"
echo ""

# ============================================
# Step 7: .gitignore reminder
# ============================================
echo -e "${CYAN}[7/7] Checking .gitignore...${NC}"

if [ -f .gitignore ]; then
    if grep -q "^\.claude/" .gitignore 2>/dev/null; then
        echo -e "${GREEN}  .claude/ already in .gitignore${NC}"
    else
        echo -e "${YELLOW}  Add .claude/ to .gitignore:${NC}"
        echo -e "${YELLOW}  echo \".claude/\" >> .gitignore${NC}"
    fi
else
    echo -e "${YELLOW}  Create .gitignore with:${NC}"
    echo -e "${YELLOW}  echo \".claude/\" >> .gitignore${NC}"
fi
echo ""

# ============================================
# Summary
# ============================================
echo "======================================"
echo "Installation Complete"
echo "======================================"
echo ""
echo "Installed:"
echo "  - ${SKILLS_COUNT:-31} skills"
echo "  - ${CMD_SUCCESS} commands"
echo "  - VERSION ${VERSION}"
echo ""
echo "Action commands:"
echo "  /status   - Show git status"
echo "  /review   - Code review"
echo "  /test     - Run tests with backup"
echo "  /backup   - Database backup"
echo "  /commit   - Pre-commit check + commit"
echo ""
echo "Other commands:"
echo "  /mentor   - Critical analysis"
echo "  /feedback - Submit feedback"
echo "  /guide    - Get help"
echo ""
echo -e "${YELLOW}Important: Add .claude/ to .gitignore${NC}"
echo ""
echo "Restart Claude Code to activate."
echo ""
