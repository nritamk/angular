# JustVish Creative Studios

> **We don't just film. We tell your story.**

A cinematic, scroll-driven Angular site for a premium video-production studio. Built with standalone components, signals, GSAP ScrollTrigger, and a tight brand system.

---

## Tech stack

- **Angular 18** — standalone components, `@for` control flow, `signal()`
- **GSAP 3 + ScrollTrigger** — scroll camera, parallax, fade-ins
- **SCSS** — variables, mixins, fluid typography
- **Poppins + Lora** — Google Fonts (loaded in `index.html`)

---

## Project structure

```
angular/
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.scss               # design tokens + globals
    ├── assets/                   # SVG cinematic placeholders
    │   ├── hero-camera.svg
    │   ├── section-brand.svg
    │   ├── section-strategy.svg
    │   ├── section-production.svg
    │   └── section-design.svg
    └── app/
        ├── app.config.ts
        ├── app.routes.ts
        ├── app.component.{ts,html,scss}
        └── components/
            ├── navbar/           # floating pill nav, shrinks on scroll
            ├── hero-section/     # split layout, parallax, animated entrance
            ├── story-section/    # reusable, 4 alternating service blocks
            ├── scroll-camera/    # GSAP-driven scrolling camera anchor
            └── footer/           # CTA, contact, social
```

---

## Run it

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (opens http://localhost:4200)
npm start

# 3. Production build
npm run build
```

Requires Node 18.19+ or 20.11+.

---

## Design system

Tokens are exposed as CSS variables on `:root` in [src/styles.scss](src/styles.scss).

| Token                          | Value      |
| ------------------------------ | ---------- |
| `--color-base-white`           | `#FFFFFF`  |
| `--color-base-black`           | `#1C1C1C`  |
| `--color-accent-green-mid`     | `#5B9A3A`  |
| `--color-accent-green-lt`      | `#8DC468`  |
| `--color-accent-green-dark`    | `#3A6B1F`  |
| `--color-accent-green-pale`    | `#B5D98A`  |
| `--color-bg-secondary`         | `#C8E6A0`  |
| `--color-section-bg-green`     | `#5C8F35`  |
| `--color-text-body`            | `#333333`  |
| `--color-text-secondary`       | `#666666`  |

Headings/UI use **Poppins**; storytelling body uses **Lora**.
Layout grid: 12-col, max-width `1200px`, generous whitespace, pill buttons.

---

## The scroll camera

[`ScrollCameraComponent`](src/app/components/scroll-camera/scroll-camera.component.ts) renders a fixed rail down the center of the story track. A GSAP `ScrollTrigger` with `scrub` ties scroll progress to the camera's `y`, `rotation`, and `scale` — so it travels downward, sways slightly, and pulses through the four service sections. The progress line fills behind it as you scroll.

To customize, edit the `onUpdate` handler in [scroll-camera.component.ts](src/app/components/scroll-camera/scroll-camera.component.ts).

---

## Replacing the placeholder imagery

The five SVGs in [src/assets](src/assets) are cinematic placeholders built in the brand palette so the site looks finished out of the box. Swap them for real photography by dropping files at the same paths and updating the `<img src>` references in:

- [hero-section.component.html](src/app/components/hero-section/hero-section.component.html) — `hero-camera.*`
- [app.component.ts](src/app/components/../app.component.ts) — section image paths

### Suggested AI-image prompts

If you'd like to generate photoreal versions, use prompts like:

1. **Hero** — *"Cinematic medium-close portrait of a creative director holding a professional cinema camera up to their eye, golden-hour rim light, deep green and amber tones, shallow depth of field, 50mm anamorphic look, photoreal, vertical composition."*
2. **Brand Identity** — *"Overhead flat-lay of a brand moodboard — typography swatches, color chips in mossy greens, polaroids and a vintage camera, soft window light, photoreal, editorial."*
3. **Communication Strategy** — *"Director and strategist studying a wall of storyboard frames in a softly-lit studio, warm tungsten + cool fill, cinematic, photoreal."*
4. **Film Production** — *"On-set cinematographer operating a cinema camera on a tripod, golden practical lights bokeh in background, deep shadows, anamorphic, photoreal."*
5. **Creative Design** — *"Designer's desk with film stills, color swatch books, a vintage Leica, soft natural light, mossy-green and cream palette, top-down, photoreal."*

Keep aspect ratio at **4:5** for sections and **4:5** for the hero visual to avoid layout shift.

---

## Animation reference

| Element              | Effect                                                       |
| -------------------- | ------------------------------------------------------------ |
| Navbar               | Shrinks + heavier shadow after `40px` scroll                 |
| Hero text            | Staggered fade + slide on mount (GSAP timeline)              |
| Hero visual          | Mouse-move parallax (subtle, ~14px range)                    |
| Story sections       | Fade + slide on enter (`ScrollTrigger`, `start: top 75%`)    |
| Story numbers        | Float upward on scroll (`scrub: 1`)                          |
| Camera               | Travels down the rail with rotation + scale (`scrub: 0.6`)   |
| Buttons              | `translateY(-2px) scale(1.04)` + green glow on hover         |

---

## Responsive

- **Desktop ≥960px** — full split layouts, scroll camera visible
- **Tablet & mobile <960px** — stacked sections, camera rail hidden, hamburger menu, image stacks above text

---

## License

© JustVish Creative Studios — All rights reserved.
