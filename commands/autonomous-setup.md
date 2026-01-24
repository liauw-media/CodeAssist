# Autonomous Setup

Configure autonomous development mode for your project.

## Context
$ARGUMENTS

## Execute

### Step 1: Check Prerequisites

```bash
# Check GitHub CLI
gh --version

# Check Node.js (for headless mode)
node --version

# Check if in a git repo
git status
```

**Required:**
- GitHub CLI authenticated (`gh auth login`)
- Git repository initialized

**For headless mode (Ralph):**
- Node.js 18+
- `ANTHROPIC_API_KEY` environment variable
- Install: `cd scripts && npm install`
- Full docs: [docs/ralph.md](../docs/ralph.md)

### Step 2: Create Configuration

If `.claude/autonomous.yml` doesn't exist, create it from template:

```bash
# Check for existing config
ls .claude/autonomous.yml 2>/dev/null || echo "No config found"
```

**Default configuration** (copy to `.claude/autonomous.yml`):

```yaml
# Autonomous Development Configuration
target_score: 95
max_iterations: 15

gates:
  test:     { weight: 25, required: true,  auto_fix: true  }
  security: { weight: 25, required: true,  auto_fix: true  }
  build:    { weight: 15, required: true,  auto_fix: true  }
  review:   { weight: 20, required: false, auto_fix: true  }
  mentor:   { weight: 10, required: false, auto_fix: false }
  ux:       { weight: 5,  required: false, auto_fix: false }

presets:
  prototype:
    target_score: 80
  production:
    target_score: 98
```

### Step 3: MCP Configuration

Check for GitHub MCP (required for issue tracking):

```bash
# Check MCP config
cat .mcp.json 2>/dev/null | grep -i github || echo "GitHub MCP not configured"
```

If not configured, recommend running `/mcp-setup` first.

### Step 4: Explain the Two Modes

**Interactive Mode** (`/autonomous`):
- Runs inside your Claude Code session
- You can watch progress in real-time
- Intervene with `@claude` comments
- Best for single issues while working

```bash
# Example
/autonomous --issue 123
/autonomous --issue 123 --preset production
```

**Headless Mode** (Ralph):
- Runs outside Claude, uses Agent SDK
- Unattended overnight/CI runs
- Docker support for containers
- Best for batch processing

```bash
# Install dependencies
cd scripts && npm install

# Run headless
npx ts-node ralph-runner.ts --issue=123
npx ts-node ralph-runner.ts --issue=123 --preset=production

# Docker
docker build -t ralph-wiggum scripts/
docker run -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY ralph-wiggum --issue=123
```

### Step 5: Create Your First Issue

For autonomous development to work, you need properly structured issues:

```markdown
## Acceptance Criteria
- [ ] User can login with email/password
- [ ] Failed logins are rate limited
- [ ] Session expires after 24 hours

## Technical Notes
- Use bcrypt for password hashing
- Store sessions in Redis
```

Create via `/plan`:
```bash
/plan "User authentication" --issues
```

### Step 6: Verify Setup

Run a dry-run to verify everything works:

```bash
# Interactive check
/autonomous --issue 123 --dry-run

# Headless check
cd scripts && npx ts-node ralph-runner.ts --issue=123 --dry-run
```

## Output Format

```
## Autonomous Setup Complete

### Prerequisites
| Requirement | Status |
|-------------|--------|
| GitHub CLI | [✅/❌] |
| Git repo | [✅/❌] |
| Node.js 18+ | [✅/❌] (headless only) |
| ANTHROPIC_API_KEY | [✅/❌] (headless only) |

### Configuration
- Config file: [created/exists/missing]
- Target score: [95]
- Presets available: [default, prototype, production]

### MCP Status
| MCP | Status |
|-----|--------|
| GitHub | [✅/❌] Required for issue tracking |

### Quick Start

**Interactive (in Claude Code):**
```bash
/autonomous --issue YOUR_ISSUE_NUMBER
```

**Headless (background):**
```bash
cd scripts && npx ts-node ralph-runner.ts --issue=YOUR_ISSUE_NUMBER
```

### Next Steps
1. Create an issue with acceptance criteria
2. Run `/autonomous --issue NUMBER --dry-run` to test
3. Run `/autonomous --issue NUMBER` to start

### Documentation
- Skill: `skills/workflow/autonomous-development/SKILL.md`
- Config template: `templates/autonomous.yml`
- Headless runner: `scripts/README.md`
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "GitHub MCP not found" | Run `/mcp-setup` and enable GitHub |
| "gh: command not found" | Install GitHub CLI: `brew install gh` |
| "ANTHROPIC_API_KEY not set" | `export ANTHROPIC_API_KEY=your-key` |
| "No issues found" | Create issues with `/plan --issues` |
| "Score stuck" | Check for flaky tests, review gate output |

Start setup now.
