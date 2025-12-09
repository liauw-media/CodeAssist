#!/bin/bash

# ============================================
# CodeAssist Multi-Agent System Installer
# Version 3.2.0 - Complete Infrastructure
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   CodeAssist Multi-Agent System Installer                 ║${NC}"
echo -e "${BLUE}║   Version 3.2.0 - Complete Infrastructure                 ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

BASE_URL="https://raw.githubusercontent.com/liauw-media/CodeAssist/main"

# ============================================
# Step 1: Create directories
# ============================================
echo -e "${CYAN}Step 1: Creating directories...${NC}"

mkdir -p .claude/commands
mkdir -p .claude/agents
mkdir -p hooks

echo -e "${GREEN}  ✓ .claude/commands/${NC}"
echo -e "${GREEN}  ✓ .claude/agents/${NC}"
echo -e "${GREEN}  ✓ hooks/${NC}"
echo ""

# ============================================
# Step 2: Install Agent Definitions
# ============================================
echo -e "${CYAN}Step 2: Installing agent definitions...${NC}"

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
        echo -e "${GREEN}  ✓ ${agent}${NC}"
        ((AGENT_SUCCESS++))
    else
        echo -e "${RED}  ✗ ${agent}${NC}"
    fi
done
echo -e "  Installed: ${GREEN}${AGENT_SUCCESS}/${#AGENTS[@]}${NC} agents"
echo ""

# ============================================
# Step 3: Install Slash Commands
# ============================================
echo -e "${CYAN}Step 3: Installing slash commands...${NC}"

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
        echo -e "${GREEN}  ✓ /${cmd%.md}${NC}"
        ((CMD_SUCCESS++))
    else
        echo -e "${RED}  ✗ /${cmd%.md}${NC}"
    fi
done
echo -e "  Installed: ${GREEN}${CMD_SUCCESS}/${#COMMANDS[@]}${NC} commands"
echo ""

# ============================================
# Step 4: Install Enforcement Hooks
# ============================================
echo -e "${CYAN}Step 4: Installing enforcement hooks...${NC}"

HOOKS=(
    "pre-commit-agent-check.sh"
    "post-agent-run.sh"
)

HOOK_SUCCESS=0
for hook in "${HOOKS[@]}"; do
    if curl -fsSL "${BASE_URL}/hooks/${hook}" -o "hooks/${hook}" 2>/dev/null; then
        chmod +x "hooks/${hook}"
        echo -e "${GREEN}  ✓ ${hook}${NC}"
        ((HOOK_SUCCESS++))
    else
        echo -e "${RED}  ✗ ${hook}${NC}"
    fi
done
echo -e "  Installed: ${GREEN}${HOOK_SUCCESS}/${#HOOKS[@]}${NC} hooks"
echo ""

# ============================================
# Step 5: Install CLAUDE.md
# ============================================
echo -e "${CYAN}Step 5: Installing CLAUDE.md...${NC}"

if curl -fsSL "${BASE_URL}/.claude/CLAUDE.md" -o ".claude/CLAUDE.md" 2>/dev/null; then
    echo -e "${GREEN}  ✓ .claude/CLAUDE.md${NC}"
else
    echo -e "${RED}  ✗ .claude/CLAUDE.md${NC}"
fi
echo ""

# ============================================
# Step 6: Install Agent State Documentation
# ============================================
echo -e "${CYAN}Step 6: Installing agent state system...${NC}"

if curl -fsSL "${BASE_URL}/.claude/AGENT-STATE.md" -o ".claude/AGENT-STATE.md" 2>/dev/null; then
    echo -e "${GREEN}  ✓ .claude/AGENT-STATE.md${NC}"
else
    echo -e "${RED}  ✗ .claude/AGENT-STATE.md${NC}"
fi

# Initialize empty state
echo '{}' > .claude/agent-state.json
echo -e "${GREEN}  ✓ .claude/agent-state.json (initialized)${NC}"
echo ""

# ============================================
# Step 7: Setup Git Hook (optional)
# ============================================
echo -e "${CYAN}Step 7: Git hook setup...${NC}"

if [ -d ".git" ]; then
    echo -e "${YELLOW}  Git repository detected.${NC}"
    echo -e "${YELLOW}  To enable commit enforcement, run:${NC}"
    echo ""
    echo "    cp hooks/pre-commit-agent-check.sh .git/hooks/pre-commit"
    echo "    chmod +x .git/hooks/pre-commit"
    echo ""
else
    echo -e "${YELLOW}  No .git directory found. Skipping git hook setup.${NC}"
fi
echo ""

# ============================================
# Summary
# ============================================
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Installation Complete!                                   ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Installed:${NC}"
echo "  • ${AGENT_SUCCESS} specialized agents"
echo "  • ${CMD_SUCCESS} slash commands"
echo "  • ${HOOK_SUCCESS} enforcement hooks"
echo "  • Agent state tracking system"
echo "  • CLAUDE.md project instructions"
echo ""

echo -e "${CYAN}Available Commands:${NC}"
echo ""
echo "  Help & Guidance:"
echo "    /guide [question]   Interactive guidance, what to do next"
echo "    /mentor [subject]   Ruthless critical analysis (no sugarcoating)"
echo "    /feedback [topic]   Submit feedback/issues to GitHub"
echo "    /status             Check workflow status"
echo "    /agent-select [task] Get agent recommendation"
echo ""
echo "  Development:"
echo "    /laravel [task]     Laravel/PHP specialist"
echo "    /react [task]       React/Next.js specialist"
echo "    /python [task]      Python specialist"
echo "    /db [task]          Database specialist"
echo ""
echo "  Quality:"
echo "    /test [task]        Test writing & TDD"
echo "    /review [task]      Code review"
echo "    /security [task]    Security audit"
echo "    /refactor [task]    Code refactoring"
echo ""
echo "  Research & Docs:"
echo "    /explore [task]     Codebase exploration"
echo "    /research [task]    Web research"
echo "    /docs [task]        Documentation"
echo ""
echo "  Coordination:"
echo "    /orchestrate [task] Multi-agent workflows"
echo ""

echo -e "${YELLOW}Mandatory Workflow:${NC}"
echo ""
echo "  1. /explore or /research  (understand first)"
echo "  2. /laravel, /react, /python  (implement)"
echo "  3. /test  (verify - MANDATORY)"
echo "  4. /review  (quality check - MANDATORY)"
echo "  5. git commit  (only after review passes)"
echo ""

echo -e "${RED}Enforcement Active:${NC}"
echo ""
echo "  • Commits blocked without /review"
echo "  • Commits blocked if tests fail"
echo "  • DB operations require backup"
echo ""

echo -e "${GREEN}Ready to use! Start with:${NC}"
echo "  /agent-select [describe your task]"
echo ""
