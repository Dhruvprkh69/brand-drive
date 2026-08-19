# Brand Drive — Assets Folder (Current Layout)

Code is adjusted to match **what is in the folder now**.  
Drop files in these paths — use the **exact filenames** shown.

---

## Current files (live on site)

```
assets/images/
├── brand/
│   └── logo.png                 ✅ Header · loader · footer · Who We Are
│
├── brands/
│   ├── Brand-1.png … Brand-12.png   ✅ Homepage slideshow + Clients grid
│   └── README.txt
│
├── hero/
│   └── image29.png              ✅ Homepage hero background
│
├── team/
│   └── Founder.png              ✅ About page — Mitesh Baudhanwala
│
├── image1.png … image31.png     ✅ Clients case studies + gallery (subset used)
```

**Auto-loaded by JS:** All `Brand-1.png` … `Brand-12.png` in `brands/` — no HTML edit needed when you swap logos.

---

## Folder tree (for future photos)

```
assets/images/
├── brand/logo.png
├── brands/Brand-1.png … Brand-12.png
├── hero/image29.png          (add more heroes when ready)
├── team/Founder.png
├── industries/                 ← empty — drop industry photos here later
├── solutions/                  ← empty — drop service photos here later
├── sections/                   ← empty — CTA banners
└── case-studies/               ← empty — project photos
```

When you add files to `hero/`, `industries/`, etc., tell us the filenames — we wire them into the pages.

---

## What each page uses today

| Page | Local assets used |
|------|-------------------|
| **Home** | `hero/image29.png`, `brand/logo.png`, `brands/Brand-*.png` (marquee) |
| **About** | `team/Founder.png`, `brand/logo.png` |
| **Clients** | `brands/Brand-*.png` (grid), `image1–3`, `image6–8`, `image27–28`, `image30` |
| **Solutions** | `image31.png` (franchise section), `brand/logo.png` |
| **Industries** | `image31.png` (startups section), `brand/logo.png` |
| **Other pages** | `brand/logo.png` only (+ Unsplash placeholders until you add heroes) |

---

## Image guidelines

| Type | Format | Notes |
|------|--------|-------|
| Brand logos | PNG | Transparent bg, similar visual height |
| Main logo | PNG | Transparent — `brand/logo.png` |
| Hero / photos | JPG or PNG | Min 1600px wide for heroes |
| Founder | PNG/JPG | Portrait — `team/Founder.png` |

---

## Adding more brand logos

1. Add `Brand-18.png`, `Brand-19.png`, … in `brands/`
2. Open `assets/js/brands.js`
3. Change `const BRAND_COUNT = 12;` in `assets/js/brands.js` to your new total

---

## Safe to delete

Old root files you already removed are **not** referenced anymore.  
Keep anything still listed in the table above.

Optional cleanup (not used by site):
- `images/image2.png` … if not in clients gallery — check before deleting

---

*Updated to match your arranged assets folder.*
