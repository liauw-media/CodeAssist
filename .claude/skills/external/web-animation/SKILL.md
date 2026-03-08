---
name: web-animation
description: Build immersive, scroll-driven websites with GSAP ScrollTrigger, Lenis smooth scroll, parallax effects, and cinematic page transitions. Use when building premium corporate sites, landing pages, or marketing microsites that need motion and polish beyond static designs.
---

# Web Animation

Build websites with scroll-driven animations, parallax, smooth scrolling, and page transitions — the kind of motion that makes a site feel premium (like mont-fort.com, linear.app, stripe.com).

## When to Use This Skill

- Building corporate/luxury/editorial websites that need motion
- Adding scroll-triggered animations to existing pages
- Creating parallax sections, sticky reveals, or cinematic scroll experiences
- Implementing smooth scrolling with Lenis
- Adding page transitions (Astro View Transitions, Barba.js)
- When `/design` produces good static design but needs animation layer

## Tech Stack Decision

```
Static site with animations?
  Astro + GSAP + Lenis + View Transitions (recommended)

React/Next.js app?
  Next.js + Framer Motion + Lenis + GSAP ScrollTrigger

Vanilla HTML?
  GSAP + ScrollTrigger + Lenis + Barba.js
```

## Core Libraries

### 1. Lenis — Smooth Scroll (always install)

```bash
npm install lenis
```

```typescript
// src/lib/lenis.ts
import Lenis from 'lenis'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
})

function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

export default lenis
```

```css
/* Required CSS */
@import 'lenis/css';

html.lenis, html.lenis body {
  height: auto;
}
.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}
```

### 2. GSAP + ScrollTrigger — Scroll Animations

```bash
npm install gsap
```

```typescript
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Sync Lenis with ScrollTrigger
import lenis from './lenis'
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

### 3. Framer Motion (React/Next.js only)

```bash
npm install motion
```

```tsx
import { motion, useScroll, useTransform } from 'motion/react'

function ParallaxSection() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -200])

  return <motion.div style={{ y }}>Content</motion.div>
}
```

## Animation Patterns

### Pattern 1: Fade + Slide on Scroll (most common)

```typescript
// Reveal elements as they enter viewport
gsap.utils.toArray('.reveal').forEach((el) => {
  gsap.from(el as Element, {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el as Element,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  })
})
```

```html
<section class="reveal">
  <h2>Section Title</h2>
  <p>Content fades in as you scroll</p>
