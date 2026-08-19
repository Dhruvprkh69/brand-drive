# Brand Drive® Website — Project Overview

**Client:** Brand Drive® — Restaurant, Hospitality & Brand Consultancy  
**Founder:** Mitesh Baudhanwala  
**Contact:** +91 98244 61445 · branddrive.in@gmail.com  
**Folder:** `brand-drive/`  
**Preview:** Open `index.html` in browser (or use VS Code Live Server)

---

## 1. Tech Stack (In Detail)

### Core — 100% Static

| Layer | Technology | Why |
|-------|------------|-----|
| **Markup** | HTML5 | Multi-page site, SEO-friendly, no build step |
| **Styling** | Vanilla CSS (modular files) | Full design control, fast load, easy to host anywhere |
| **Logic** | Vanilla JavaScript (ES6+) | No React/Vue/Node — works on any static host |
| **Hosting** | GitHub Pages / Netlify / any static host | Zero server cost, fast CDN delivery |

> **No backend, no database, no npm build.** The site is plain files — upload and it works.

---

### External Libraries (CDN — no install needed)

| Library | Version | Purpose |
|---------|---------|---------|
| **GSAP** | 3.12.5 | Premium scroll animations, hero timeline, stat counters |
| **ScrollTrigger** | (GSAP plugin) | Elements animate when they enter viewport |
| **Lenis** | 1.0.42 | Smooth scroll on desktop (luxury feel) |
| **Swiper.js** | 11 | Testimonials carousel on Home & Clients pages |
| **Font Awesome** | 6.5.1 | Icons (solutions cards, nav, social, etc.) |
| **Google Fonts** | — | **Cormorant Garamond** (headings) + **Inter** (body) |

All loaded from CDN in each HTML file — no `package.json`, no bundler.

---

### JavaScript Files (Custom)

| File | Role |
|------|------|
| `assets/js/main.js` | Loader, sticky header, mobile nav, Industries dropdown, Lenis init, magnetic buttons, contact form → Google Sheets, newsletter |
| `assets/js/animation.js` | GSAP + ScrollTrigger: hero reveal, scroll fades, stagger grids, parallax, stat counters, cursor glow, page hero animations |
| `assets/js/slider.js` | Swiper config for testimonials |

---

### CSS Architecture (Design System)

| File | Contains |
|------|----------|
| `variables.css` | Brand colors, fonts, spacing, shadows, easing — single source of truth |
| `base.css` | Reset, typography, Lenis scroll base |
| `components.css` | Buttons, header, nav, dropdown, loader, logo, footer, forms, marquee, stats, cards |
| `layout.css` | Hero, sections, split layouts, grids, CTA banner, cursor glow, responsive breakpoints |
| `pages.css` | Page-specific: industries detail, solutions sections, case studies, contact layout |

---

### Brand Color Palette (from official logo)

| Token | Hex | Use |
|-------|-----|-----|
| `--color-bg` | `#F8F7F3` | Cream page background |
| `--color-green` | `#76B82D` | Wordmark green, accents |
| `--color-green-dark` | `#1E5631` | Dark green accents |
| `--color-gold` | `#F4811F` | Tagline orange, CTAs |
| `--color-blue` | `#3BB1E4` | Accent from logo arrows |
| `--color-dark` | `#151515` | Text, dark sections |

**Rule:** Logo asset is never recolored — used as uploaded.

---

### Contact Form (Only “Dynamic” Part)

- Submissions go to **Google Sheets** via **Google Apps Script** (free)
- Setup guide: `CONTACT-FORM-SETUP-GUIDE.md`
- URL goes in `assets/js/main.js` → `GOOGLE_SCRIPT_URL`
- Uses hidden iframe POST — no server required

---

## 2. Site Structure — 6 Pages

