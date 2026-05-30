# NEONWERKS — Next-Gen 3D Animated Web Pipeline

A premium dark-mode landing page presenting a **3D Creative Pipeline** of four
custom interactive WebGL tools, built with **Vite + React + TypeScript +
Tailwind CSS + Framer Motion + Three.js (React Three Fiber)**.

## Quick start

```bash
cd neonwerks
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check (tsc -b) + production bundle
npm run preview  # serve the production build
```

## What's inside

### Sections
- **Hero** — animated headline, gradient brand type, stat row, scroll cue.
- **Pipeline grid** — four live tool cards connected by **animated SVG
  connectors** that are measured live from the DOM (`ResizeObserver`), so the
  lines re-route correctly across the 4-up row, 2×2 grid and stacked mobile
  layouts.
- **Live showcase** — a CSS/SVG **laptop mockup** whose screen renders all four
  effects combined in one R3F canvas, with a layered UI/typography overlay.

### The four tools
| # | Tool | Technique |
|---|------|-----------|
| 01 | **String Tune** | Kinetic typography on an animated sine-wave SVG `textPath`; amplitude & frequency lerp toward the cursor. |
| 02 | **Astrodither** | Low-poly cube / sphere / torus rendered with a custom **GLSL ordered-dither (Bayer 4×4)** shader + animated grain. |
| 03 | **Smoothie** | Icosahedron displaced by layered **simplex noise** in the vertex shader; the blob lerps toward the pointer with high damping. |
| 04 | **AI Particle Simulator** | 3,400-point `<points>` cloud with an additive glow shader and a real **repulsion field** that scatters particles from the cursor. |

## Architecture & performance
- **Modular** — one component per card (`cards/*Card.tsx`), shared UI in `ui/`,
  GLSL kept in `shaders/*.glsl.ts`.
- **Zero-rerender animation** — every Three.js loop runs in `useFrame` /
  `requestAnimationFrame` and mutates refs / buffer attributes directly; React
  state is never touched per frame.
- **Pointer without re-renders** — `usePointer` writes pointer data into a ref.
- **Responsive** — adaptive `dpr={[1, 2]}`, fluid Tailwind grids, live-measured
  connectors, and a mobile nav.
- **Accessible** — honours `prefers-reduced-motion`.

## Tech stack
React 18 · TypeScript 5 · Vite 5 · Tailwind CSS 3 · Framer Motion 11 ·
three 0.169 · @react-three/fiber 8 · @react-three/drei 9
