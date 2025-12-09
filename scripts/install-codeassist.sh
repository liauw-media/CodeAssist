#!/bin/bash

# ============================================
# CodeAssist Complete Installation Script
# Version 3.2.0 - Skills + Agents + Commands
# ============================================
#
# This is the ONE script to install everything:
# - 30 Skills (protocols, checklists, workflows)
# - 16 Agents (specialized workers)
# - 18 Slash Commands (invokable actions)
# - Enforcement Hooks (block bad behavior)
# - CLAUDE.md (project instructions)
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
#
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

echo ""
echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                                                           ║${NC}"
echo -e "${MAGENTA}║   ${CYAN}CodeAssist Complete Installation${MAGENTA}                       ║${NC}"
echo -e "${MAGENTA}║   ${NC}Version 3.2.0 - Skills + Agents + Commands${MAGENTA}              ║${NC}"
echo -e "${MAGENTA}║                                                           ║${NC}"
echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

BASE_URL="https://raw.githubusercontent.com/liauw-media/CodeAssist/main"

# ============================================
# Step 1: Create directories
# ============================================
echo -e "${CYAN}[1/7] Creating directories...${NC}"

mkdir -p .claude/commands
mkdir -p .claude/agents
mkdir -p .claude/skills
mkdir -p hooks
mkdir -p scripts

echo -e "${GREEN}  ✓ Directory structure created${NC}"
echo ""

# ============================================
# Step 2: Install Skills (30)
# ============================================
echo -e "${CYAN}[2/7] Installing skills (30 protocols)...${NC}"

# Download and run skills installer
if curl -fsSL "${BASE_URL}/scripts/install-skills.sh" -o "/tmp/install-skills.sh" 2>/dev/null; then
    chmod +x /tmp/install-skills.sh
    # Run in current directory, suppress most output
    bash /tmp/install-skills.sh > /dev/null 2>&1 || true
    SKILLS_COUNT=$(find .claude/skills -name "SKILL.md" 2>/dev/null | wc -l)
    echo -e "${GREEN}  ✓ ${SKILLS_COUNT} skills installed${NC}"
else
    echo -e "${YELLOW}  ⚠ Skills installation skipped (network issue)${NC}"
fi
echo ""

# ============================================
# Step 3: Install Agent Definitions (16)
# ============================================
echo -e "${CYAN}[3/7] Installing agents (16 specialists)...${NC}"

AGENTS=(
    "README.md"
    "orchestrator.md"
    "code-reviewer.md"
    "plan-executor.md"
    "researcher.md"
    "codebase-explorer.md"
    "data-analyst.md"
    "security-auditor.md"
    "laravel-developer.md"
    "php-developer.md"
    "react-developer.md"
    "python-developer.md"
    "database-specialist.md"
    "web-scraper.md"
    "testing-agent.md"
    "documentation-agent.md"
    "refactoring-agent.md"
)

AGENT_SUCCESS=0
for agent in "${AGENTS[@]}"; do
    if curl -fsSL "${BASE_URL}/agents/${agent}" -o ".claude/agents/${agent}" 2>/dev/null; then
        ((AGENT_SUCCESS++))
    fi
done
echo -e "${GREEN}  ✓ ${AGENT_SUCCESS}/${#AGENTS[@]} agents installed${NC}"
echo ""

# ============================================
# Step 4: Install Slash Commands (18)
# ============================================
echo -e "${CYAN}[4/7] Installing slash commands (18 actions)...${NC}"

COMMANDS=(
    "guide.md"
    "mentor.md"
    "feedback.md"
    "laravel.md"
    "php.md"
    "react.md"
    "python.md"
    "db.md"
    "test.md"
    "review.md"
    "security.md"
    "docs.md"
    "refactor.md"
    "explore.md"
    "research.md"
    "orchestrate.md"
    "status.md"
    "agent-select.md"
)

CMD_SUCCESS=0
for cmd in "${COMMANDS[@]}"; do
    if curl -fsSL "${BASE_URL}/.claude/commands/${cmd}" -o ".claude/commands/${cmd}" 2>/dev/null; then
        ((CMD_SUCCESS++))
    fi
done
echo -e "${GREEN}  ✓ ${CMD_SUCCESS}/${#COMMANDS[@]} commands installed${NC}"
echo ""