| Page | File | Sections |
|------|------|----------|
| **Home** | `index.html` | Hero, brand marquee, Who We Are, Industries grid, Solutions snapshot, Process, Why Brand Drive, Stats, Testimonials, CTA |
| **Industries** | `industries.html` | 8 industry sections with anchor links (Hotels, Restaurants, Fine Dining, Cafés, Cloud Kitchens, Food Chains, Investors, Startups) |
| **Solutions** | `solutions.html` | 12 service sections (Brand Dev, Expansion, Restaurant Setup, etc.) |
| **Clients** | `clients.html` | Associated brands, case studies, testimonials |
| **About** | `about.html` | Story, Mission/Vision/Values, founder, stats |
| **Contact** | `contact.html` | Form, contact details, map placeholder |

**Navigation:** Fixed header with Industries hover dropdown (desktop) + tap expand (mobile).

---

## 3. How It Stays Static

```
User opens index.html
       ↓
Browser loads HTML + CSS + JS from CDN + local assets
       ↓
JavaScript runs in browser only (animations, nav, form)
       ↓
Contact form → Google Apps Script → Google Sheet (external, free)
```

**What this means:**
- No Node.js, PHP, WordPress, or database on your side
- Deploy = copy `brand-drive/` folder to GitHub Pages or any web host
- Works offline for preview (except CDN fonts/libs and Unsplash placeholders)
- Fast, secure, low maintenance

---

## 4. How It Looks “Expensive” / Premium

Design and motion choices that give a high-end consultancy feel without a heavy framework:

### Typography
- **Cormorant Garamond** — elegant serif for headlines (hospitality / luxury tone)
- **Inter** — clean sans for body (readable, modern)
- Large responsive headings via `clamp()` — scales smoothly on all screens

### Layout & Spacing
- Generous whitespace with `--section-pad: clamp(48px, 5vw, 72px)`
- Max-width containers (`1280px` / `1440px`) — content never feels stretched
- Split layouts (image + text) for About-style sections
- Rounded corners (`12px`–`48px`) and soft layered shadows

### Visual Hierarchy
- Cream background + dark text + green labels + orange CTAs
- Dark hero with **left-side gradient scrim** so headline stays readable on photos
- `section--dark` blocks for stats — contrast break feels editorial

### Motion & Interaction (subtle, not flashy)
| Effect | Where | Notes |
|--------|-------|-------|
| **Logo preloader** | All pages | Brand logo + gradient progress bar on cream bg |
| **Lenis smooth scroll** | Desktop only | Disabled on mobile/touch for native feel |
| **GSAP scroll reveals** | Sections, cards | Fade-up on scroll; `once: true` — no repeat annoyance |
| **Stagger animations** | Industry/solution grids | Cards appear one after another |
| **Hero timeline** | Home | Tagline → title → text → buttons sequence |
| **Stat counters** | Home, About | Numbers count up when visible |
| **Magnetic buttons** | Primary CTAs | Slight follow on mouse hover (desktop) |
| **Cursor glow** | Desktop | Soft radial light follows cursor |
| **Marquee** | Home | Infinite scroll of brand names (will become logos) |
| **Swiper carousel** | Testimonials | Auto-play, pause on hover |

### Accessibility & Performance
- `prefers-reduced-motion` — animations disabled for users who prefer less motion
- Lenis + heavy effects off on touch devices
- `loading="lazy"` on below-fold images
- Semantic HTML, ARIA labels on nav and form

### Logo Treatment
- `logo-square.png` used site-wide (header, loader, footer, Who We Are)
- `mix-blend-mode: multiply` on cream backgrounds so white logo box blends in
- On dark hero: small white pill behind logo for readability

---

## 5. Assets — What We Need From Client

### ✅ Already Have

| Asset | Path | Status |
|-------|------|--------|
| Circular logo | `assets/images/logo.png` | ✅ Uploaded |
| Square logo | `assets/images/logo-square.png` | ✅ Uploaded (transparent PNG preferred for cleanest result) |
| PPT extract images | `assets/images/image1.png` … `image31.png` | ✅ From business profile (temporary / reference) |

---

