# Skill Install

Install external skills from community sources like Vercel, aitmpl, SkillsMP, and GitHub.

## Task
$ARGUMENTS

## Skill Install Protocol

**Skills are reusable best practices that teach Claude Code how to work with specific frameworks and patterns.**

### Step 1: Identify Skill Source

Ask the user what they want to install, or suggest based on their project:

| Source | Command | Examples |
|--------|---------|----------|
| **aitmpl** | `npx claude-code-templates@latest --skill=<path> --yes` | React, Vue, Django, Rails |
| **ClawHub** | `clawhub install <slug>` | 3,200+ OpenClaw skills |
| **GitHub** | Clone to `.claude/skills/` | vercel-labs, community repos |
| **SkillsMP** | Browse skillsmp.com | 32,000+ community skills |

> **ClawHub security warning:** ~20% of ClawHub skills flagged as malicious. Always check VirusTotal report before installing.

### Step 2: Popular Skills by Framework

#### React / Next.js
```bash
# Vercel's React Best Practices (40+ rules)
npx claude-code-templates@latest --skill=web-development/react-best-practices --yes

# Vercel Web Design Guidelines
npx claude-code-templates@latest --skill=web-development/web-design-guidelines --yes
```

#### Vue
```bash
npx claude-code-templates@latest --skill=web-development/vue-best-practices --yes
```

#### Python / Django / FastAPI
```bash
npx claude-code-templates@latest --skill=backend/django-best-practices --yes
npx claude-code-templates@latest --skill=backend/fastapi-best-practices --yes
```

#### TypeScript
```bash
npx claude-code-templates@latest --skill=languages/typescript-best-practices --yes
```

#### DevOps / Infrastructure
```bash
# Vercel deployment
npx claude-code-templates@latest --skill=deployment/vercel-deploy --yes
```

### Step 3: Install from GitHub

For skills hosted on GitHub:

```bash
# Clone directly to .claude/skills/
git clone https://github.com/vercel-labs/agent-skills.git .claude/skills/vercel

# Or specific skill
curl -fsSL https://raw.githubusercontent.com/vercel-labs/agent-skills/main/react-best-practices/SKILL.md -o .claude/skills/react-best-practices/SKILL.md
```

### Step 4: Browse SkillsMP

Visit [skillsmp.com](https://skillsmp.com) for 32,000+ community skills:

```bash
# Search and download
# Skills use the open SKILL.md format
```

### Step 5: Verify Installation

After installing, skills appear in:
- `.claude/skills/` (project-level)
- `~/.claude/skills/` (global)

```bash
# List installed skills
ls -la .claude/skills/
find .claude/skills -name "SKILL.md" | head -20
```

### Recommended Skills by Project Type

| Project Type | Recommended Skills |
|--------------|-------------------|
| **React/Next.js** | react-best-practices, web-design-guidelines |
| **Vue/Nuxt** | vue-best-practices |
| **Python API** | fastapi-best-practices, python-testing |
| **Laravel** | laravel-simplifier (plugin) |
| **Mobile** | react-native-best-practices |
| **Full Stack** | Multiple framework skills |

### Install from ClawHub (OpenClaw)

```bash
# Install CLI first (if not already)
npm install -g clawhub

# Search by keyword or natural language
clawhub search "code review"
clawhub search "API testing"

# Install
clawhub install <skill-slug>

# Link to Claude Code (skills install to ./skills/ by default)
ln -sfn ./skills .claude/skills/openclaw
```

> ClawHub uses vector search — natural language queries work well.

### Skill Sources

| Source | URL | Skills | Notes |
|--------|-----|--------|-------|
| **aitmpl** | [aitmpl.com](https://aitmpl.com) | 100+ | claude-code-templates CLI, analytics, chat monitor |
| **ClawHub** | [clawhub.com](https://docs.openclaw.ai/tools/clawhub) | 3,200+ | OpenClaw registry, vector search |
| **Vercel** | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | 10+ | Official Vercel skills |
| **SkillsMP** | [skillsmp.com](https://skillsmp.com) | 32,000+ | Community marketplace |
| **Anthropic** | [anthropics/skills](https://github.com/anthropics/skills) | Spec | SKILL.md format standard |

### Output Format

```
## Skill Installation Complete

**Installed:**
- [x] react-best-practices (Vercel) - 40+ React/Next.js rules
- [x] web-design-guidelines (Vercel) - UI/UX patterns

**Location:** .claude/skills/

**Usage:**
Skills are automatically loaded. Claude will reference them when working on matching file types.

**Verify:**
Ask Claude: "What React best practices should I follow for this component?"
```

### Creating Custom Skills

To create your own skills, use `/skill-create` or follow the [SKILL.md format](https://github.com/anthropics/skills).

**Execute the skill installation based on user's request or project type.**
