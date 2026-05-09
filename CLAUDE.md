# Cabinet Parenthèse Hygiéniste — Working Notes

## Stack & Commands

- Vite + Tailwind CSS v3 + vanilla JS. Root: `src/`, public: `public/`, build: `dist/`.
- `npm run dev` — local dev server
- `npm run build` — production build (sets `base: '/parenthese-hygieniste/'` for GitHub Pages)
- Deployed via `.github/workflows/deploy.yml` → GitHub Pages

---

## Non-obvious Design Constraints

**Border radius:** all buttons use `0.875rem` — matches the rounded rectangle of the logo shape. Never use pill (`100px`).

**Colours:** brown is dominant. Purple (`#8B7EC8`, `--brand-purple`) is a discrete accent only — applied to: ornamental `( )` parenthèses, nav active underline, scroll indicator, timeline years, list bullet dots, protocol card icons, gate label. No pink/magenta anywhere.

**Navbar has two states:**
- Transparent (over hero): white links, white hamburger, "Rendez-vous" = white bg + purple text.
- Scrolled (`.scrolled` class, JS-triggered at 60px): white bg + blur, brown links, brown "Rendez-vous".

**Hero overlay** is intentionally light (`0.72 / 0.62 / 0.55` opacity) so the toothbrush photo shows through. Don't darken it.

**Hero parallax:** driven frame-by-frame by scroll JS — no CSS `transition` on `.hero-bg`, or returning to top takes 12s.

---

## Access Gate

- Code: `3979` (Grône postal code). Stored in `sessionStorage`.
- Input must be `type="text"` with `inputmode="numeric"` — **never `type="password"`**: browser password managers on HTTPS intercept the value and the code never matches.
- JS strips non-digits before comparing: `value.replace(/\D/g, '').slice(0, 4)`.

---

## Mobile Gotchas

- `overflow-x: hidden` on both `html` and `body` — required to prevent horizontal scroll.
- Mobile menu uses a plain `.is-open` CSS class, **not** Tailwind's `hidden`. Tailwind purges dynamically-toggled class names in production builds.

---

## Fonts

Tan Mon Cheri is self-hosted as `public/assets/fonts/TanMonCheri.otf` (commercial, OTF format). The Seasons and TT Chocolates are declared in `@font-face` but files not yet provided — Google Fonts (Playfair Display, DM Sans) serve as fallbacks.

---

## Protocol Cards — Layout Options

Three variants live in the page simultaneously for client review (Option A/B/C badges). Once the client chooses one, remove the other two sections and their CSS classes.

- **A** — 3-col grid, large padding, cream bg
- **B** — 2-col grid, horizontal card (icon left via CSS grid row-span), white bg
- **C** — 1 per row, horizontal on 560px+, button pinned bottom-right via grid col 3, beige bg
