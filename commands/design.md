# Design

Create professional, modern websites with shadcn/ui, Tailwind CSS, and anti-AI-slop design principles.

## Task
$ARGUMENTS

## Decision Tree

```
No arguments or "help"          → Show design commands overview
"setup"                         → Install design skills and dependencies
"[description of what to build]" → Design and build it
"tokens [style]"                → Generate design tokens for a style
"audit [url or path]"           → Audit an existing design
"blocks [category]"             → Browse shadcn blocks by category
"reference"                     → Show the design skills registry
```

---

## SETUP Flow

Install the recommended design skills stack.

### Step 1: Check Current Skills

```bash
ls .claude/skills/frontend-design-ultimate 2>/dev/null && echo "ULTIMATE_INSTALLED" || echo "ULTIMATE_MISSING"
ls .claude/skills/external/frontend-design 2>/dev/null && echo "REFERENCE_INSTALLED" || echo "REFERENCE_MISSING"
```

### Step 2: Install Core Skills

**Skill 1: Ultimate Frontend Design (anti-AI-slop)**
```bash
git clone https://github.com/kesslerio/ultimate-frontend-design-openclaw-skill .claude/skills/frontend-design-ultimate 2>/dev/null || echo "Already installed or git not available"
```

**Skill 2: Shadcnblocks (2,500+ UI blocks)**
```bash
claude plugin marketplace add masonjames/Shadcnblocks-Skill
claude plugin install shadcnblocks
```

**Skill 3: Tailwind v4 + shadcn**
```bash
npx tessl i github:secondsky/claude-skills --skill tailwind-v4-shadcn
```

**Skill 4: UI/UX Design (ClawHub, optional)**
```bash
clawhub install ui-ux-design 2>/dev/null || echo "ClawHub not installed - skip or run: npm i -g clawhub"
```

### Step 3: Verify

```bash
echo "=== Installed Design Skills ==="
ls -d .claude/skills/frontend-design* 2>/dev/null
ls -d .claude/skills/external/frontend-design* 2>/dev/null
```

### Output

```
## Design Skills Installed

**Core:**
- [x] ultimate-frontend-design — Anti-AI-slop design system
- [x] shadcnblocks — 2,500+ pre-built UI blocks
- [x] tailwind-v4-shadcn — Tailwind v4 + shadcn setup
- [ ] ui-ux-design — Modern UI/UX principles (optional)

**Reference:**
- Design skills registry at .claude/skills/external/frontend-design/references/

**Usage:**
- `/design [describe what you want]` — Build it
- `/design tokens corporate` — Generate design tokens
- `/design blocks hero` — Browse hero section blocks
- `/design audit` — Audit current project's design
```

---

## BUILD Flow (default when description provided)

You are a frontend designer and developer. Follow these principles strictly:

### Design Philosophy

```
╔══════════════════════════════════════════════════════════════╗
║  ANTI-AI-SLOP RULES — Mandatory for all designs             ║
║                                                              ║
║  ✗ No generic purple/blue gradients                          ║
║  ✗ No Inter font as default (choose with intention)          ║
║  ✗ No centered-everything layouts                            ║
║  ✗ No rainbow gradient text                                  ║
║  ✗ No floating cards with generic shadows                    ║
║  ✗ No stock hero with gradient overlay                       ║
║                                                              ║
║  ✓ Distinctive typography that fits the brand                ║
║  ✓ Intentional color palette from brand identity             ║
║  ✓ Asymmetric layouts with deliberate spatial tension        ║
║  ✓ Orchestrated motion (not just fade-in-everything)         ║
║  ✓ Textural depth (grain, noise, atmospheric effects)        ║
║  ✓ Mobile-first responsive design                            ║
║  ✓ WCAG accessibility compliance                             ║
╚══════════════════════════════════════════════════════════════╝
```

### Process

1. **Understand the brief**: What is the brand? Who is the audience? What feeling should it evoke?

2. **Choose the stack**:
   - Static/content site → Astro + Tailwind + shadcn/ui
   - Full-stack app → Next.js + Tailwind + shadcn/ui
   - SPA → Vite + React + Tailwind + shadcn/ui

3. **Define design tokens** before writing any components:
   - Color palette (brand-specific, not defaults)
   - Typography (font pairing with character)
   - Spacing scale (generous whitespace)
   - Border radius strategy
   - Shadow/elevation system
   - Animation timing functions

4. **Select shadcn blocks** for the page structure:
   - Reference the shadcnblocks skill for pre-built sections
   - Customize colors, typography, and spacing to match tokens
   - Don't use blocks as-is — adapt them to the brand

5. **Build mobile-first**: Start with the smallest viewport, enhance upward

6. **Add motion last**: Purposeful animations that guide attention, not decoration

7. **Verify**:
   - Does it look like every other AI-generated site? → Redesign
   - Would a human designer be proud of this? → Ship it
   - Is it accessible? → Test with keyboard and screen reader

### Style Presets

When the user doesn't specify a style, ask. Offer these presets:

| Preset | Characteristics | Example |
|--------|---------------|---------|
| **corporate** | Clean, minimal, generous whitespace, neutral palette, subtle transitions | mont-fort.com |
| **startup** | Bold, energetic, bright accents, dynamic layouts, playful motion | Linear, Vercel |
| **editorial** | Typography-focused, serif headers, reading-optimized, content-first | Medium, Substack |
| **dark-tech** | Dark backgrounds, neon accents, glass morphism, futuristic | GitHub, Raycast |
| **luxury** | Elegant, restrained, gold/cream accents, serif fonts, slow animations | Fashion brands |
| **saas** | Dashboard-ready, data-dense, sidebar nav, card grids, charts | Stripe, Notion |

---

## TOKENS Flow

Generate design tokens for a specified style.

Ask the user for:
1. **Style preset** (corporate, startup, editorial, dark-tech, luxury, saas)
2. **Brand colors** (if they have them)
3. **Font preferences** (serif, sans-serif, monospace, or specific fonts)

Then generate a complete token set:

```typescript
// design-tokens.ts
export const tokens = {
  colors: {
    background: "hsl(0 0% 100%)",
    foreground: "hsl(222 47% 11%)",
    primary: "hsl(217 33% 17%)",
    secondary: "hsl(220 14% 84%)",
    accent: "hsl(210 40% 96%)",
    muted: "hsl(210 40% 96%)",
    destructive: "hsl(0 84% 60%)",
    // ... complete palette
  },
  typography: {
    fontFamily: {
      heading: '"Playfair Display", serif',
      body: '"Source Sans 3", sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
    fontSize: { /* scale */ },
    lineHeight: { /* scale */ },
  },
  spacing: { /* scale */ },
  borderRadius: { /* scale */ },
  shadows: { /* elevation system */ },
  transitions: { /* timing functions */ },
};
```

Also generate the corresponding Tailwind config and CSS variables.

---

## AUDIT Flow

Analyze an existing design for quality and AI-slop indicators.

### For a URL

```bash
# Take a screenshot if browser tools available
# Otherwise ask user to provide screenshots or describe the design
```

### For a Local Project

```bash
# Check for Tailwind config
cat tailwind.config.* 2>/dev/null
cat postcss.config.* 2>/dev/null

# Check for design tokens / theme
find . -name "*.css" -path "*/globals*" | head -5
find . -name "theme*" -o -name "tokens*" -o -name "design-system*" | head -10

# Check component library
cat components.json 2>/dev/null
```

### Audit Checklist

Score each item 0-10:

```
## Design Audit Report

**Overall Score:** X/100

### Typography (0-20)
- [ ] Font choice is distinctive (not just Inter/system)
- [ ] Clear hierarchy (heading → subheading → body → caption)
- [ ] Line height and letter spacing are intentional
- [ ] Font pairing works (if using multiple fonts)

### Color (0-20)
- [ ] Palette is intentional and brand-appropriate
- [ ] Not using default framework colors
- [ ] Sufficient contrast ratios (WCAG AA minimum)
- [ ] Dark mode is cohesive (not just inverted)

### Layout (0-20)
- [ ] Not just centered-everything
- [ ] Grid or spatial system is consistent
- [ ] Whitespace is generous and intentional
- [ ] Mobile layout is designed (not just responsive collapse)

### Motion (0-15)
- [ ] Animations have purpose (guide attention, show state)
- [ ] Timing feels natural (not all 300ms linear)
- [ ] Page transitions are smooth
- [ ] Respects prefers-reduced-motion

### Polish (0-15)
- [ ] No generic shadows/borders
- [ ] Loading states exist
- [ ] Error states are designed
- [ ] Empty states are designed
- [ ] Hover/focus states are intentional

### Accessibility (0-10)
- [ ] Keyboard navigable
- [ ] Screen reader friendly
- [ ] Color not the only indicator
- [ ] Focus indicators visible
```

---

## BLOCKS Flow

Browse and suggest shadcn blocks by category.

Available categories:
```
hero, features, pricing, cta, testimonials, faq,
team, blog, gallery, contact, footer, navbar,
sidebar, dashboard, stats, charts, tables,
auth, settings, profile, notifications,
ecommerce, cart, checkout, product
```

For the requested category, suggest the best blocks from shadcnblocks and provide installation commands.

---

## REFERENCE Flow

Read and present the design skills registry:

```bash
cat .claude/skills/external/frontend-design/references/design-skills-registry.md
```

---

## Tips

### Pair with Other CodeAssist Commands

```bash
/design corporate landing page for a trading company  # Design it
/review                                                 # Review the code
/e2e landing page flows                                # Test interactions
/benchmark core web vitals                             # Performance check
/evidence screenshot the landing page                  # Visual QA
```

### With GSD

```bash
/gsd:discuss "Design a corporate website like mont-fort.com"
/gsd:plan    # Creates design tasks
/gsd:execute # Runs /design for each section
/gsd:verify  # Visual QA + accessibility audit
```

### With OpenClaw

```bash
/openclaw project "Design and build a corporate trading company website with Astro, Tailwind v4, shadcn/ui. Style: clean, minimal, professional like mont-fort.com"
```

**Execute the appropriate flow based on user arguments. If a description is provided, go straight to the BUILD flow.**
