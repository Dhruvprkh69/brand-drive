# Brand Drive® — Website Documentation

> **Project:** Brand Drive — Restaurant, Hospitality & Brand Consultancy  
> **Tagline:** Solutions That Drive Results  
> **Location:** SNS Atria, Surat, Gujarat, India  
> **Last updated:** July 2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Project File Structure](#4-project-file-structure)
5. [Design System & Brand Palette](#5-design-system--brand-palette)
6. [Global Components](#6-global-components)
7. [Page-by-Page Content & Sections](#7-page-by-page-content--sections)
8. [JavaScript Modules](#8-javascript-modules)
9. [CSS Architecture](#9-css-architecture)
10. [Assets Inventory](#10-assets-inventory)
11. [Forms & Integrations](#11-forms--integrations)
12. [Mobile Behaviour](#12-mobile-behaviour)
13. [Deployment & Local Setup](#13-deployment--local-setup)
14. [Section Count Summary](#14-section-count-summary)

---

## 1. Overview

Brand Drive® is a **static multi-page website** for a hospitality and F&B consultancy firm. It presents services across **brand development**, **operations**, **franchise consulting**, and **industry-specific expertise** for clients across India.

| Attribute | Detail |
|-----------|--------|
| **Type** | Static HTML/CSS/JS (no backend framework) |
| **Pages** | 6 HTML pages |
| **Primary audience** | Restaurant owners, hotel F&B teams, franchise startups, hospitality investors |
| **Founder** | Mitesh Baudhanwala |
| **Contact** | +91 98244 61445 · branddrive.in@gmail.com |

---

## 2. Tech Stack

### Core (no build step)

| Layer | Technology |
|-------|------------|
| **Markup** | HTML5 (semantic sections, ARIA labels) |
| **Styling** | Vanilla CSS (modular files, CSS custom properties) |
| **Scripting** | Vanilla JavaScript (IIFE modules, no bundler) |
| **Fonts** | [Google Fonts](https://fonts.google.com/) — Cormorant Garamond (headings), Inter (body) |
| **Icons** | [Font Awesome 6.5.1](https://fontawesome.com/) (CDN) |

### External Libraries (CDN)

| Library | Version | Purpose |
|---------|---------|---------|
| **GSAP** | 3.12.5 | Scroll animations, hero timeline, stat counters |
| **ScrollTrigger** | 3.12.5 (GSAP plugin) | Scroll-linked reveal animations |
| **Lenis** | 1.0.42 (@studio-freight) | Smooth scroll (desktop only, non-touch) |
| **Swiper** | 11 | Testimonials carousel (home + clients) |

### Third-Party Services

| Service | Usage |
|---------|--------|
| **Unsplash** | Placeholder hero/section photography (URLs in HTML) |
| **Google Maps Embed** | Contact page — SNS Atria, Surat |
| **Google Apps Script** | Contact form submission (optional — see [Forms](#11-forms--integrations)) |
| **WhatsApp API link** | `https://wa.me/919824461445` |

### What is NOT used

- No React, Vue, or Angular  
- No Node/npm build pipeline  
- No CMS (content is hard-coded in HTML)  
- No database  

---

## 3. Architecture

### High-Level Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
├─────────────────────────────────────────────────────────────┤
│  HTML Pages (6)                                              │
│    index · about · solutions · industries · clients · contact│
├─────────────────────────────────────────────────────────────┤
│  CSS Layer (cascade order)                                   │
│    variables → base → components → layout → pages →         │
│    mobile → brand-theme                                      │
├─────────────────────────────────────────────────────────────┤
│  JavaScript Layer                                            │
│    brands.js · main.js · animation.js · slider.js · mobile.js│
├─────────────────────────────────────────────────────────────┤
│  CDN: GSAP · Lenis · Swiper · Font Awesome · Google Fonts    │
└─────────────────────────────────────────────────────────────┘
```

### Page Load Flow

```
1. HTML parsed
2. CSS applied (design tokens → layout → responsive overrides)
3. Loader visible (body.is-loading)
4. DOMContentLoaded → brands.js, mobile.js, slider.js init
5. window.load → loader hides after ~1.9s
6. animation.js → GSAP ScrollTrigger + hero timeline + stat counters
7. main.js → Lenis smooth scroll (desktop only)
8. User interaction → nav, dropdowns, footer accordion, forms
```

### Navigation Architecture

```
Header (fixed)
├── Logo → index.html
├── Nav
│   ├── Home
│   ├── Industries ▼ (8 anchor links → industries.html#...)
│   ├── Solutions ▼ (12 anchor links → solutions.html#...)
│   ├── Why Brand Drive → about.html#why
│   ├── Clients → clients.html
│   └── About → about.html
└── CTA: "Let's Talk" → contact.html
```

---

## 4. Project File Structure

```
brand-drive/
├── index.html              # Homepage (10 content sections)
├── about.html              # About, founder, mission, values (7 sections)
├── solutions.html          # 12 solution detail sections
├── industries.html         # 8 industry detail sections
├── clients.html            # Portfolio, case studies, gallery (6 sections)
├── contact.html            # Contact form + map (1 main section)
│
├── assets/
│   ├── css/
│   │   ├── variables.css   # Design tokens, brand colors
│   │   ├── base.css        # Reset, typography, section utilities
│   │   ├── components.css  # Header, nav, footer, buttons, loader, marquee
│   │   ├── layout.css      # Hero, cards, process, CTA, grids
│   │   ├── pages.css       # Page-specific (contact, industries, solutions)
│   │   ├── mobile.css      # Mobile-only overrides (≤768px)
│   │   └── brand-theme.css # Brand palette application site-wide
│   │
│   ├── js/
│   │   ├── brands.js       # Marquee + clients logo grid
│   │   ├── main.js         # Nav, loader, Lenis, forms, header
│   │   ├── animation.js    # GSAP animations + stat counters
│   │   ├── slider.js       # Swiper testimonials
│   │   └── mobile.js       # Footer accordion (mobile)
│   │
│   └── images/
│       ├── brand/            # logo.png, logo-header.png
│       ├── brands/           # Brand-1.png … Brand-12.png (marquee)
│       ├── team/             # Founder.png
│       └── (project photos)  # image1.png, image2.png, etc.
│
├── DOCUMENTATION.md        # This file
├── PROJECT-OVERVIEW.md     # Earlier project notes
├── ASSETS-FOLDER-STRUCTURE.md
└── CONTACT-FORM-SETUP-GUIDE.md
```

---

## 5. Design System & Brand Palette

### Official Logo Colors (from brand assets)

| Token | Hex | Usage |
|-------|-----|--------|
| `--color-green` | `#76B82D` | Primary brand, buttons, labels |
| `--color-green-dark` | `#1E5631` | Dark accents, footer gradient |
| `--color-gold` | `#F4811F` | Orange/tagline, CTA buttons, highlights |
| `--color-blue` | `#3BB1E4` | Light accent (icons, tints, gradients) |

### Supporting Colors

| Token | Value | Usage |
|-------|-------|--------|
| `--color-bg` | `#F8F7F3` | Page background (cream) |
| `--color-dark` | `#151515` | Text, dark sections |
| `--color-white` | `#FFFFFF` | Cards, contrast |
| `--color-gray` | `#8A8A8A` | Body secondary text |

### Soft Tints (section backgrounds)

- `--color-green-soft` — `#EEF6E4`
- `--color-orange-soft` — `#FEF0E4`
- `--color-blue-soft` — `#E8F6FC`

### Typography

| Role | Font | Weight |
|------|------|--------|
| Headings | Cormorant Garamond | 400–600 |
| Body / UI | Inter | 400–700 |

### Breakpoints

| Breakpoint | File | Behaviour |
|------------|------|-----------|
| ≤768px | `mobile.css` | Single-column, swipe cards, compact header |
| ≤480px | `mobile.css` | Further size reductions |
| ≤1024px | `components.css` | Nav becomes hamburger menu |

---

## 6. Global Components

Present on **most or all pages**:

| Component | Description |
|-----------|-------------|
| **Loader** | Full-screen logo + gradient progress bar (~1.9s on load) |
| **Header** | Fixed cream bar, logo, centred nav, gold CTA, brand gradient bottom line |
| **Nav dropdowns** | Industries (8 items), Solutions (12 items) — hover desktop, tap mobile |
| **Footer** | Brand blurb, Quick Links, Solutions links, Contact; social icons (home only) |
| **Mobile footer accordion** | Quick Links / Solutions / Contact collapse on tap (≤768px) |
| **Cursor glow** | Desktop-only mouse-follow effect (hidden on mobile) |
| **Reveal animations** | GSAP scroll fade-in on `.reveal` elements |
| **CTA Banner** | Image + dark overlay + headline + gold button (most pages) |

### Button Variants

| Class | Style |
|-------|--------|
| `btn--primary` | Green fill |
| `btn--gold` | Orange fill (main CTA) |
| `btn--outline` | Transparent border |
| `btn--whatsapp` | WhatsApp green |
| `btn--magnetic` | Subtle mouse-follow transform (desktop) |

---

## 7. Page-by-Page Content & Sections

---

### 7.1 Homepage — `index.html`  
**Title:** Building Hospitality Brands That People Remember  
**Sections: 10**

| # | Section ID | Label | Content Summary |
|---|------------|-------|-----------------|
| 1 | `#hero` | Solutions That Drive Results | Full-screen hero, headline, 2 CTAs (Contact + Solutions) |
| 2 | `#trusted` | Trusted By | Dual-row infinite marquee — 12 partner brand logos |
| 3 | `#about-preview` | Who We Are | Split layout: logo showcase + company intro + "Our Story" link |
| 4 | `#industries` | Industries | **6 industry cards:** Hotels, Restaurants, Fine Dining, Cloud Kitchens, Cafés, Hospitality Startups |
| 5 | `#solutions` | Solutions | **6 solution cards:** Brand Development, Operations, Franchise, Training, Expansion, Consulting |
| 6 | `#process` | Our Process | **5 steps:** Discover → Strategy → Development → Execution → Growth |
| 7 | `#why` | Why Brand Drive | **4 differentiators:** Integrated Solutions, Proven Expertise, Honesty & Integrity, Results That Scale |
| 8 | `#metrics` | Success Metrics | **5 animated stats:** 150 Projects, 80 Brands, 12 Years, 25 Cities, 200 Clients |
| 9 | `#testimonials` | Testimonials | Swiper carousel — **3 client quotes** |
| 10 | *(CTA)* | — | "Ready to Build Something Remarkable?" → Book a Consultation |

**Footer (full):** Newsletter signup, Quick Links (5), Solutions links (5), Contact, social (LinkedIn, Instagram, WhatsApp)

---

### 7.2 About — `about.html`  
**Title:** Leaders in Hospitality & Brand Consulting  
**Sections: 7**

| # | Section | Content |
|---|---------|---------|
| 1 | Page Hero | "About Us" label + headline |
| 2 | Founder | **Mitesh Baudhanwala** portrait, bio, timeline (Foundation → Growth → Today) |
| 3 | `#mission` | Mission: Elevating F&B Across India |
| 4 | `#mission` (col 2) | Vision: Excellence Through Integrity |
| 5 | `#values` | **4 value cards:** Integrity, Work Ethic, Social Responsibility, Respect |
| 6 | `#why` | **4 competitive advantages:** Integrated Approach, Concept Specialists, Franchise Track Record, Every Budget Every Scale |
| 7 | Stats + CTA | Same 5 metrics + "Let's Build Together" banner |

**Footer:** Minimal (copyright only)

---

### 7.3 Solutions — `solutions.html`  
**Title:** Integrated Consulting for Every Need  
**Sections: 13** (1 hero + **12 solution blocks**)

| # | Anchor ID | Solution | Benefit Tags |
|---|-----------|----------|--------------|
| 1 | — | Page Hero | — |
| 2 | `#brand-development` | Brand Development | Brand Identity, Interior Concepts, Menu Design |
| 3 | `#brand-expansion` | Brand Expansion | Multi-Location, Market Entry, Growth Strategy |
| 4 | `#restaurant-setup` | Restaurant Setup | Concept to Launch, Full Setup, Operations Ready |
| 5 | `#cafe-setup` | Café Setup | Specialty Coffee, Concept Cafés, Theme-Based |
| 6 | `#operations` | Operations Management | Day-to-Day Ops, Staff Support, Process Optimization |
| 7 | `#franchise` | Franchise Development | Franchise Model, Brand Facilitation, Scalable Growth |
| 8 | `#sop` | SOP Development | Documentation, Consistency, Quality Control |
| 9 | `#training` | Staff Training | Service Excellence, Kitchen Training, Team Building |
| 10 | `#menu-engineering` | Menu Engineering | Menu Design, Food Costing, Culinary Strategy |
| 11 | `#raw-material` | Raw Material Development | Product Dev, Sourcing, FMCG |
| 12 | `#supply-chain` | Supply Chain Setup | Logistics, Vendor Network, Cost Control |
| 13 | `#growth-strategy` | Business Growth Strategy | Scaling, Strategy, Profitability |

Each block: image + description + benefit tags + CTA → Contact

**Footer:** Minimal

---

### 7.4 Industries — `industries.html`  
**Title:** Expertise Across Every Segment  
**Sections: 10** (1 hero + **8 industries** + CTA)

| # | Anchor ID | Industry | Structure per block |
|---|-----------|----------|---------------------|
| 1 | — | Page Hero | — |
| 2 | `#hotels` | Hotels | Challenges · Our Solutions · Benefits |
| 3 | `#restaurants` | Restaurants | Same 3-list format |
| 4 | `#fine-dining` | Fine Dining | Same |
| 5 | `#cafes` | Cafés | Same |
| 6 | `#cloud-kitchens` | Cloud Kitchens | Same |
| 7 | `#food-chains` | Food Chains | Same |
| 8 | `#investors` | Hospitality Investors | Same |
| 9 | `#startups` | Franchise Businesses | Same |
| 10 | CTA | "Your Industry, Our Expertise" | Contact CTA |

**Footer (full):** Quick Links, Industries anchors, Contact

---

### 7.5 Clients — `clients.html`  
**Title:** Brands We've Helped Build  
**Sections: 6**

| # | Section | Content |
|---|---------|---------|
| 1 | Page Hero | Clients headline |
| 2 | Associated Brands | **12-logo grid** (Brand-1 … Brand-12) + franchise note |
| 3 | Case Studies | **3 featured projects** with metrics |
| 4 | Brand Gallery | **6 project images** (image6, 7, 8, 27, 28, 30) |
| 5 | `#testimonials` | Swiper — **2 client quotes** |
| 6 | CTA | Contact banner |

#### Case Studies Detail

| Project | Tag | Key Metrics |
|---------|-----|-------------|
| Specialty Coffee | From Single Café to Franchise Network | 5+ locations, 3 cities, 40% cost reduction |
| Pan Asian | Concept to Multi-Location Rollout | 8+ outlets, 12 franchise partners, 2× revenue |
| Cloud Kitchen | Multi-Brand Delivery Operation | 4 virtual brands, 35% margin, 6 months to profit |

**Footer:** Minimal

---

### 7.6 Contact — `contact.html`  
**Sections: 1** (multi-column layout)

| Block | Content |
|-------|---------|
| **Left column** | Headline, founder name, phone, email, WhatsApp, location (SNS Atria, Surat), business hours |
| **Right column** | Contact form: Name, Email, Phone, Subject (dropdown), Message |
| **Map** | Embedded Google Map — SNS Atria coordinates |

**Form subjects:** Brand Development, Restaurant Setup, Franchise Consulting, Operations Management, Other Inquiry

**Footer:** Contact info + Follow (social links)

---

## 8. JavaScript Modules

### `brands.js`
- Builds **dual-row homepage marquee** (brands 1–6 top, 7–12 bottom)
- Duplicates tracks for seamless infinite CSS animation
- Populates **clients page logo grid** (`[data-brands]`)

### `main.js`
- **Loader** hide on window load
- **Header** scroll state (`is-scrolled`)
- **Mobile nav** toggle + body scroll lock
- **Dropdown menus** — click/tap toggle, wheel scroll fix inside dropdown (Lenis)
- **Lenis** smooth scroll — desktop only, disabled on touch/reduced-motion
- **Magnetic buttons** — desktop hover effect
- **Newsletter form** — client-side alert (no backend)
- **Contact form** — Google Sheets via hidden iframe POST (URL in `GOOGLE_SCRIPT_URL`)
- **Footer year** auto-update

### `animation.js`
- **Hero timeline** — staggered fade-in (tag, title, text, buttons)
- **Scroll reveals** — `.reveal` elements via ScrollTrigger
- **Grid stagger** — industry/solution/why/value/process cards
- **Stat counters** — animate `data-count` numbers in `#metrics`
- **Cursor glow** — follows mouse (desktop)

### `slider.js`
- Initializes **Swiper** on `.testimonials-swiper`
- Loop, autoplay 6s, pagination, responsive slides

### `mobile.js`
- **Footer accordion** — tap headings to expand/collapse link groups (≤768px)
- Sets `data-lenis-prevent` on footer for touch reliability

---

## 9. CSS Architecture

### Load Order (every page)

```html
variables.css    → Design tokens
base.css         → Reset, sections, typography
components.css   → UI components (header, footer, buttons)
layout.css       → Page layouts (hero, cards, grids)
pages.css        → Subpage-specific styles
mobile.css       → Mobile overrides (last before theme)
brand-theme.css  → Brand color application (loads last)
```

### Key CSS Patterns

| Pattern | Classes |
|---------|---------|
| Section wrapper | `.section`, `.section--white`, `.section--dark`, `.section--compact` |
| Section header | `.section__label`, `.section__title`, `.section__subtitle` |
| Grids | `.grid-2`, `.grid-3`, `.why-grid`, `.values-grid`, `.stats-row` |
| Animation hook | `.reveal` (+ `.is-visible` after animate) |
| Mobile swipe rows | `#industries .grid-3`, `#solutions .grid-3`, `#process .process-track`, `#why .why-grid` |

---

## 10. Assets Inventory

### Brand Logos

| File | Usage |
|------|--------|
| `assets/images/brand/logo.png` | Loader, footer, showcase, Who We Are |
| `assets/images/brand/logo-header.png` | Header (500×141, transparent PNG) |

### Partner Brands (Marquee / Clients Grid)

`assets/images/brands/Brand-1.png` through `Brand-12.png`

### Team

| File | Usage |
|------|--------|
| `assets/images/team/Founder.png` | About page founder section |

### Project / Case Study Images

| File | Used on |
|------|---------|
| `image1.png`, `image2.png`, `image3.png` | Clients case studies |
| `image6.png` – `image8.png`, `image27.png`, `image28.png`, `image30.png` | Clients gallery |
| `image31.png` | Solutions (franchise), Industries (startups) |

### External Images

Most hero and industry/solution photos use **Unsplash CDN URLs** embedded directly in HTML.

---

## 11. Forms & Integrations

### Contact Form (`#contact-form`)

| Field | Required |
|-------|----------|
| Full Name | Yes |
| Email | Yes |
| Phone | No |
| Subject | Yes (dropdown) |
| Message | Yes |
| Honeypot (`website`) | Hidden spam trap |

**Backend:** Google Apps Script web app URL set in `main.js` → `GOOGLE_SCRIPT_URL`  
See `CONTACT-FORM-SETUP-GUIDE.md` for setup instructions.

### Newsletter (`#newsletter-form`)

- Homepage footer only  
- Client-side validation + alert (no server persistence yet)

### External Links

- Phone: `tel:+919824461445`
- Email: `mailto:branddrive.in@gmail.com`
- WhatsApp: `https://wa.me/919824461445`

---

## 12. Mobile Behaviour

Applied only at **≤768px** via `mobile.css` + `mobile.js`:

| Feature | Behaviour |
|---------|-----------|
| Navigation | Hamburger menu, full-screen overlay |
| Long card sections | Horizontal swipe + scroll-snap (Industries, Solutions, Process, Why) |
| Swipe hints | "Swipe to explore →" labels |
| Footer | Accordion — links hidden until heading tapped |
| Logo | Smaller header logo (50px / 46px) |
| Typography | Reduced heading and body sizes |
| Cursor glow | Disabled |
| Lenis | Not initialized on touch devices |

**Desktop layout is unchanged** by mobile CSS (wrapped in `@media max-width`).

---

## 13. Deployment & Local Setup

### Run Locally

No install required. Options:

```bash
# Option 1: Open directly
# Double-click index.html (some features may need a local server)

# Option 2: Python simple server
cd brand-drive
python -m http.server 8080
# Visit http://localhost:8080

# Option 3: VS Code Live Server extension
```

### Deploy

Upload entire `brand-drive/` folder to any static host:

- Netlify, Vercel, GitHub Pages  
- cPanel / shared hosting  
- AWS S3 + CloudFront  

No build step. Ensure all `assets/` files upload together (especially `brands/` logos for marquee).

### Before Go-Live Checklist

- [ ] Set `GOOGLE_SCRIPT_URL` in `main.js` for contact form  
- [ ] Replace Unsplash placeholders with client photography  
- [ ] Update social media URLs in footer (currently `#` placeholders)  
- [ ] Verify all 12 brand logos exist in `assets/images/brands/`  
- [ ] Test marquee animation after zip/deploy (all assets must be included)  

---

## 14. Section Count Summary

| Page | File | Content Sections | Notes |
|------|------|------------------|-------|
| **Home** | `index.html` | **10** | Richest page — full funnel |
| **About** | `about.html` | **7** | Founder, mission, values, why |
| **Solutions** | `solutions.html` | **13** | 1 hero + 12 service blocks |
| **Industries** | `industries.html` | **10** | 1 hero + 8 industries + CTA |
| **Clients** | `clients.html` | **6** | Portfolio + case studies |
| **Contact** | `contact.html` | **1** | Form + info + map combined |
| | **TOTAL** | **47** | Across all pages |

### Content Item Counts (site-wide)

| Content Type | Count |
|--------------|-------|
| HTML pages | 6 |
| Solution offerings (full page) | 12 |
| Solution cards (homepage preview) | 6 |
| Industry segments | 8 |
| Industry cards (homepage preview) | 6 |
| Process steps | 5 |
| Why Brand Drive points | 4 (home) + 4 (about) |
| Core values | 4 |
| Success metrics | 5 |
| Testimonials | 3 (home) + 2 (clients) |
| Case studies | 3 |
| Gallery images | 6 |
| Partner brand logos | 12 |
| Nav dropdown links | 8 industries + 12 solutions = 20 |

---

## Quick Reference — Key Contacts

| | |
|---|---|
| **Founder** | Mitesh Baudhanwala |
| **Phone** | +91 98244 61445 |
| **Email** | branddrive.in@gmail.com |
| **Address** | SNS Atria, Surat, Gujarat, India |
| **Hours** | Mon–Fri 9–7 · Sat 10–5 · Sun Closed |

---

*Documentation generated for Brand Drive® website project. For asset folder details see `ASSETS-FOLDER-STRUCTURE.md`. For contact form setup see `CONTACT-FORM-SETUP-GUIDE.md`.*
