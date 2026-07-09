# Room Detail Section Redesign — Design Spec

**Date:** 2026-07-09
**Status:** Approved (verbal) — pending user review of written spec
**Scope:** `/rooms` page → `.room-detail-section` blocks (Deluxe Double Room & King Room with Pool View)

---

## 1. Problem

The current `.room-detail-section` (lines 3570–3724 of `rooms/index.html`) presents each room in a 2-column layout (5+7 Bootstrap split):

- **Left (col-lg-5):** Description, Room Detail icons, Facility icons, Reserve CTA
- **Right (col-lg-7):** Hero image with 4 thumbnail gallery in a side-by-side grid (`1.55fr 1fr` CSS grid)

The user has requested the section be redesigned so that the visual order becomes **title → photo → description → room detail**, stacked vertically. This aligns better with how guests scan hotel information: identify the room, see it, read about it, learn the amenities.

---

## 2. Goals

1. Vertical reading flow: title → photo → description → amenities → CTA.
2. Consistent treatment for both rooms (Deluxe + King).
3. Modern, boutique-hotel feel suitable for Rarama Living Studio.
4. Mobile-friendly photo gallery with lightbox.
5. No new dependencies (no Swiper, no Lightbox2) — vanilla JS only.

## 3. Non-Goals

- Changing the design tokens (`--colors`, `--color2`, fonts).
- Renaming or replacing image files.
- Modifying sections outside `.room-detail-section`.
- Touching the booking URL (`https://beds24.com/book-raramalivingstudio`).
- Adding server-side logic or build tooling.

---

## 4. Final Layout

Single-column section, `max-width: 960px`, horizontally centered.

```
+-----------------------------------------+
|       Room Type  (eyebrow tag)         |   <- Title block (centered)
|      Deluxe Double Room  (H2)          |
|              --- hr ---                |
|                                         |
|   [          HERO IMAGE SLIDER        ] |   <- Photo block
|   [  <   active photo slides here    > ]|
|   [   *  *  *  *  *   dots            ]|
|   [ thumb1 | thumb2 | thumb3 | thumb4 ] |   <- Thumbnail strip
|                                         |
|   Description                           |   <- Description (centered text)
|   <paragraph 1-2 lines...>              |
|                                         |
|   +-----+ +-----+ +-----+              |   <- Amenities grid (icons + label)
|   |  *  | |  *  | |  *  |              |     6 items merged into one block
|   |Guest| | Bed | |Bath |              |
|   +-----+ +-----+ +-----+              |
|   +-----+ +-----+ +-----+              |
|   |Wifi | |Pool | | AC  |              |
|   +-----+ +-----+ +-----+              |
|                                         |
|   +-----------------------------------+ |
|   |       RESERVE NOW  ->             | |   <- Full-width CTA
|   +-----------------------------------+ |
+-----------------------------------------+
```

---

## 5. Spacing & Typography

| Element | Property | Value |
|---|---|---|
| Section | `padding` | `120px 0 90px` (preserve existing) |
| Section | `max-width` of inner wrapper | `960px` |
| Block gap | Title -> Photo | `48px` |
| Block gap | Photo -> Description | `40px` |
| Block gap | Description -> Amenities | `32px` |
| Block gap | Amenities -> CTA | `32px` |
| H2 (room name) | font / size | `var(--primtext)` / `clamp(28px, 4vw, 40px)` |
| Description `p` | font / size / line-height | `var(--subtext)` / `16px` / `1.8` |
| Icon label | font / size | `var(--subtext)` / `13px`, uppercase, `letter-spacing: 2px` |

---

## 6. Photo Block — Slider + Lightbox

### 6.1 Structure
```html
<div class="rd-photo">
  <button class="rd-nav rd-prev" aria-label="Previous photo">&lsaquo;</button>
  <button class="rd-nav rd-next" aria-label="Next photo">&rsaquo;</button>
  <img class="rd-hero" src="..." alt="...">
  <div class="rd-dots"><span class="rd-dot active"></span>...</div>
  <div class="rd-thumbs">
    <img class="rd-thumb active" src="...">
    ...
  </div>
</div>
```

### 6.2 Behavior
- 5 images total (1 hero + 4 thumbs) for each room.
- Clicking a thumb or dot swaps the hero `src` (no re-fetch — all preloaded).
- `prev`/`next` buttons cycle through images.
- Clicking the hero or any thumb opens a **lightbox modal** (fullscreen overlay) with prev/next + close.
- Lightbox supports keyboard: `Esc` to close, `Left`/`Right` to navigate.
- Auto-play: optional, **off by default**. (User did not request it.)

### 6.3 CSS — slider
- `.rd-hero`: `width: 100%`, `aspect-ratio: 16/10`, `object-fit: cover`, `border-radius: 12px`.
- `.rd-thumbs`: horizontal flex, `gap: 8px`, scrollable horizontally on overflow (mobile).
- `.rd-thumb`: `flex: 0 0 auto`, `width: 96px`, `height: 64px`, `object-fit: cover`, `border-radius: 8px`, `opacity: 0.6`.
- `.rd-thumb.active`: `opacity: 1`, `outline: 2px solid var(--colors)`.
- `.rd-nav`: absolute-positioned round buttons (`44x44`) on top of hero with translucent black background and white arrow.
- `.rd-dots`: centered flex row below hero, `gap: 6px`. Each dot is an `8x8` circle; active = `var(--colors)`, inactive = `rgba(0,0,0,0.25)`.

