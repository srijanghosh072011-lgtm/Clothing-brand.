# NOCTAIRRE 夜

A custom Shopify theme for Noctairre — Japanese-influenced dark streetwear.
Pure monochrome, cinematic motion, drifting sakura, and designed placeholders so
the store looks finished before any photography exists.

**Store:** `4cwdw1-f9.myshopify.com` · CAD · Canada

---

## Getting it onto the store

You need the Shopify CLI once. Everything after that is one command.

```bash
# 1. Install the CLI (once)
npm install -g @shopify/cli@latest

# 2. From this folder, push the theme as an unpublished draft
shopify theme push --unpublished --theme "Noctairre 夜"

# 3. Preview it before going anywhere near live
shopify theme dev
```

`shopify theme dev` gives you a local preview URL with hot reload — edit a file,
see it instantly. This is the right way to work on it.

When you are happy: Shopify admin → **Online Store → Themes**, find
"Noctairre 夜", and hit **Publish**.

> **Do not publish before duplicating whatever theme is currently live.** That
> duplicate is your rollback.

---

## What is already set up on the store

| Thing | Status |
|---|---|
| 13 products with sizes, SKUs, prices, descriptions | Live |
| Real inventory levels (some sizes intentionally at 0) | Live |
| 5 collections — Outerwear, Bottoms, Tops, Accessories, 黒波 Capsule | Live, auto-populating |
| Pages — About, Lookbook, Contact, FAQ, Size Guide, Shipping & Returns | Live |
| Menus — main nav + three footer menus | Live |
| Legal policies | **Not done — see `legal/POLICIES.md`** |

The products have **no images**. That is deliberate: the theme renders designed
placeholders (dark gradient, film grain, faint 夜 watermark) wherever an image is
missing. Add real photos in Shopify and they appear automatically — no code
change needed.

---

## Design system

Everything lives in the token block at the top of `assets/noctairre.css`.
Change it there and it propagates everywhere.

```
--void      #050505   page background
--surface   #0E0E0E   cards
--bone      #F4F2ED   primary text      18.9:1 contrast
--mute      #8A8783   secondary text     5.4:1 contrast — AA safe
--dim       #56534F   DECORATION ONLY    2.7:1 — never use for text
```

**Type:** Archivo (variable, used at `wdth` 92–125 for the wide display look) +
Zen Kaku Gothic New for body and every Japanese glyph.

**Motion:** one easing curve, `cubic-bezier(0.32, 0.72, 0, 1)`. Everything
animates only `transform` and `opacity`.

---

## File map

```
layout/theme.liquid          document shell, fonts, schema
assets/noctairre.css         entire design system, one file
assets/noctairre.js          motion + cart + variants, vanilla, no deps

sections/
  header.liquid              floating glass island nav + morphing hamburger
  footer.liquid              link columns + oversized wordmark
  cart-drawer.liquid         slide-out bag (re-rendered server-side)
  hero.liquid                full-height wordmark + 夜 + petals
  featured-split.liquid      asymmetric 7/5 bento grid
  cta-band.liquid            breather section, one button
  product-grid.liquid        product grid, falls back to placeholders
  newsletter.liquid          CASL-compliant express opt-in
  marquee.liquid             announcement ticker
  main-product.liquid        PDP — variants, accordions, related
  main-collection.liquid     listing + sort + pagination
  main-cart.liquid           full cart page (no-JS fallback)
  main-search.liquid         search results
  main-404.liquid            404 with a route back
  main-page.liquid           generic prose page
  lookbook.liquid            full-bleed editorial panels
  about-story.liquid         brand narrative + pillars
  contact-form.liquid        contact form
  faq.liquid                 accordions + FAQPage schema
  size-guide.liquid          editable measurement tables

snippets/
  product-card.liquid        card with live size availability
  placeholder-media.liquid   image OR designed placeholder
  meta-tags.liquid           OG, Twitter, JSON-LD
  icon.liquid                all icons, one 24×24 viewBox
  petals.liquid / grain.liquid / intro-veil.liquid

check_theme.py               504-assertion validator — run before every push
SECURITY.md                  what is actually yours to secure on Shopify
legal/POLICIES.md            policy drafts to paste into Shopify
```

---

## Before every push

```bash
python3 check_theme.py
```

It checks that every JSON file parses, every section schema is valid, every
template references a section that exists, every `{% render %}` resolves to a
real snippet, Liquid tags are balanced, and the accessibility guarantees
(reduced-motion, focus states, no emoji icons, no `100vh`) still hold.

---

## Editing without touching code

Almost everything is editable in **Online Store → Themes → Customize**:

- Reorder, hide or duplicate any homepage section
- All headings, body copy, button labels and links
- Swap any placeholder for a real image
- Turn petals, film grain and the 夜 intro on or off
  (**Theme settings → Atmosphere**)
- Social links (**Theme settings → Social**)
- Size guide tables — add rows and columns as plain comma-separated text

---

## Known limitations, deliberately

| Skipped | Add it when |
|---|---|
| Faceted collection filters | The catalogue passes ~40 products. It is a Search & Discovery app feature, not theme code. |
| Product image gallery with thumbnails | You have real photography. Right now every PDP shows a stacked grid, which suits editorial imagery better anyway. |
| Drop countdowns / waitlists | You move to timed releases. Bolts on as one section. |
| Customer account templates | You enable accounts — Shopify's defaults work until then. |
| Self-hosted fonts | You want the last ~100ms of load time. Currently Google Fonts with preconnect. |
| Multi-currency / language toggle | You sell outside Canada in volume. |

---

## Still to do before you can sell

1. **Upgrade off the trial plan** — you cannot take real orders until you do.
2. **Paste the four policies** from `legal/POLICIES.md`.
3. **Turn on 2FA** for the store owner account — see `SECURITY.md`.
4. Add real product photography.
5. Set up shipping rates in **Settings → Shipping and delivery** so they match
   the shipping policy text.
6. Connect a domain and remove the storefront password.
7. Place one real test order end to end, then refund it.
