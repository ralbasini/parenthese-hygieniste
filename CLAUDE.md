# Cabinet Parenthèse Hygiéniste — Website

## Project Overview

One-page website for **Cabinet Parenthèse Hygiéniste**, a dental hygiene practice in Grône (Valais, Switzerland) run by **Marine Ravaz-Largey**, dental hygienist. The site conveys a warm, holistic, and professional image combining clinical expertise with alternative medicine approaches.

Opening date: **1st October 2026**

---

## Technical Stack

- **Runtime**: Node.js
- **CSS**: Tailwind CSS v3 (JIT)
- **Bundler**: Vite
- **Templating**: plain HTML or a lightweight template engine (e.g. Nunjucks/EJS via Vite plugin)
- **No framework**: vanilla JS only — no React, Vue, etc.
- **Package manager**: npm

### Project Structure

```
parenthese-hygieniste/
├── public/
│   ├── assets/
│   │   ├── fonts/          # Tan Mon Cheri, TT Chocolates, The Seasons
│   │   ├── images/         # Copied/optimised from ../resources/
│   │   └── icons/
├── src/
│   ├── index.html          # Main one-pager
│   ├── main.js             # Entry point (scroll behaviour, nav highlight)
│   └── style.css           # Tailwind directives + custom @font-face + utilities
├── tailwind.config.js
├── vite.config.js
├── package.json
└── CLAUDE.md
```

---

## Brand Identity

### Color Palette

Extracted from the official brand assets in `../resources/`:

| Token              | Hex       | Usage                                      |
|--------------------|-----------|--------------------------------------------|
| `brand-brown`      | `#A05C3B` | Primary — logo, headings, accents, borders |
| `brand-brown-dark` | `#5C3A28` | Body text, nav links                       |
| `brand-cream`      | `#F8F3EE` | Page background, section backgrounds       |
| `brand-beige`      | `#EDE4D8` | Alternate section tint, card backgrounds   |
| `white`            | `#FFFFFF` | Navbar on scroll, cards                    |

> No other accent colors. The PDF used pink/magenta for section labels — **do not use this on the website**. Stick strictly to the brown/cream palette.

Add to `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      'brand-brown':      '#A05C3B',
      'brand-brown-dark': '#5C3A28',
      'brand-cream':      '#F8F3EE',
      'brand-beige':      '#EDE4D8',
    }
  }
}
```

### Typography

Three custom fonts must be self-hosted in `public/assets/fonts/`:

| Font            | Role                                       | Weight/Style        |
|-----------------|--------------------------------------------|---------------------|
| **Tan Mon Cheri** | Hero display, section titles             | Regular             |
| **The Seasons**   | Subheadings, name, elegant labels        | Regular, Italic     |
| **TT Chocolates** | Body copy, nav, buttons, captions        | Light, Regular, Bold|

Font loading via `@font-face` in `src/style.css`. Apply with custom Tailwind `fontFamily` tokens:
```js
fontFamily: {
  display: ['"Tan Mon Cheri"', 'serif'],
  seasons: ['"The Seasons"', 'serif'],
  body:    ['"TT Chocolates"', 'sans-serif'],
}
```

### Logos & Assets

All source files are in `../resources/` (one level up from the project root):

| File                                              | Usage                          |
|---------------------------------------------------|--------------------------------|
| `Cabinet Parenthèse Hygiéniste brun - PNG.png`   | Navbar logo (brown on light)   |
| `Cabinet Parenthèse Hygiéniste blanc - PNG.png`  | Hero / dark-background logo    |
| `Logo Dent brun fond blanc - PNG.png`            | Section icon / favicon base    |
| `Logo Dent blanche fond brun - PNG.png`          | Reversed tooth icon            |
| `Signature Marine brun - PNG.png`                | À propos section signature     |
| `Plan JPEG.jpg`                                  | Access/map section             |
| `Photo brosse à dent.jpg`                        | Hero or decorative image       |

Copy and optimise images into `public/assets/images/` during build setup.

---

## Design Principles

