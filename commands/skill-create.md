# Skill Creator

Create new skills using the standard SKILL.md format.

## Task
$ARGUMENTS

## Skill Creator Protocol

You are now the **skill-creator** agent. You help users create well-structured, effective skills.

### Pre-Flight

1. **Read the skill writing guide**: Read `skills/meta/writing-skills/SKILL.md`

### Step 1: Understand the Skill

Ask clarifying questions (unless already clear):

1. **What functionality** should this skill provide?
2. **When should it trigger** - what would a user say/do?
3. **What's the scope** - is it instruction-only or needs scripts/assets?

Example prompts:
- "What should this skill help you accomplish?"
- "When would you want this skill to activate?"
- "Do you need any scripts, templates, or reference files?"

### Step 2: Determine Skill Type

| Type | When to Use | Structure |
|------|-------------|-----------|
| **Discipline** | Commitment to a practice | Iron Law, Why it matters, How to maintain |
| **Technique** | Step-by-step process | When to use, Steps, Examples, Mistakes |
| **Pattern** | Reusable solution | Problem, Solution, Variations |
| **Reference** | Conceptual knowledge | Concepts, Principles, Best practices |

### Step 3: Plan Resources

Consider what bundled resources might help:

```
skill-name/
├── SKILL.md (required)
├── scripts/      # Executable code for automation
├── references/   # Detailed docs loaded on demand
└── assets/       # Templates, images, boilerplate
```

**When to add scripts/**
- Same code repeatedly rewritten
- Deterministic reliability needed
- Token-efficient automation

**When to add references/**
- Detailed documentation > 1000 words
- API docs, schemas, policies
- Content loaded only when needed

**When to add assets/**
- Templates for output
- Boilerplate code
- Images, icons, fonts

### Step 4: Create the Skill

#### Directory Structure

```bash
# Create in appropriate category
skills/<category>/<skill-name>/SKILL.md

# Categories: core, workflow, testing, safety, debugging, design, meta
```

#### SKILL.md Template

```markdown
---
name: <skill-name>
description: "<Concise description: what it does AND when to use it. This is read for triggering - be specific about triggers.>"
---

# <Skill Name>

## Core Principle

<One sentence capturing the essence>

## When to Use This Skill

- <Trigger condition 1>
- <Trigger condition 2>
- <Trigger condition 3>

## The Iron Law

**<BOLD CORE RULE>**

<Brief explanation why this matters>

## Why <Skill Name>?

**Benefits:**
- Benefit 1
- Benefit 2
- Benefit 3

**Without this skill:**
- Problem 1
- Problem 2
- Problem 3

## <Main Content Section>

<Detailed instructions, steps, or patterns>

### <Subsection>

<Details with examples>

## Examples

### Example 1: <Scenario>

**Before (without skill):**
<What happens without this skill>

**After (with skill):**
<What happens with this skill>

## Common Mistakes

| Mistake | Why It's Wrong | Fix |
|---------|----------------|-----|
| <Mistake 1> | <Explanation> | <Solution> |
| <Mistake 2> | <Explanation> | <Solution> |

## Integration with Skills

**Use with:**
- `<related-skill-1>` - <how they work together>
- `<related-skill-2>` - <how they work together>

## Checklist

- [ ] <Step 1>
- [ ] <Step 2>
- [ ] <Step 3>

## Authority

**Based on:**
- <Research, standard, or expert source>
- <Industry practice or case study>

## Your Commitment

When using this skill:
- [ ] I will <commitment 1>
- [ ] I will <commitment 2>
- [ ] I will <commitment 3>

---

**Bottom Line**: <One memorable sentence summarizing the skill>
```

### Step 5: Validate the Skill

#### Metadata Check

- [ ] `name` is lowercase, hyphenated (e.g., `my-skill-name`)
- [ ] `name` is max 100 characters
- [ ] `description` includes WHEN to use (triggers)
- [ ] `description` is max 500 characters
- [ ] `description` is on a single line

#### Content Check

- [ ] Core Principle is one clear sentence
- [ ] Iron Law is memorable and actionable
- [ ] Examples show before/after
- [ ] No "When to Use" section in body (it's in description)
- [ ] Under 500 lines total
- [ ] Integrates with existing skills

#### Progressive Disclosure

- [ ] Only essential info in SKILL.md body
- [ ] Detailed content in references/ if needed
- [ ] Scripts in scripts/ if automation needed

### Step 6: Register the Skill

After creating the skill:

1. **Update skills/README.md** - Add to appropriate category table
2. **Test the skill** - Use with a fresh task to verify it triggers and works
3. **Iterate** - Refine based on real usage

### Output Format

```
## Skill Creator: [Skill Name]

### Skill Details
- **Name**: `<skill-name>`
- **Type**: <Discipline/Technique/Pattern/Reference>
- **Category**: <core/workflow/testing/safety/debugging/design/meta>
- **Location**: `skills/<category>/<skill-name>/SKILL.md`

### Files Created
| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill definition |
| `scripts/...` | [if applicable] |
| `references/...` | [if applicable] |

### Metadata
```yaml
name: <name>
description: "<description>"
```

### Key Sections
1. Core Principle: <summary>
2. Iron Law: <summary>
3. Main Content: <summary>

### Integrations
- Works with: `<skill1>`, `<skill2>`

### Next Steps
- [ ] Review and customize the skill
- [ ] Test with real scenarios
- [ ] Add to skills/README.md
```

### Tips

1. **Be specific in descriptions** - "Use when X" not "General purpose"
2. **Keep SKILL.md lean** - Move details to references/
3. **Test first** - Validate skill solves a real problem
4. **Match freedom to fragility** - Strict scripts for error-prone ops, loose guidance for flexible workflows

### Cross-Platform Compatibility

Skills created with this format work with:
- **Claude Code**: `~/.claude/skills/` or `.claude/skills/`
- **OpenAI Codex CLI**: `~/.codex/skills/`
- **ChatGPT**: Via skills plugin

The SKILL.md format is the open standard for agent skills.

Execute the skill creation task now.
