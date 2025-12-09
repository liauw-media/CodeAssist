#!/bin/bash

# ============================================
# CodeAssist Agents Installer
# Installs agent definitions and commands only
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo "CodeAssist Agents Installer - v1.0.0"
echo "====================================="
echo ""

BASE_URL="https://raw.githubusercontent.com/liauw-media/CodeAssist/main"

# Create directories
echo -e "${CYAN}Creating directories...${NC}"
mkdir -p .claude/commands
mkdir -p .claude/agents
echo -e "${GREEN}  Done${NC}"
echo ""

# Install agents
echo -e "${CYAN}Installing agent definitions...${NC}"

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
echo -e "${GREEN}  ${AGENT_SUCCESS} agents installed${NC}"
echo ""

# Install commands
echo -e "${CYAN}Installing slash commands...${NC}"

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
echo -e "${GREEN}  ${CMD_SUCCESS} commands installed${NC}"
echo ""

# Install CLAUDE.md
echo -e "${CYAN}Installing CLAUDE.md...${NC}"
if curl -fsSL "${BASE_URL}/.claude/CLAUDE.md" -o ".claude/CLAUDE.md" 2>/dev/null; then
    echo -e "${GREEN}  Done${NC}"
fi
echo ""

# Summary
echo "====================================="
echo "Installation Complete"
echo "====================================="
echo ""
echo "Installed:"
echo "  - ${AGENT_SUCCESS} agent definitions"
echo "  - ${CMD_SUCCESS} slash commands"
echo "  - CLAUDE.md"
echo ""
echo "Commands:"
echo "  /guide      - Get help"
echo "  /laravel    - Laravel development"
echo "  /react      - React development"
echo "  /python     - Python development"
echo "  /test       - Write tests"
echo "  /review     - Code review"
echo "  /mentor     - Critical analysis"
echo ""
echo "Restart Claude Code to activate."
echo ""