### 6.4 CSS — lightbox
- `.rd-lightbox`: fixed fullscreen `rgba(0,0,0,0.92)` overlay, `z-index: 9999`, `display: flex` center.
- `.rd-lightbox img`: `max-width: 90vw`, `max-height: 85vh`, `object-fit: contain`, `border-radius: 8px`.
- Close button: top-right, `32x32`, white "x".
- Prev/next buttons: large arrows on left/right edges.

---

## 7. Amenities Grid

### 7.1 Structure
```html
<ul class="rd-amenities">
  <li><i class="fas fa-users"></i><span>2 Guest</span></li>
  <li><i class="fas fa-bed"></i><span>Full Bed</span></li>
  <li><i class="fas fa-shower"></i><span>1 Bathroom</span></li>
  <li><i class="fas fa-wifi"></i><span>Wifi</span></li>
  <li><i class="fas fa-swimming-pool"></i><span>Pool</span></li>
  <li><i class="fas fa-snowflake"></i><span>Full AC</span></li>
</ul>
```

### 7.2 CSS
- `.rd-amenities`: `list-style: none`, `padding: 0`, `display: grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: 24px`.
- Each `li`: `display: flex`, `flex-direction: column`, `align-items: center`, `gap: 12px`, `text-align: center`, `padding: 20px 12px`, `border: 1px solid #f0f0f0`, `border-radius: 8px`.
- Icon styling (applied to the `<i>` directly inside `li`, since structure 7.1 puts `<i>` and `<span>` as siblings inside `li`): `width: 56px`, `height: 56px`, `border-radius: 50%`, `background: rgba(0, 82, 50, 0.08)`, `color: var(--colors)`, `display: flex; align-items: center; justify-content: center`, `font-size: 20px`. The `<i>` element receives this styling; the `<span>` next to it remains a plain inline label.
- Hover state on `li`: `border-color: var(--colors)`; `<i>` background becomes `var(--colors)`, `<i>` color becomes `#fff`. Transition `300ms ease`.

### 7.3 Responsive
- >=768px: 3 columns.
- 480-767px: 2 columns.
- <480px: 1 column.

---

## 8. Reserve CTA

### 8.1 Structure
```html
<a class="rd-cta" href="https://beds24.com/book-raramalivingstudio">
  <span>RESERVE NOW</span><i class="fas fa-arrow-right"></i>
</a>
```

### 8.2 CSS
- `display: flex`, `align-items: center`, `justify-content: center`, `gap: 12px`.
- `width: 100%`, `padding: 18px 0`, `background: var(--colors)`, `color: #fff`, `text-decoration: none`.
- Font: `var(--subtext)`, `13px`, uppercase, `letter-spacing: 3px`, `font-weight: 600`.
- Hover: `background: var(--color4)`, `letter-spacing: 4px`, arrow `translateX(4px)`. Transition `350ms ease`.

---

## 9. JavaScript (vanilla, ~70 lines)

A single `<script>` block placed after the two `.room-detail-section` blocks. The IIFE iterates each section so Deluxe and King Room are independent.

Behavior summary:
- Wire `prev` / `next` / dots / thumbs on the inner section.
- A single lightbox element is created and appended to `<body>` once, then reused for both sections.
- `data-room-section` attribute on the lightbox tracks which section is active so prev/next operates on the right thumb list.
- Keyboard listeners on `document` (Esc / Left / Right) are only honored when the lightbox has the `open` class.

Implementation note: build the lightbox DOM with `createElement` + `textContent` (no `innerHTML`) to satisfy safe-DOM practice.

---

## 10. Files Modified

| File | Change |
|---|---|
| `rooms/index.html` | Replace markup of `.room-detail-section#deluxe-room` and `#king-room` |
| `rooms/index.html` | Replace the existing `.room-detail-section` `<style>` block with new CSS |
| `rooms/index.html` | Append one `<script>` block after the section markup |

No new files. No external assets. No `package.json` change.

---

## 11. Acceptance Criteria

1. Both rooms render in the new top-down order: title, photo slider, description, amenities, CTA.
2. Photo block: clicking thumb or dot updates the hero; prev/next buttons cycle; clicking hero opens lightbox.
3. Lightbox: opens on click, closes on x / outside-click / Esc, navigates with arrows / Left/Right keys.
4. Amenities: 6 items shown in a 3-column grid (responsive down to 1 column).
5. CTA is full-width and preserves the existing hover transition (letter-spacing widening, arrow shift).
6. On viewport <576px, layout remains readable — no horizontal scroll on the page.
7. No console errors.
8. No new CDN/library imports added.
9. No changes outside `.room-detail-section` (verify by visual diff).

---

## 12. Out of Scope (Explicitly)

- Pricing display / currency
- Availability calendar
- Multi-language copy
- SEO schema markup additions
- Animation libraries (GSAP, AOS)
- Backend integration for reservations