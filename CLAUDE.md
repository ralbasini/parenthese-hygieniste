# Cabinet Parenthèse Hygiéniste — Website

## Project Overview

One-page website for **Cabinet Parenthèse Hygiéniste**, a dental hygiene practice in Grône (Valais, Switzerland) run by **Marine Ravaz-Largey**, dental hygienist. The site conveys a warm, holistic, and professional image combining clinical expertise with alternative medicine approaches.

Opening date: **1st October 2026**

---

## Technical Stack

- **Runtime**: Node.js
- **CSS**: Tailwind CSS v3 (JIT)
- **Bundler**: Vite (root: `src/`, publicDir: `../public`, outDir: `../dist`)
- **No framework**: vanilla JS only — no React, Vue, etc.
- **Package manager**: npm
- **Deployment**: GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)

### Project Structure

```
parenthese-hygieniste/
├── public/
│   ├── assets/
│   │   ├── fonts/          # Tan Mon Cheri (OTF), TT Chocolates, The Seasons
│   │   ├── images/         # Copied from ../resources/
│   │   └── icons/
├── src/
│   ├── index.html          # Main one-pager
│   ├── main.js             # Scroll behaviour, nav highlight, access gate
│   └── style.css           # Tailwind directives + custom @font-face + utilities
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
├── package.json
└── CLAUDE.md
```

---

## Brand Identity

### Color Palette

| Token              | Hex       | CSS var              | Usage                                         |
|--------------------|-----------|----------------------|-----------------------------------------------|
| `brand-brown`      | `#A05C3B` | —                    | Primary — logo, headings, accents, borders    |
| `brand-brown-dark` | `#5C3A28` | —                    | Body text, nav links (scrolled state)         |
| `brand-cream`      | `#F8F3EE` | —                    | Page background, section backgrounds          |
| `brand-beige`      | `#EDE4D8` | —                    | Alternate section tint, card backgrounds      |
| `brand-purple`     | `#8B7EC8` | `--brand-purple`     | Discrete accent — sampled from map pin in plan image |
| `white`            | `#FFFFFF` | —                    | Navbar on scroll, cards                       |

**Purple usage (discrete touches only):** ornamental `( )` parenthèses, nav active underline, scroll indicator, timeline years, list bullet dots, protocol card icons, access gate label. Brown remains the dominant colour everywhere else.

> Do not use pink/magenta. Stick to the brown/cream/purple palette.

### Typography

| Font              | File                          | Role                                    |
|-------------------|-------------------------------|-----------------------------------------|
| **Tan Mon Cheri** | `TanMonCheri.otf`             | Section titles (`section-title` class)  |
| **The Seasons**   | `TheSeasons.woff2` (+ italic) | Subheadings, name, elegant labels       |
| **TT Chocolates** | `TTChocolates-*.woff2`        | Body copy, nav, buttons, captions       |

Fallbacks (Google Fonts CDN): Cormorant Garamond → Tan Mon Cheri, Playfair Display → The Seasons, DM Sans → TT Chocolates.

Tailwind tokens:
```js
fontFamily: {
  display: ['"Tan Mon Cheri"', '"Cormorant Garamond"', 'Georgia', 'serif'],
  seasons: ['"The Seasons"', '"Playfair Display"', 'Georgia', 'serif'],
  body:    ['"TT Chocolates"', '"DM Sans"', 'system-ui', 'sans-serif'],
}
```

### Logos & Assets (in `public/assets/images/`)

| File                  | Usage                                        |
|-----------------------|----------------------------------------------|
| `logo-brun.png`       | Navbar logo, access gate                     |
| `logo-blanc.png`      | Hero section, footer                         |
| `logo-dent-brun.png`  | Cabinet section placeholder                  |
| `logo-dent-blanc.png` | **Favicon** (white tooth on brown bg)        |
| `signature.png`       | À propos section                             |
| `plan.jpg`            | Contact / access section                     |
| `toothbrush.jpg`      | Hero background (preloaded via `<link rel="preload">`) |

---

## Design Decisions & Constraints

### Buttons & Border Radius
- All buttons use `border-radius: 0.875rem` — matches the rounded rectangle corners of the logo shape. **Do not use pill shape (100px).**

### Navbar — Two Visual States
- **Transparent** (over hero): white nav links, white hamburger lines, "Rendez-vous" button has white background + purple text.
- **Scrolled** (`.scrolled` class added via JS at 60px): white background with blur, brown nav links, brown "Rendez-vous" border + text.
- Transition: `0.2s ease`.

### Hero
- Full-viewport, toothbrush photo background with brown overlay at `0.72 / 0.62 / 0.55` opacity (lighter than default to let the photo show through).
- White logo + italic tagline + outline CTA button.
- Parallax on scroll (JS-driven, no CSS transition on the element).
- "Découvrir" scroll indicator: white, bouncing animation.

### Protocol Cards — Layout Options
Three layout variants are currently in the page for client review (each with an "Option X" badge):
- **Option A** (cream bg): 3-column grid, generous padding (`3rem 2.5rem`), icon `3rem`.
- **Option B** (white bg): 2-column grid, horizontal card layout (icon left via CSS grid spanning rows).
- **Option C** (beige bg): single column (1 card per row), horizontal layout on 560px+, "Rendez-vous" button pinned bottom-right via CSS grid column 3.

Each card has a small "Rendez-vous →" button (`border-radius: 0.875rem`). Protocol card icons are purple (`var(--brand-purple)`).

