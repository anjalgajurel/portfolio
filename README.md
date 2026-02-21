# Portfolio — Anjal Gajurel

Lean, luxury portfolio website inspired by the Uchi restaurant design system. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools.

## Design

- **Style:** Uchi-inspired — warm, minimal, intentional. Gold borders, lowercase headings, scroll-driven animations
- **Palette:** Warm cream (#F2E8DE), terracotta (#AE483C), charcoal (#4E4B48), dark gold (#7D623F), gold border (#C39367)
- **Typography:** Inter (300/400/500) — fluid sizing with `clamp()`, all-lowercase headings, `.eyebrow` accents
- **Animations:** GSAP 3 + ScrollTrigger — fade-up reveals, parallax, scale-on-scroll, gingko leaf fall, direction-aware sticky header

## Structure

```
index.html              — Single-page portfolio
assets/css/site.css     — Uchi design tokens, mobile-first responsive
assets/js/site.js       — GSAP animations, sticky header, side-nav, contact form
assets/img/             — SVGs (kanji, logotype, gingko), project screenshots, wood-bg texture
assets/fonts/           — Font files (placeholder)
```

## Sections

1. **Hero** — Kanji hover-reveal, logotype, gingko leaf animations, wood-bg texture, parallax plate image
2. **About** — Two-column layout with gold border, scale-on-scroll image, text reveal animations
3. **Work** — 2-column card grid with scale-on-hover images, gold border cards, tech tags
4. **Experience** — Vertical timeline with terracotta markers and gold border line
5. **Skills** — 4-column grid with subtle border-separated lists
6. **Contact** — Dark (terracotta) section with material-style floating label form
7. **Footer** — Multi-column with gold borders, logotype, navigation links

## Running Locally

Open `index.html` in any browser. No build step required.

## Responsive

- Mobile-first (375px base)
- Tablet (768px+): two-column layouts, expanded spacing
- Desktop (992px+): side-by-side welcome, 4-col skills, full nav
- Large (1200px+): max container width, generous padding
