---
name: motion-framer
description: Add declarative, performant animations to React components using Framer Motion (motion library). Use when animating page transitions, list/grid stagger reveals, hover/tap micro-interactions, scroll-triggered effects, exit animations, or shared element transitions. Auto-activates when creating or editing React UI components that need movement or visual feedback.
---

# Motion / Framer Motion Skill

## Installation
```bash
npm install framer-motion
```

## Core Patterns

### 1. Basic entrance
```tsx
import { motion } from 'framer-motion';
<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }} />
```

### 2. Staggered children (lists, grids)
```tsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};
<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => <motion.li key={i.id} variants={item}>…</motion.li>)}
</motion.ul>
```

### 3. Page transitions with AnimatePresence
```tsx
import { AnimatePresence, motion } from 'framer-motion';
<AnimatePresence mode="wait">
  <motion.div key={page} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
    {children}
  </motion.div>
</AnimatePresence>
```

### 4. Micro-interactions
```tsx
<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>Click</motion.button>
<motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>Card</motion.div>
```

### 5. Scroll-triggered reveals
```tsx
<motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.4 }}>
  Content revealed on scroll
</motion.div>
```

### 6. Exit animations (AnimatePresence)
```tsx
<AnimatePresence>
  {isVisible && (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
      Modal / toast / panel
    </motion.div>
  )}
</AnimatePresence>
```

## prefers-reduced-motion

```tsx
import { useReducedMotion } from 'framer-motion';

function AnimatedCard() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.3 }}
    />
  );
}
```

## Performance Rules
- ✅ Animate: `opacity`, `x`, `y`, `scale`, `rotate` — GPU-accelerated
- ❌ Avoid: `width`, `height`, `top`, `left`, `margin` — causes layout reflow
- Use `layout` prop for size/position changes to let Motion handle reflow
- `once: true` on `viewport` prevents re-triggering on scroll back
