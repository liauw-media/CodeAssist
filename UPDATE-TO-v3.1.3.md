# Update Existing Projects to CodeAssist v3.1.3

**Copy this prompt into any existing project to update to the latest CodeAssist with MCP Tools Integration**

---

## 📋 Full Update Prompt

```
Update this project to the latest CodeAssist v3.1.3 with MCP Tools Integration:

1. Check current skills version:
   - If .claude/skills/ exists, check: find .claude/skills -name "SKILL.md" | wc -l
   - Report current count and version

2. Update to latest skills:
   - Fetch: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh
   - Run: bash install-skills.sh
   - This installs/updates all 29 skills to .claude/skills/

3. Add MCP servers:
   - Create .mcp.json with Lighthouse and Chrome DevTools MCP
   - Fetch config: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/.mcp.json
   - Copy to project root

4. Verify installation:
   - Count: find .claude/skills -name "SKILL.md" | wc -l (should be 29)
   - Version: read .claude/skills/README.md and report version + last updated
   - Check .mcp.json exists

5. Read what's new:
   - CHANGELOG: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/CHANGELOG.md
   - Report any breaking changes or new skills

6. Confirm understanding:
   - using-skills protocol (MANDATORY for EVERY task)
   - database-backup skill (MANDATORY before ANY database operation)
   - Skills workflow: brainstorm → plan → execute → review → verify
   - NEW: lighthouse-performance-optimization for web performance
   - NEW: browser-automation-debugging for Chrome DevTools automation
   - NEW: frontend-design for distinctive UI development

7. Report completion:
   - Skills updated: [old count] → 29
   - MCP servers: Lighthouse + Chrome DevTools
   - New skills added: [list any new ones]
   - Ready to work with latest CodeAssist v3.1.3
```

---

## ⚡ Ultra-Quick Version

```
Update CodeAssist: Check .claude/skills/ count, fetch and run https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh, add .mcp.json from repo, verify 29 skills + MCP servers, read CHANGELOG, confirm protocols. Report what's new.
```

---

## 🆕 What's New in v3.1.3 (2025-11-17)

### Three New Skills

**1. frontend-design (Skill #27)**
- Create distinctive, production-grade frontend interfaces
- Avoid generic AI aesthetics
- Typography, color, motion, spatial composition guidelines
- Adapted from Anthropic Skills

**2. lighthouse-performance-optimization (Skill #28)**
- Data-driven performance optimization
- Core Web Vitals (LCP, FID, CLS)
- Pre-deployment checklists
- Performance budgets
- Requires: Lighthouse MCP server

**3. browser-automation-debugging (Skill #29)**
- Browser automation with 26 Chrome DevTools tools
- Screenshots, network analysis, performance profiling
- E2E testing automation
- Requires: Chrome DevTools MCP server

### MCP Servers Integration

**Lighthouse MCP**
- Run Google Lighthouse audits via Claude Code
- Performance, accessibility, SEO, best practices
- Command: "Run a Lighthouse audit on [URL]"

**Chrome DevTools MCP**
- Control live Chrome browsers programmatically
- 26 tools: navigation, interaction, screenshots, network, performance
- Command: "Navigate to [URL] and take a screenshot"

### Documentation

- New MCP Servers section in Development Tooling Guide
- Comprehensive installation and usage instructions
- Troubleshooting guides
- Links to official MCP directory

---

## 📦 What Gets Installed/Updated

**Files Updated:**
- `.claude/skills/` - 29 skills (up from 26 or older version)
- `.mcp.json` - MCP server configuration (new)

**New Skills Added:**
- `skills/design/frontend-design/SKILL.md`
- `skills/testing/lighthouse-performance-optimization/SKILL.md`
- `skills/debugging/browser-automation-debugging/SKILL.md`

**Total:** 29 skills (3 new skills added)

---

## 🔧 Manual Installation (Alternative)

If you prefer to install manually without the script:

### Step 1: Download Skills
```bash
# Clone or download the latest skills
git clone https://github.com/liauw-media/CodeAssist.git temp-codeassist
cp -r temp-codeassist/skills .claude/
rm -rf temp-codeassist
```

### Step 2: Add MCP Configuration
```bash
# Download .mcp.json
curl -o .mcp.json https://raw.githubusercontent.com/liauw-media/CodeAssist/main/.mcp.json
```

### Step 3: Verify
```bash
# Check skills count
find .claude/skills -name "SKILL.md" | wc -l

# Should output: 29

# Check MCP config
cat .mcp.json
```

---

## 🧪 Testing the New Features

### Test Lighthouse MCP
```
Ask Claude: "Run a Lighthouse audit on https://example.com"
Expected: Performance report with scores and recommendations
```

### Test Chrome DevTools MCP
```
Ask Claude: "Navigate to https://example.com and take a screenshot"
Expected: Browser opens, screenshot captured
```

### Test Frontend Design Skill
```
Ask Claude: "Use the frontend-design skill to create a landing page hero section"
Expected: Distinctive design with bold aesthetic choices
```

---

## ❓ Troubleshooting

### Skills not updating
```bash
# Remove old skills and reinstall
rm -rf .claude/skills
bash install-skills.sh
```

### MCP servers not working
```bash
# Check Node.js version (need 20.19+ or 22.12+/23+)
node --version

# Test MCP packages
npx -y lighthouse-mcp@latest --version
npx -y chrome-devtools-mcp@latest --version
```

### Permission errors
```bash
# Make script executable
chmod +x install-skills.sh

# Run with bash explicitly
bash install-skills.sh
```

---

## 🔗 Resources

- **Main Repository**: https://github.com/liauw-media/CodeAssist
- **Skills Index**: [skills/README.md](https://github.com/liauw-media/CodeAssist/blob/main/skills/README.md)
- **Changelog**: [CHANGELOG.md](https://github.com/liauw-media/CodeAssist/blob/main/CHANGELOG.md)
- **MCP Documentation**: [docs/development-tooling-guide.md](https://github.com/liauw-media/CodeAssist/blob/main/docs/development-tooling-guide.md#model-context-protocol-mcp-servers)
- **Lighthouse MCP**: https://cursor.directory/mcp/lighthouse-mcp
- **Chrome DevTools MCP**: https://github.com/ChromeDevTools/chrome-devtools-mcp/
- **Anthropic Skills**: https://github.com/anthropics/skills

---

## 📊 Version Comparison

| Feature | v3.1.1 | v3.1.3 |
|---------|--------|--------|
| **Total Skills** | 26 | **29** ✨ |
| **Testing Skills** | 4 | **5** ✨ |
| **Debugging Skills** | 2 | **3** ✨ |
| **Design Skills** | 0 | **1** ✨ |
| **MCP Servers** | None | **2** ✨ |
| **Frontend Design** | ❌ | ✅ |
| **Performance Audits** | ❌ | ✅ (Lighthouse) |
| **Browser Automation** | ❌ | ✅ (Chrome DevTools) |

---

**Ready to update? Copy the prompt above and paste it into your Claude Code session!**
