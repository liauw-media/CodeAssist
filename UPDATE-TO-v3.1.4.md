# Update Existing Projects to CodeAssist v3.1.4

**Copy this prompt into any existing project to update to the latest CodeAssist with Brand Guidelines Integration**

---

## 📋 Full Update Prompt

```
Update this project to the latest CodeAssist v3.1.4 with Brand Guidelines Integration:

1. Check current skills version:
   - If .claude/skills/ exists, check: find .claude/skills -name "SKILL.md" | wc -l
   - Report current count and version

2. Update to latest skills:
   - Fetch: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh
   - Run: bash install-skills.sh
   - This installs/updates all 30 skills to .claude/skills/

3. Add MCP servers (if not already present):
   - Create .mcp.json with Lighthouse and Chrome DevTools MCP
   - Fetch config: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/.mcp.json
   - Copy to project root

4. Verify installation:
   - Count: find .claude/skills -name "SKILL.md" | wc -l (should be 30)
   - Version: read .claude/skills/README.md and report version + last updated
   - Check .mcp.json exists

5. Read what's new:
   - CHANGELOG: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/CHANGELOG.md
   - Report any breaking changes or new skills

6. Confirm understanding:
   - using-skills protocol (MANDATORY for EVERY task)
   - database-backup skill (MANDATORY before ANY database operation)
   - Skills workflow: brainstorm → plan → execute → review → verify
   - NEW: brand-guidelines for establishing brand identity
   - NEW: frontend-design (auto-applies brand guidelines if they exist)
   - NEW: playwright testing (validates brand compliance)
   - MCP tools: lighthouse-performance-optimization, browser-automation-debugging

7. Report completion:
   - Skills updated: [old count] → 30
   - MCP servers: Lighthouse + Chrome DevTools
   - Brand system: brand-guidelines + automatic integration
   - New skills added: [list any new ones]
   - Ready to work with latest CodeAssist v3.1.4
```

---

## ⚡ Ultra-Quick Version

```
Update CodeAssist: Check .claude/skills/ count, fetch and run https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh, add .mcp.json from repo, verify 30 skills + MCP servers + brand-guidelines, read CHANGELOG, confirm protocols. Report what's new.
```

---

## 🆕 What's New in v3.1.4 (2025-11-17)

### Brand Guidelines System

**brand-guidelines skill (Skill #30)**
- **Three modes**: Interactive discovery, project analysis, update existing
- Creates `.claude/BRAND-GUIDELINES.md` with complete brand specifications
- **Automatic integration**: Other skills reference guidelines automatically
- **Composable**: Works seamlessly with frontend-design and playwright-frontend-testing
- **Based on**: [Anthropic best practices](https://website.claude.com/resources/use-cases/package-your-brand-guidelines-in-a-skill)

**Key features**:
- 16 strategic discovery questions (colors, typography, tone, visual style)
- Complete guideline template (colors, fonts, spacing, tone, accessibility)
- CSS variables export for implementation
- Framework integration code (Tailwind, Styled Components)
- Version control and review schedule

### Enhanced Skills

**frontend-design (Updated)**:
- Now checks for `.claude/BRAND-GUIDELINES.md` before design decisions
- Automatically applies brand colors, typography, and visual style
- Creative interpretation allowed within brand parameters
- Never overrides brand without explicit request
- Added brand compliance checklist

**playwright-frontend-testing (Updated)**:
- New brand compliance testing section (200+ lines)
- Validates colors, typography, spacing, visual style
- Complete brand audit test suite examples
- RGB to HEX conversion helpers
- Announces brand validation when guidelines exist

### Brand Guidelines Workflow

**Composable Skills System**:
```
1. brand-guidelines → Creates .claude/BRAND-GUIDELINES.md
2. frontend-design → Automatically applies brand
3. playwright-frontend-testing → Validates brand compliance
4. Result: Consistent, on-brand execution
```

**Benefits**:
- **Consistency**: 75% of brand recognition from consistent visual application
- **Automatic**: No manual reminders needed
- **Testable**: Validate compliance automatically
- **Maintainable**: Single source of truth

### MCP Servers (from v3.1.3)

**Lighthouse MCP** - Performance auditing
**Chrome DevTools MCP** - Browser automation (26 tools)

### Documentation

- New brand-guidelines skill (700+ lines)
- Enhanced frontend-design with brand integration
- Enhanced playwright-frontend-testing with brand validation
- Updated README, CHANGELOG, init prompts

---

## 📦 What Gets Installed/Updated

**Files Updated:**
- `.claude/skills/` - 30 skills (up from 29 or older version)
- `.mcp.json` - MCP server configuration (if not present)

**New Skill Added:**
- `skills/design/brand-guidelines/SKILL.md`

**Enhanced Skills:**
- `skills/design/frontend-design/SKILL.md` (brand integration)
- `skills/testing/playwright-frontend-testing/SKILL.md` (brand validation)

**Total:** 30 skills (1 new + 2 enhanced)

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

### Step 2: Add MCP Configuration (if not present)
```bash
# Download .mcp.json
curl -o .mcp.json https://raw.githubusercontent.com/liauw-media/CodeAssist/main/.mcp.json
```

### Step 3: Verify
```bash
# Check skills count
find .claude/skills -name "SKILL.md" | wc -l

# Should output: 30

# Check MCP config
cat .mcp.json
```

---

## 🧪 Testing the New Features

### Test Brand Guidelines Skill
```
Ask Claude: "Use the brand-guidelines skill to establish brand identity for my SaaS product"
Expected: Strategic questions about brand, creates .claude/BRAND-GUIDELINES.md
```

### Test Frontend Design with Brand
```
1. Create brand guidelines first
2. Ask Claude: "Use the frontend-design skill to create a landing page hero"
Expected: Design automatically applies brand colors, fonts, and style
```

### Test Brand Compliance Testing
```
Ask Claude: "Use playwright-frontend-testing to validate brand compliance"
Expected: Tests check colors, typography, spacing match guidelines
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
- **Brand Guidelines Guide**: [Anthropic Use Case](https://website.claude.com/resources/use-cases/package-your-brand-guidelines-in-a-skill)

---

## 📊 Version Comparison

| Feature | v3.1.3 | v3.1.4 |
|---------|--------|--------|
| **Total Skills** | 29 | **30** ✨ |
| **Design Skills** | 1 | **2** ✨ |
| **Brand Guidelines** | ❌ | ✅ |
| **Auto Brand Application** | ❌ | ✅ (frontend-design) |
| **Brand Validation** | ❌ | ✅ (playwright) |
| **Composable Skills** | Partial | ✅ (Full integration) |
| **MCP Servers** | 2 | 2 |
| **Performance Audits** | ✅ | ✅ (Lighthouse) |
| **Browser Automation** | ✅ | ✅ (Chrome DevTools) |

---

**Ready to update? Copy the prompt above and paste it into your Claude Code session!**