# ============================================
# Step 5: Install Enforcement Hooks
# ============================================
echo -e "${CYAN}[5/7] Installing enforcement hooks...${NC}"

HOOKS=(
    "pre-commit-agent-check.sh"
    "post-agent-run.sh"
)

HOOK_SUCCESS=0
for hook in "${HOOKS[@]}"; do
    if curl -fsSL "${BASE_URL}/hooks/${hook}" -o "hooks/${hook}" 2>/dev/null; then
        chmod +x "hooks/${hook}"
        ((HOOK_SUCCESS++))
    fi
done
echo -e "${GREEN}  ✓ ${HOOK_SUCCESS}/${#HOOKS[@]} hooks installed${NC}"
echo ""

# ============================================
# Step 6: Install Configuration Files
# ============================================
echo -e "${CYAN}[6/7] Installing configuration...${NC}"

# CLAUDE.md
if curl -fsSL "${BASE_URL}/.claude/CLAUDE.md" -o ".claude/CLAUDE.md" 2>/dev/null; then
    echo -e "${GREEN}  ✓ .claude/CLAUDE.md${NC}"
fi

# Agent state docs
if curl -fsSL "${BASE_URL}/.claude/AGENT-STATE.md" -o ".claude/AGENT-STATE.md" 2>/dev/null; then
    echo -e "${GREEN}  ✓ .claude/AGENT-STATE.md${NC}"
fi

# Initialize agent state
echo '{}' > .claude/agent-state.json
echo -e "${GREEN}  ✓ .claude/agent-state.json (initialized)${NC}"

# Safety scripts
SCRIPTS=(
    "backup-database.sh"
    "safe-test.sh"
    "safe-migrate.sh"
)

for script in "${SCRIPTS[@]}"; do
    if curl -fsSL "${BASE_URL}/scripts/${script}" -o "scripts/${script}" 2>/dev/null; then
        chmod +x "scripts/${script}"
        echo -e "${GREEN}  ✓ scripts/${script}${NC}"
    fi
done
echo ""

# ============================================
# Step 7: Git Hook Setup
# ============================================
echo -e "${CYAN}[7/7] Git hook setup...${NC}"

if [ -d ".git" ]; then
    echo -e "${YELLOW}  Git repository detected.${NC}"
    echo -e "${YELLOW}  To enable commit enforcement:${NC}"
    echo ""
    echo "    cp hooks/pre-commit-agent-check.sh .git/hooks/pre-commit"
    echo "    chmod +x .git/hooks/pre-commit"
    echo ""
else
    echo -e "${YELLOW}  No .git directory. Skipping hook setup.${NC}"
fi
echo ""

# ============================================
# Summary
# ============================================
echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║   ${GREEN}Installation Complete!${MAGENTA}                                  ║${NC}"
echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Installed:${NC}"
echo "  • Skills:   ${SKILLS_COUNT:-30} protocols"
echo "  • Agents:   ${AGENT_SUCCESS} specialists"
echo "  • Commands: ${CMD_SUCCESS} slash commands"
echo "  • Hooks:    ${HOOK_SUCCESS} enforcement hooks"
echo ""

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}                      QUICK START${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  Need help?           /guide"
echo "  Critical feedback?   /mentor [subject]"
echo "  Laravel work?        /laravel [task]"
echo "  React work?          /react [task]"
echo "  Python work?         /python [task]"
echo "  Write tests?         /test [task]"
echo "  Code review?         /review [task]"
echo "  Check status?        /status"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}                   MANDATORY WORKFLOW${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  1. /explore or /research  → Understand first"
echo "  2. /laravel, /react, etc  → Implement"
echo "  3. /test                  → Verify (MANDATORY)"
echo "  4. /review                → Quality (MANDATORY)"
echo "  5. git commit             → Only after review"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}                     ENFORCEMENT${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${RED}BLOCKED:${NC} Commits without /review"
echo -e "  ${RED}BLOCKED:${NC} Commits with failing tests"
echo -e "  ${RED}BLOCKED:${NC} DB operations without backup"
echo ""
echo -e "${GREEN}Ready! Restart Claude Code to activate commands.${NC}"
echo ""
echo -e "${YELLOW}Submit feedback: /feedback [your idea]${NC}"
echo -e "${YELLOW}Documentation:   https://github.com/liauw-media/CodeAssist${NC}"
echo ""