### 🔴 Required — Replace Before Final Launch

#### A. Brand & Logo Files

| # | Asset | Path | Spec |
|---|-------|------|------|
| 1 | **Logo — transparent PNG** | `assets/images/logo-square.png` | Square format, min 800×800px, **true transparent background** (best quality) |
| 2 | **Logo — horizontal** (optional) | `assets/images/logo-horizontal.png` | For header if preferred over square |
| 3 | **Favicon** | `assets/images/favicon.png` | 32×32 or 512×512 PNG |
| 4 | **Partner / client logos** | `assets/images/brands/brand-01.png` … `brand-08.png` (+ more if needed) | PNG/SVG, ~same height (~64px), transparent bg — for homepage marquee |

**Associated brands (from PPT — confirm spelling + match logos):**
- Pan Asian Cuisine
- Specialty Coffee
- Mexican Cuisine
- Lebanese Cuisine
- Fusion Café
- Healthy Café
- (+ any others to showcase)

---

#### B. Photography — Replace Unsplash Placeholders

Currently most photos are **temporary Unsplash URLs**. Replace with client’s own high-quality shots.

| Slot | Suggested path | Min size | Content |
|------|----------------|----------|---------|
| **Home hero** | `assets/images/hero/home-hero.jpg` | 1920×1080 | Best hospitality / restaurant shot |
| **Home CTA banner** | `assets/images/sections/cta.jpg` | 1400×800 | Team / collaboration / dining |
| **About hero** | `assets/images/hero/about-hero.jpg` | 1600×900 | Office / consulting / leadership |
| **About CTA** | `assets/images/sections/about-cta.jpg` | 1400×800 | — |
| **Clients hero** | `assets/images/hero/clients-hero.jpg` | 1600×900 | Client restaurant / brand |
| **Solutions hero** | `assets/images/hero/solutions-hero.jpg` | 1600×900 | Operations / kitchen / brand |
| **Contact hero** | `assets/images/hero/contact-hero.jpg` | 1600×900 | Professional / meeting |
| **Industries hero** | `assets/images/hero/industries-hero.jpg` | 1600×900 | Multi-segment hospitality |

**Home — Industries grid (6 cards):**

| File | Industry |
|------|----------|
| `assets/images/industries/hotels.jpg` | Hotels |
| `assets/images/industries/restaurants.jpg` | Restaurants |
| `assets/images/industries/fine-dining.jpg` | Fine Dining |
| `assets/images/industries/cloud-kitchens.jpg` | Cloud Kitchens |
| `assets/images/industries/cafes.jpg` | Cafés |
| `assets/images/industries/startups.jpg` | Hospitality Startups |

**Industries page — 8 detail sections:**  
One image per section → `assets/images/industries/detail-hotels.jpg`, `detail-restaurants.jpg`, etc.

**Solutions page — 12 service sections:**  
One image per service → `assets/images/solutions/brand-development.jpg`, `brand-expansion.jpg`, etc.

**Clients page — case studies (2+):**  
`assets/images/case-studies/case-01.jpg`, `case-02.jpg`, …

**About page — founder:**  
| File | Notes |
|------|-------|
| `assets/images/team/founder.jpg` | Mitesh Baudhanwala — professional portrait, min 800×1000 |

**Photo guidelines:**
- JPG or WebP, high quality, well-lit
- Prefer real client projects (with permission)
- Consistent warm / premium tone matches brand cream + green palette

---

#### C. Text & Content (Confirm / Update)

From **Brand Drive Business Profile.pptx** — please verify or send final copy:

- [ ] Company intro (2 paragraphs — Who We Are)
- [ ] Mission statement (exact wording)
- [ ] Vision statement (exact wording)
- [ ] Core values (4 items)
- [ ] All **14 services** — titles + 2–3 line descriptions each
- [ ] **Stats** (currently placeholders): Projects, Brands, Years, Cities, Clients — **real numbers**
- [ ] **Testimonials** (3+) — name, role, company, quote — **only with written permission**
- [ ] Case study names + short results (if public)
- [ ] Office **address** for Google Maps embed
- [ ] Business hours
- [ ] Social media URLs (LinkedIn, Instagram, Facebook, etc.)
- [ ] Domain name for go-live (e.g. `branddrive.in`)