</section>
```

### Pattern 2: Staggered Children

```typescript
gsap.utils.toArray('.stagger-group').forEach((group) => {
  const children = (group as Element).querySelectorAll('.stagger-item')
  gsap.from(children, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: group as Element,
      start: 'top 80%',
    },
  })
})
```

### Pattern 3: Parallax Image

```typescript
gsap.utils.toArray('.parallax-img').forEach((img) => {
  gsap.to(img as Element, {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: {
      trigger: img as Element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
})
```

```css
.parallax-container {
  overflow: hidden;
  position: relative;
}
.parallax-img {
  width: 100%;
  height: 120%; /* Extra height for parallax travel */
  object-fit: cover;
}
```

### Pattern 4: Sticky Section with Progress

```typescript
const section = document.querySelector('.sticky-section')
const content = section?.querySelector('.sticky-content')

ScrollTrigger.create({
  trigger: section,
  start: 'top top',
  end: '+=200%',
  pin: true,
  scrub: 1,
  onUpdate: (self) => {
    // Use self.progress (0-1) to drive animations
    gsap.to(content, { opacity: self.progress, y: -50 * self.progress })
  },
})
```

### Pattern 5: Horizontal Scroll Section

```typescript
const container = document.querySelector('.horizontal-scroll')
const panels = gsap.utils.toArray('.panel')

gsap.to(panels, {
  xPercent: -100 * (panels.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: container,
    pin: true,
    scrub: 1,
    snap: 1 / (panels.length - 1),
    end: () => '+=' + (container as HTMLElement).offsetWidth,
  },
})
```

### Pattern 6: Text Split + Reveal

Use a safe DOM approach for splitting text into animatable elements:

```typescript
function splitText(element: Element) {
  const text = element.textContent || ''
  const words = text.split(' ')

  // Clear and rebuild with spans using DOM API
  element.textContent = ''
  words.forEach((word, i) => {
    const outer = document.createElement('span')
    outer.className = 'word'
    outer.style.display = 'inline-block'
    outer.style.overflow = 'hidden'

    const inner = document.createElement('span')
    inner.className = 'word-inner'
    inner.style.display = 'inline-block'
    inner.textContent = word

    outer.appendChild(inner)
    element.appendChild(outer)

    if (i < words.length - 1) {
      element.appendChild(document.createTextNode(' '))
    }
  })

  return element.querySelectorAll('.word-inner')
}

gsap.utils.toArray('.text-reveal').forEach((el) => {
  const words = splitText(el as Element)
  gsap.from(words, {
    yPercent: 100,
    duration: 0.8,
    stagger: 0.05,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el as Element,
      start: 'top 85%',
    },
  })
})
```

### Pattern 7: Image Clip Reveal

```typescript
gsap.utils.toArray('.clip-reveal').forEach((el) => {
  gsap.from(el as Element, {
    clipPath: 'inset(100% 0 0 0)',
    duration: 1.2,
    ease: 'power4.inOut',
    scrollTrigger: {
      trigger: el as Element,
      start: 'top 80%',
    },
  })
})
```

```css
.clip-reveal {
  clip-path: inset(0 0 0 0);
  will-change: clip-path;
}
```

### Pattern 8: Counter / Number Animation

```typescript
gsap.utils.toArray('.counter').forEach((el) => {
  const target = parseInt((el as Element).getAttribute('data-target') || '0')
  gsap.to(el, {
    textContent: target,
    duration: 2,
    ease: 'power2.out',
    snap: { textContent: 1 },
    scrollTrigger: {
      trigger: el as Element,
      start: 'top 85%',
    },
  })
})
```

### Pattern 9: Page Load Sequence

```typescript
// Run once on page load — orchestrated entrance
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

tl.from('.hero-title', { y: 80, opacity: 0, duration: 1 })
  .from('.hero-subtitle', { y: 40, opacity: 0, duration: 0.8 }, '-=0.5')
  .from('.hero-cta', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
  .from('.hero-image', {
    scale: 1.1,
    opacity: 0,
    duration: 1.2,
    clipPath: 'inset(10% 10% 10% 10%)',
  }, '-=0.8')
  .from('.nav', { y: -20, opacity: 0, duration: 0.5 }, '-=0.6')
```

## Page Transitions

### Astro View Transitions (recommended for Astro)

```astro
---
// src/layouts/Layout.astro
import { ViewTransitions } from 'astro:transitions'
---
<html>
  <head>
    <ViewTransitions />
  </head>
  <body>
    <slot />
  </body>
</html>
```

```astro
<!-- Named transitions for specific elements -->
<h1 transition:name="page-title" transition:animate="slide">
  {title}
</h1>
<img transition:name="hero-image" transition:animate="fade" src={image} />
```

### Barba.js (vanilla/multi-page)

```bash
npm install @barba/core
```

```typescript
import barba from '@barba/core'

barba.init({
  transitions: [{
    name: 'fade',
    leave(data) {
      return gsap.to(data.current.container, {
        opacity: 0,
        duration: 0.5,
      })
    },
    enter(data) {
      return gsap.from(data.next.container, {
        opacity: 0,
        duration: 0.5,
      })
    },
  }],
})
```

## Accessibility

**ALWAYS respect motion preferences:**

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

if (prefersReducedMotion.matches) {
  // Disable smooth scroll
  lenis.destroy()
  // Kill all ScrollTrigger animations
  ScrollTrigger.getAll().forEach((st) => st.kill())
  // Set all animated elements to final state
  gsap.set('.reveal, .stagger-item, .text-reveal', {
    opacity: 1,
    y: 0,
    clipPath: 'none',
  })
}
```

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Performance Rules

1. **Use `will-change` sparingly** — only on elements about to animate
2. **Animate transforms and opacity only** — never animate `width`, `height`, `top`, `left`
3. **Use `scrub: true`** for scroll-linked (not `scrub: 0.1` unless you need lag)
4. **Lazy load images** below the fold
5. **Use `gsap.set()` for initial states** instead of CSS (avoids FOUC)
6. **Kill ScrollTriggers on cleanup** (SPA route changes)

```typescript
// Cleanup pattern for React/Next.js
useEffect(() => {
  const ctx = gsap.context(() => {
    // All animations here
  }, containerRef)

  return () => ctx.revert() // Kills all animations + ScrollTriggers
}, [])
```

## Section Blueprint: Corporate Page (mont-fort.com style)

```
1. HERO
   - Full viewport height
   - Large serif heading with text-reveal animation
   - Subtle parallax background image
   - Scroll indicator at bottom (opacity pulse)
   - Page load sequence: title -> subtitle -> CTA -> image

2. INTRO / ADVANTAGE
   - Centered text block with generous padding
   - Fade + slide reveal on scroll
   - Supporting image with clip-reveal

3. FEATURES / SERVICES
   - Staggered card grid or alternating image-text rows
   - Each card fades in with stagger delay
   - Icons or images with parallax offset

4. LEADERSHIP / TEAM
   - Grid with hover effects (scale + overlay)
   - Staggered entrance

5. STATS / NUMBERS
   - Counter animation on scroll
   - Large display numbers

6. CTA / CONTACT
   - Sticky section or full-viewport
   - Background color transition

7. FOOTER
   - Theme-aware (dark/light based on scroll context)
   - Minimal, multi-column layout
```

## External Skills to Install

For maximum animation capability, install these alongside this skill:

```bash
# Option A: Full animation skillstack (22 skills)
claude plugin marketplace add freshtechbro/claudedesignskills

# Option B: Individual skills
# Lenis smooth scroll
npx -y @lobehub/market-cli skills install orkait-ai-skill-agent-lenis-react

# Scroll Experience Architect
npx -y @lobehub/market-cli skills install rootcastleco-rei-skills-scroll-experience
```

## Anti-Patterns

| Do NOT | Do Instead |
|--------|-----------|
| Animate everything on scroll | Pick 3-5 key moments per page |
| Use `bounce` or `elastic` easing on corporate sites | Use `power3.out` or `power4.inOut` |
| Apply parallax to text (readability) | Apply parallax to images/backgrounds only |
| Fade in every paragraph | Fade in section headings and key visuals |
| Use animation delays > 0.3s between items | Keep stagger tight: 0.1-0.2s |
| Ignore mobile (touch scrolling is different) | Test on real devices, reduce motion on mobile |
| Stack multiple animation libraries | Pick one primary: GSAP OR Framer Motion |

## Integration with /design

This skill extends the `/design` command. Use them together:

```bash
/design corporate landing page for energy company    # Static design
# Then add animation layer using this skill's patterns
```

Or request animation directly:

```bash
/design animated corporate site like mont-fort.com with scroll reveals and parallax
```
