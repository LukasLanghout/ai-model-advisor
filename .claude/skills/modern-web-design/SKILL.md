---
name: modern-web-design
description: Apply 2024-2025 modern web design principles including bold minimalism, micro-interactions, glassmorphism, staggered reveals, scroll animations, performance-first patterns, and WCAG AAA accessibility. Use when improving UI/UX, adding visual polish, designing components, or upgrading the look and feel of a web app.
---

# Modern Web Design Skill

## Core Principles (2024-2025)

- **Performance-first**: Core Web Vitals (LCP < 2.5s, INP < 200ms), GPU-accelerated transforms only
- **Bold minimalism**: Fluid typography, limited color palettes, generous whitespace
- **Micro-interactions**: Meaningful hover/focus/tap feedback on every interactive element
- **Accessibility**: WCAG AAA contrast (7:1), 44×44px touch targets, `prefers-reduced-motion`, ARIA labels

## Seven Primary Patterns

1. **Immersive Hero** — Full-viewport with gradient/3D bg, fluid type, scroll indicator
2. **Staggered Reveals** — Sequential content animations with cascading timing (staggerChildren)
3. **Glassmorphism** — `backdrop-blur`, semi-transparent backgrounds, layered depth
4. **Data Visualization** — Count-up animations, chart reveals on scroll
5. **Page Transitions** — Slide/crossfade between routes via AnimatePresence
6. **Micro-interactions** — `whileHover`, `whileTap`, magnetic buttons, focus rings
7. **Skeleton Screens** — Content-shaped loading placeholders before data arrives

## Animation Rules

```
ALWAYS:
- Use transform (translateX/Y, scale, opacity) — GPU-accelerated
- Respect prefers-reduced-motion (useReducedMotion hook in Framer Motion)
- Duration: 150-350ms for UI feedback, 400-600ms for page transitions
- Ease: spring physics for organic feel, ease-out for entrances

NEVER:
- Animate layout properties (width, height, top, left) — causes reflow
- Auto-play >5s animations without user trigger
- Skip keyboard navigation on animated elements
```

## Tailwind + Framer Motion Combination

```tsx
// Staggered grid pattern
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } } };

// Page transition
<motion.div key={route} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} />

// Card hover
<motion.div whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }} />
```

## Color & Typography

- Use `text-balance` for headings
- Gradient text: `bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent`
- Subtle gradient backgrounds: `bg-gradient-to-br from-slate-50 to-brand-50/30`
- Glass card: `bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg`