---

#### D. Optional But Recommended

| Asset | Path | Use |
|-------|------|-----|
| Company profile PDF | `assets/docs/brand-drive-profile.pdf` | Download link on About |
| Brand guidelines PDF | — | Logo clear space, color rules |
| WhatsApp pre-filled message | — | For “Chat on WhatsApp” button |
| Open Graph image | `assets/images/og-image.jpg` | 1200×630 — social share preview |
| Google Maps embed code | — | Contact page (replace Ahmedabad placeholder) |

---

## 6. Current Placeholders (To Fix)

| Item | Current state | Action |
|------|---------------|--------|
| Hero & section photos | Unsplash CDN links | Replace with client photos (paths above) |
| Marquee | Text brand names | Replace with client logo PNGs |
| Stats | 150 projects, 80 brands, etc. | Confirm real numbers |
| Testimonials | Placeholder names/quotes | Replace with approved client quotes |
| Contact form | `PASTE_YOUR_WEB_APP_URL_HERE` | Follow `CONTACT-FORM-SETUP-GUIDE.md` |
| Solutions page | All 12 sections present | Review copy against PPT for accuracy |
| Map on Contact | Generic placeholder | Add real office location |

---

## 7. Deployment (Static)

### Option A — GitHub Pages (Free)
1. Push `brand-drive/` to GitHub repo
2. Settings → Pages → Source: main branch, folder `/` or `/brand-drive`
3. Site live at `https://username.github.io/repo-name/`

### Option B — Custom Domain
1. Point domain DNS to GitHub Pages / Netlify
2. Add `CNAME` file with domain name
3. Enable HTTPS (automatic on GitHub/Netlify)

### Option C — Netlify / Vercel
- Drag & drop `brand-drive` folder — instant deploy

**No server config needed.**

---

## 8. File Tree (Quick Reference)

```
brand-drive/
├── index.html              ← Home
├── industries.html
├── solutions.html
├── clients.html
├── about.html
├── contact.html
├── PROJECT-OVERVIEW.md     ← This file
├── CONTACT-FORM-SETUP-GUIDE.md
├── assets/
│   ├── css/
│   │   ├── variables.css   ← Colors, fonts, spacing
│   │   ├── base.css
│   │   ├── components.css  ← UI components
│   │   ├── layout.css      ← Sections, hero, grids
│   │   └── pages.css       ← Page-specific styles
│   ├── js/
│   │   ├── main.js         ← Nav, loader, form, Lenis
│   │   ├── animation.js    ← GSAP animations
│   │   └── slider.js       ← Swiper testimonials
│   └── images/
│       ├── logo.png
│       ├── logo-square.png
│       └── image1–31.*     ← From PPT (reference)
```

---

## 9. Also Available — `brand-drive-v2/`

A cleaner **client-first rebuild** with named image slots and lighter animations.  
See `brand-drive-v2/ASSETS-NEEDED.md` for v2-specific asset paths.

**Primary deliverable for client:** `brand-drive/` (this folder).

---

## 10. Summary

| Question | Answer |
|----------|--------|
| **Tech stack?** | HTML + CSS + Vanilla JS + GSAP + Lenis + Swiper + Font Awesome + Google Fonts |
| **Static?** | Yes — no backend; only Google Sheets for contact form |
| **Premium look?** | Serif/sans pairing, cream palette, smooth scroll, scroll animations, magnetic CTAs, editorial layout |
| **What's needed?** | Transparent logo, client photos, brand logos, real stats, testimonials, form URL, domain |
| **How to preview?** | Open `index.html` in browser |

---

*Last updated: July 2026 · Built for Brand Drive® by Dhruv*