### Scroll Animations
- Duration: `0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Stagger delays: `0.06s` per step up to `0.42s` (delay-7)
- IntersectionObserver threshold: `0.08`, rootMargin: `0px 0px -30px 0px`

### Mobile
- `overflow-x: hidden` on both `html` and `body`.
- Mobile menu uses a plain `.is-open` CSS class (not Tailwind's `hidden`) — Tailwind purge can drop dynamically-toggled classes in production.
- Hamburger toggle JS: `mobileMenu.classList.toggle('is-open', !isOpen)`.

### Access Gate (WIP preview)
- Full-screen overlay (`z-index: 9999`) with logo + "Site en construction" + code input.
- Code: **3979** (matches the postal code of Grône).
- Input: `type="text"` with `inputmode="numeric"` — **never `type="password"`** (password managers on HTTPS intercept the value).
- JS strips non-digit characters before comparing: `value.replace(/\D/g, '').slice(0, 4)`.
- Unlock state stored in `sessionStorage` (resets on tab close).

---

## Page Layout — One Pager

### Navigation (sticky top)

Links: Philosophie · À Propos · Cabinet · Protocoles · Contact
Logo left (tooth icon on mobile, full logo on desktop — currently full logo). CTA "Rendez-vous" button right-aligned.

---

### 1. Hero

- Full-viewport-height section
- Toothbrush photo with dark brown overlay
- White logo centered (`logo-blanc.png`)
- Opening badge: "Ouverture — 1er octobre 2026"
- Tagline: *«Votre santé orale, une parenthèse de bienveillance.»*
- CTA button: **Prendre rendez-vous**
- "Découvrir" scroll indicator (white, animated bounce)

---

### 2. Philosophie

Centered layout, ornamental `(` `)` in purple, large serif quote in `brand-brown`, body in TT Chocolates.

---

### 3. À Propos

Two-column (bio left, credential timeline right). Bio closes with signature image. Timeline years in purple. Affiliations below bio.

---

### 4. Cabinet

Placeholder grid (4 cards, "Photos à venir"). Photos to be provided later.

---

### 5. Protocoles sur Mesure

Seven service cards. Each card has: purple SVG icon, title (The Seasons), description, small "Rendez-vous →" button. Three layout options currently shown for client review (see Design Decisions above).

| Title                              | Summary |
|------------------------------------|---------|
| **Hygiène & Prévention**           | Plan d'hygiène personnalisé, élimination des dépôts, intervalle de séance adapté. |
| **Diagnocam KaVo**                 | Détection de carie sans rayons X par transillumination infrarouge et fluorescence. |
| **Pédodontie**                     | Prise en charge des enfants dans une atmosphère rassurante, à leur rythme. |
| **Aromathérapie**                  | Huiles essentielles pour soutenir le système immunitaire et apaiser le stress. |
| **Médecine Alternative**           | Approche holistique corps/âme/esprit, plan d'hygiène conscient. |
| **Acupressure**                    | Stimulation de points énergétiques, utile contre l'anxiété ou les réflexes nauséeux. |
| **Diagnostic de la Langue en MTC** | Lecture de la langue comme indicateur de l'état général. |

---

### 6. Contact & Accès

- Téléphone: `078/...` (WhatsApp)
- Email: `parenthese-hd@...`
- Horaires: Lun 12–20h · Mar 9–18h · Mer 13–18h · Jeu 7–17h · Ven 7–16h
- Adresse: Rue de Pramagnon 54, 3979 Grône
- Map: `plan.jpg` embedded as image
- CTA: "Rendez-vous en ligne" (URL TBD)
- Politique: *Les rendez-vous non annulés 24H à l'avance pourront être facturés.*

---

### 7. Collaborations

- Parodontologie — Dr. Fabien Décaillet, Sion
- Orthodontie — Dr. Agussol (Sierre) · Dr. Epars (Sion)
- Acuponcture — Isabelle Posse, Sion & Sierre
- Ostéopathie — Mylène Vogel-Gilloz, Grône
- Kinésiologie — Mélissa Balet, Saint-Germain
- Odontologie / Naturopathie / Physiothérapie — *à définir*

---

### Footer

Dark brown background (`#5C3A28`), white logo, quote by Olivia Benhamou, copyright, back-to-top link.

---

## Responsive Behaviour

- Mobile (`< 560px`): single column everywhere, hamburger menu, stacked cards
- Tablet (`560px–1024px`): 2-column grids
- Desktop (`> 1024px`): 3-column grids (Option A), wider hero text

---

## Content Language

All content is in **French**. Use proper French typography:
- Guillemets: `«` and `»` with non-breaking spaces (`&nbsp;`)
- Em dash: `—` (not `-`)
- Apostrophes: `'` (curly, not straight)

---

## Key Files

| Path | Description |
|------|-------------|
| `../resources/` | All brand assets (logos, images, plan) |
| `../resources/Corps site internet.pdf` | Full website copy |
| `src/index.html` | Main one-pager |
| `src/style.css` | Tailwind + custom fonts + all component styles |
| `src/main.js` | Gate logic, scroll reveal, navbar, parallax, hamburger |
| `tailwind.config.js` | Brand color/font tokens |
| `public/assets/fonts/` | Self-hosted font files |
| `public/assets/images/` | Images copied from resources |
| `.github/workflows/deploy.yml` | GitHub Pages CI/CD |
