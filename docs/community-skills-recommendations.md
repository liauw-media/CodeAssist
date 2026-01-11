# Community Skills Recommendations

Skills discovered from the community that could complement CodeAssist.

## Format Compatibility

CodeAssist skills use the open **SKILL.md format** standard, compatible with:
- **Claude Code**: `~/.claude/skills/` or `.claude/skills/`
- **OpenAI Codex CLI**: `~/.codex/skills/`
- **GitHub Copilot**: Auto-discovers from `.claude/skills/`

## Recommended Community Skills

### Document Processing (from Anthropic)

| Skill | Description | Source |
|-------|-------------|--------|
| **docx** | Create, edit, analyze Word documents with track changes | [anthropics/skills](https://github.com/anthropics/skills) |
| **pdf** | PDF manipulation, extraction, merging, forms | [anthropics/skills](https://github.com/anthropics/skills) |
| **pptx** | PowerPoint presentations with layouts and charts | [anthropics/skills](https://github.com/anthropics/skills) |
| **xlsx** | Excel spreadsheets with formulas and formatting | [anthropics/skills](https://github.com/anthropics/skills) |

**Install**: Copy from `anthropics/skills/skills/docx` etc to `~/.claude/skills/`

### Development Tools

| Skill | Description | Source |
|-------|-------------|--------|
| **mcp-builder** | MCP server development guidance | [anthropics/skills](https://github.com/anthropics/skills) |
| **artifacts-builder** | HTML artifact creation with React/shadcn | [anthropics/skills](https://github.com/anthropics/skills) |
| **webapp-testing** | Web app testing via Playwright | [anthropics/skills](https://github.com/anthropics/skills) |

### Comprehensive Skill Collections

| Collection | Description | Skills Count |
|------------|-------------|--------------|
| [obra/superpowers](https://github.com/obra/superpowers) | Battle-tested TDD, debugging, collaboration skills | 20+ |
| [levnikolaevich/claude-code-skills](https://github.com/levnikolaevich/claude-code-skills) | Full development lifecycle automation | 84 |
| [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) | Curated skill resources and tools | Curated list |

### Skill Categories on SkillsMP

Browse 32,000+ skills at [skillsmp.com](https://skillsmp.com/categories):

| Category | Skills Available | Notes |
|----------|------------------|-------|
| Git Workflows | 4,068 | Version control automation |
| Testing | 2,978 | Test frameworks, patterns |
| Code Quality | 2,645 | Linting, analysis, review |
| Security | 1,535 | Auditing, scanning |
| Documentation | 1,200+ | API docs, README generation |

## Skills Already in CodeAssist

CodeAssist already covers these areas (no need to add from community):

- **Testing**: TDD, anti-patterns, Playwright, condition-based waiting
- **Git Workflow**: Branch discipline, worktrees, platform CLI
- **Code Review**: Self-review, requesting/receiving reviews
- **Debugging**: Systematic debugging, root cause tracing
- **Safety**: Database backup, defense in depth, resource limiting
- **Planning**: Brainstorming, writing plans, executing plans

## Suggested Additions

Skills that would complement CodeAssist but aren't currently included:

### High Priority

| Skill | Why | Source |
|-------|-----|--------|
| **docx/pdf/xlsx** | Document generation common in enterprise | anthropics/skills |
| **mcp-builder** | MCP servers increasingly common | anthropics/skills |

### Medium Priority

| Skill | Why | Source |
|-------|-----|--------|
| **standards-researcher** | Research industry standards | levnikolaevich |
| **audit-security** | Specialized security audits | levnikolaevich |
| **bootstrap-docker** | Container setup automation | levnikolaevich |

### Low Priority (Niche)

| Skill | Why | Source |
|-------|-----|--------|
| **algorithmic-art** | Generative art with p5.js | anthropics/skills |
| **slack-gif-creator** | Animated GIF generation | anthropics/skills |
| **ios-simulator** | iOS development/testing | community |

## How to Install Community Skills

```bash
# Clone the skill repository
git clone https://github.com/anthropics/skills.git /tmp/anthropic-skills

# Copy specific skill to your skills folder
cp -r /tmp/anthropic-skills/skills/pdf ~/.claude/skills/

# Or to project-specific location
cp -r /tmp/anthropic-skills/skills/pdf .claude/skills/
```

## Creating Custom Skills

Use `/skill-create` to create new skills following the SKILL.md standard:

```
/skill-create A skill for generating API documentation from OpenAPI specs
```

See `skills/meta/writing-skills/SKILL.md` for detailed guidance.

## Resources

- [Agent Skills Specification](https://github.com/anthropics/skills/blob/main/spec/agent-skills-spec.md)
- [SkillsMP Marketplace](https://skillsmp.com/)
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
- [OpenAI Codex Skills](https://developers.openai.com/codex/skills)