Inspired by [becker-guillaume.fr](http://becker-guillaume.fr/):

- **Clean, airy layouts** — generous white space, never cluttered
- **Centered content blocks** with max-width constraints (`max-w-3xl` or `max-w-4xl`)
- **Elegant typography hierarchy**: display font for big titles, The Seasons for names and subheadings, TT Chocolates for body
- **Subtle separators**: thin `1px` lines in `brand-beige` or small ornamental dividers
- **Smooth scroll** between sections; active nav link highlighted in `brand-brown`
- **Sticky transparent navbar** that gains a white background + shadow on scroll
- **Rounded cards** (`rounded-2xl`) with soft shadows for protocol/service blocks
- **No harsh shadows** — use `shadow-sm` or `shadow-md` at most
- **Responsive**: mobile-first, single column on `sm`, two columns on `md+` where relevant
- **Cursor and hover states**: underline or opacity fade, never colour inversions that feel aggressive

---

## Page Layout — One Pager

### Navigation (sticky top)

Links: Philosophie · À Propos · Cabinet · Protocoles · Contact  
Logo centered or left. CTA "Rendez-vous" button (brown outline → brown fill on hover) right-aligned.

---

### 1. Hero

- Full-viewport-height section
- Background: `brand-cream` or a soft image overlay (toothbrush photo, very low opacity)
- White logo centered
- Tagline: *"Votre santé orale, une parenthèse de bienveillance."* (proposed)
- CTA button: **Prendre rendez-vous**
- Scroll indicator arrow at bottom

---

### 2. Philosophie

**Content (from `Corps site internet.pdf`):**

> Nos environnements exercent une influence sur nos organismes dans leurs globalités et donc également sur la cavité buccale.
> Nous ne sommes pas tous égaux, chacun a un panel biologique propre à soi.
> Ce terrain est influencé par nos modes de vies, privés et professionnels.
>
> Ce phénomène d'influence agit aussi inversement :
> **« Notre santé orale a un impact sur notre état de santé générale »**
>
> Mon rôle est de vous proposer un soin adapté à vos besoins, dans une approche bienveillante et axée sur la prévention grâce à la prophylaxie en hygiène bucco-dentaire.
> Votre santé globale est un équilibre à préserver, mon souhait est d'y contribuer.

Layout: centered, large serif quote in `brand-brown`, body in TT Chocolates.

---

### 3. À Propos

**Content:**

> D'aussi loin que je me souvienne, j'ai toujours été habile de mes mains. Puis avec les années, je me suis orientée vers l'humain.
>
> Le métier d'hygiéniste dentaire fut pour moi une belle découverte, alliant la finesse de la pratique clinique et le côté relationnel par l'accompagnement de chaque patient.
>
> Lors de mon parcours, j'ai approfondi certains aspects de la médecine alternative dans la sphère de l'hygiène bucco-dentaire, m'étant formée dans divers domaines tels que l'aromathérapie, la thérapie en médecine alternative, le diagnostic de la langue en médecine chinoise et l'acupressure.
>
> Il me tenait à cœur de pouvoir offrir à mes patients une approche globale, adaptée à chaque vécu, sentiment ou émotion. Mêlant ainsi un climat de confiance et des soins de qualité.
>
> La flore orale est une zone délicate, à appréhender de façon individuelle, c'est avec plaisir que je vous accompagnerai.

Closing: *Avec bienveillance.* + Marine's signature image (`Signature Marine brun - PNG.png`)

**Credentials block** (below bio, subtle list or timeline style):

- Membre Swiss Dental Hygienists depuis 2019
- Affiliée à la SDJ (Association Valaisanne pour la prophylaxie et les soins dentaires à la jeunesse)
- 2019 — Diplôme ES d'hygiéniste dentaire de Genève
- 2021 — Autorisation de pratique en tant qu'hygiéniste dentaire sous sa propre responsabilité professionnelle
- 2022 — Certificat de formation continue de thérapeute, 360H
- 2022 — Certificat de formation continue en aromathérapie, 150H
- 2024 — Attestation de formation continue en acupressure
- 2024 — Attestation de formation continue de diagnostic MTC par l'examen de la langue
- 2025 — Attestation de bonne conduite du service de Santé publique du canton du Valais

---

### 4. Cabinet

Placeholder for cabinet photos (image gallery or grid, `../resources/` photos to be provided later). Show placeholder cards with `brand-beige` background and a note "Photos à venir".

---

### 5. Protocoles sur Mesure

Six service cards in a responsive grid (2 cols on md, 3 cols on lg), each with a small icon, title, and description:

| Title                              | Summary |
|------------------------------------|---------|
| **Hygiène & Prévention**           | Plan d'hygiène personnalisé, élimination des dépôts, intervalle de séance adapté. |
| **Diagnocam KaVo**                 | Détection de carie sans rayons X par transillumination infrarouge et fluorescence. |
| **Pédodontie**                     | Prise en charge des enfants dans une atmosphère rassurante, à leur rythme. |
| **Aromathérapie**                  | Huiles essentielles pour soutenir le système immunitaire et apaiser le stress. |
| **Thérapeute en Médecine Alternative** | Approche holistique corps/âme/esprit, plan d'hygiène conscient. |
| **Acupressure**                    | Stimulation de points énergétiques pour accompagner l'autorégulation, utile contre l'anxiété ou les réflexes nauséeux. |
| **Diagnostic de la Langue en MTC** | Lecture de la langue comme indicateur de l'état général en lien avec la sphère bucco-dentaire. |

Full descriptions available in `Corps site internet.pdf`.

---

### 6. Contact & Accès

**Contact details** (to be completed by client — placeholders in code):
- Téléphone: `078/...` (WhatsApp mentionné)
- Email: `parenthese-hd@...`

**Horaires de consultation:**
| Jour      | Horaires      |
|-----------|---------------|
| Lundi     | 12h00 – 20h00 |
| Mardi     | 9h00 – 18h00  |
| Mercredi  | 13h00 – 18h00 |
| Jeudi     | 7h00 – 17h00  |
| Vendredi  | 7h00 – 16h00  |

**Adresse:** Rue de Pramagnon 54 — 3979 Grône

**Accès transports:** Arrêt de bus Grône, Pramagnon (direction Sierre et Sion) — 2 places de parc patients — Accès pour personnes handicapées

**Map:** embed the plan image (`Plan JPEG.jpg`) or a static iframe map.

**CTA:** "Rendez-vous en ligne" button (links to online booking platform — URL TBD).

**Politique d'annulation:** *Les rendez-vous non annulés 24H à l'avance pourront être facturés.*

---

### 7. Collaborations

Simple list or card grid of professional partners:

- **Parodontologie** — Dr. Fabien Décaillet, Sion
- **Orthodontie** — Dr. Agussol, Sierre · Dr. Epars, Sion
- **Acuponcture** — Isabelle Posse, Sion & Sierre
- **Ostéopathie** — Mylène Vogel-Gilloz, Grône
- **Kinésiologie** — Mélissa Balet, Saint-Germain
- **Odontologie** — *à définir*
- **Naturopathie** — *à définir*
- **Physiothérapie** — *à définir*

---

### Footer

- Logo (small, brown)
- Quote: *"Être en bonne santé, c'est la condition élémentaire de la tranquillité"* — Olivia Benhamou
- Copyright line
- Back-to-top link

---

## Responsive Behaviour

- Mobile (`< 768px`): single column, hamburger menu, stacked cards
- Tablet (`768px–1024px`): 2-column grids
- Desktop (`> 1024px`): 3-column grids, wider hero text

---

## Content Language

All content is in **French**. Keep all user-facing strings in French. Use proper French typography:
- Guillemets: `«` and `»` with non-breaking spaces
- Em dash: `—` (not `-`)
- Apostrophes: `'` (curly, not straight)

---

## Key Files

| Path | Description |
|------|-------------|
| `../resources/` | All brand assets (logos, images, plan) |
| `../resources/Corps site internet.pdf` | Full website copy |
| `src/index.html` | Main one-pager |
| `src/style.css` | Tailwind + custom fonts |
| `tailwind.config.js` | Brand color/font tokens |
| `public/assets/fonts/` | Self-hosted font files |
| `public/assets/images/` | Optimised images copied from resources |
