# Frontend Design Skills Registry

Curated list of design skills for building modern, professional websites with Claude Code.

## Tier 1: Core Design Skills (Install These First)

### ultimate-frontend-design

**Anti-AI-slop design.** Generates bold, memorable websites from plain text descriptions.

| Field | Value |
|-------|-------|
| Source | [kesslerio/ultimate-frontend-design](https://github.com/kesslerio/ultimate-frontend-design-openclaw-skill) |
| Stack | React + Tailwind CSS + shadcn/ui |
| Install (OpenClaw) | `clawhub install frontend-design-ultimate` |
| Install (Claude Code) | `git clone https://github.com/kesslerio/ultimate-frontend-design-openclaw-skill .claude/skills/frontend-design-ultimate` |

**Design principles:**
- Typography distinctiveness — no ubiquitous Inter/system fonts
- Intentional color palettes — no default purple gradients
- Deliberate spatial composition — not just centered everything
- Orchestrated motion — animations with purpose
- Textural depth — grain, noise, atmospheric effects

**Pairs with:** `design-taste-frontend` for stricter anti-slop enforcement.

---

### shadcnblocks

**2,500+ pre-built UI blocks.** Claude picks the right components for your description.

| Field | Value |
|-------|-------|
| Source | [masonjames/Shadcnblocks-Skill](https://github.com/masonjames/Shadcnblocks-Skill) |
| Coverage | 1,338 blocks (71 categories) + 1,189 components (60+ groups) |
| Install | `claude plugin marketplace add masonjames/Shadcnblocks-Skill && claude plugin install shadcnblocks` |

**Block categories:**
- Landing pages: hero, features, pricing, CTA, testimonials
- Dashboards: charts, data tables, sidebars, stats
- E-commerce: product cards, cart, checkout, galleries
- Content: blog, FAQ, team, timeline
- Structure: navbar, footer, breadcrumbs, pagination

---

### tailwind-v4-shadcn

**Production-tested Tailwind v4 + shadcn/ui setup.**

| Field | Value |
|-------|-------|
| Source | [secondsky/claude-skills](https://tessl.io/registry/skills/github/secondsky/claude-skills/tailwind-v4-shadcn) |
| Review Score | 93% |
| Install | `npx tessl i github:secondsky/claude-skills --skill tailwind-v4-shadcn` |

**Covers:**
- `@theme` inline pattern for CSS variable architecture
- Dark mode via ThemeProvider
- Vite + React configuration
- v3 → v4 migration gotchas
- `@tailwindcss/typography` and `@tailwindcss/forms` plugins

## Tier 2: Specialized Design Skills

### ui-ux-design (ClawHub)

Modern UI/UX principles: 2026 trends, micro-interactions, WCAG accessibility, responsive design.

```bash
clawhub install ui-ux-design
```

### shadcn-ui (ClawHub)

shadcn/ui component reference and patterns.

```bash
clawhub install shadcn-ui
```

### web-accessibility

WCAG compliance, ARIA patterns, color contrast, keyboard navigation.

```bash
clawhub install web-accessibility
```

## Animation & Motion Skills

### web-animation (built-in)

GSAP ScrollTrigger, Lenis smooth scroll, parallax, page transitions. 9 production patterns.

**Location:** `skills/design/web-animation/SKILL.md`
**Patterns:** fade-reveal, stagger, parallax, sticky, horizontal-scroll, text-split, clip-reveal, counter, page-load-sequence
**Libraries:** GSAP + ScrollTrigger, Lenis, Barba.js, Framer Motion

### claudedesignskills (22 skills)

Full animation skillstack: GSAP, Three.js, React Three Fiber, Framer Motion, Babylon.js, Locomotive Scroll, Barba.js, Lottie, anime.js, React Spring, and more.

```bash
claude plugin marketplace add freshtechbro/claudedesignskills
```

**Source:** [freshtechbro/claudedesignskills](https://github.com/freshtechbro/claudedesignskills)
**Quality:** Production-ready, 50+ generators, comprehensive API references

### Frontend Design Toolkit (70+ tools)

Curated collection of design skills, animation skills, theming, and Figma integration.

**Source:** [Claude-Code-Frontend-Design-Toolkit](https://github.com/wilwaldon/Claude-Code-Frontend-Design-Toolkit)
**Highlights:** UI/UX Pro Max (240+ styles), Taste Skill (variance knobs), 11 named aesthetics, Figma MCP

### threejs-skills (10 skills)

Deep Three.js reference: geometry, materials, lighting, shaders, post-processing, skeletal animation, raycasting. API-audited against r160+.

```bash
git clone https://github.com/cloudai-x/threejs-skills .claude/skills/external/threejs
```

**Source:** [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills) (1.7k stars)
**When to use:** 3D product showcases, WebGL backgrounds, interactive 3D scenes, particle effects
**Skills:** fundamentals, geometry, materials, lighting, textures, animation, loaders, shaders, postprocessing, interaction

---

## Tier 3: Specialized Frameworks

### Astro

For static/content sites like mont-fort.com:
- Content collections, view transitions
- Island architecture for partial hydration
- Integrates with Tailwind + shadcn/ui

### Next.js

For full-stack React apps:
- Server components, app router
- Vercel deployment
- shadcn/ui first-class support

## Design Tokens: Corporate/Professional Style

For sites like mont-fort.com (clean, corporate, minimal):

```css
/* Color palette */
--background: 0 0% 100%;           /* White */
--foreground: 222 47% 11%;         /* Near-black */
--muted: 220 14% 84%;             /* #c0c6d6 gray */
--accent: 217 33% 17%;            /* Dark blue-gray */

/* Typography */
font-family: "Inter var", system-ui; /* Or a distinctive serif */
font-size-base: 1rem;
line-height: 1.75;

/* Spacing */
--section-padding: 6rem 0;        /* Generous whitespace */
--container-max: 1200px;

/* Transitions */
--transition-default: 300ms ease;
opacity transitions for page loads;
view-transition-name for route changes;
```

## Design Anti-Patterns (AI Slop to Avoid)

| Pattern | Why It's Bad | Do Instead |
|---------|-------------|------------|
| Purple gradients on everything | Generic, screams "AI generated" | Intentional palette from brand |
| Inter font everywhere | Indistinct, forgettable | Choose typography with character |
| Centered everything | Boring, no visual hierarchy | Asymmetric layouts, grid tension |
| Rainbow gradient text | Overdone, cheap feeling | Subtle color accents |
| Excessive rounded corners | Toyish, unprofessional | Mix sharp and soft |
| Stock hero with gradient overlay | Every AI site looks like this | Photography, illustration, or abstract |
| Floating cards with shadows | Generic dark-mode pattern | Borders, lines, negative space |

## External Resources

- [Shadcn Studio](https://shadcnstudio.com/) — Live theme generator
- [Shadcn Templates](https://shadcntemplates.com/) — Template collection
- [awesome-shadcn-ui](https://github.com/birobirobiro/awesome-shadcn-ui) — Curated resource list
- [Tailwind UI](https://tailwindui.com/) — Official component library (paid)
- [Aceternity UI](https://ui.aceternity.com/) — Animated components
- [Magic UI](https://magicui.design/) — Landing page components
