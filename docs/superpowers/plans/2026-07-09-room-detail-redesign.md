# Room Detail Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `.room-detail-section` blocks on `/rooms` so each room displays in a top-down vertical flow (title, photo slider, description, amenities, CTA) with a vanilla-JS slider + lightbox, applied to both Deluxe and King Room.

**Architecture:** Single file modification (`rooms/index.html`). Markup is generated from data attributes by a small initializer script to guarantee Deluxe and King Room stay structurally identical. CSS replaces the existing `.room-detail-section` block. A single shared lightbox element lives at `<body>` level and tracks which section opened it.

**Tech Stack:** Vanilla HTML5 + CSS3 (CSS Grid, custom properties, `aspect-ratio`) + vanilla JavaScript (ES5-compatible IIFE). Bootstrap 5 grid classes preserved for outer container. FontAwesome 5 icon classes preserved.

## Global Constraints

- **Design tokens (do NOT change):** `--colors: #005232`, `--color2: #181818`, `--color4: linear-gradient(90deg,#181818,#000000)`, `--color5: linear-gradient(90deg,#005232,#005232)`, `--background1: #F7F2E0`, `--primtext: "Alegreya"`, `--subtext: "Alegreya Sans"`.
- **Booking URL (do NOT change):** `https://beds24.com/book-raramalivingstudio`.
- **Image paths (do NOT change):** `assets/img/rooms/deluxe/*.webp` and `assets/img/rooms/king-room/*.webp`.
- **No new dependencies** — no CDN imports, no `npm install`, no `package.json` change.
- **Section padding:** preserve `120px 0 90px` on `.room-detail-section`.
- **DOM safety:** build lightbox with `document.createElement` + `textContent`. Never use `innerHTML` with variable content.
- **Out-of-scope:** pricing, availability calendar, animations beyond CSS transitions, SEO schema.

---

## File Structure

| File | Change | Responsibility |
|---|---|---|
| `rooms/index.html` | Replace markup of `#deluxe-room` and `#king-room` with **data-driven stub** (see Task 1) | Holds per-room data (name, description, amenities, image list) |
| `rooms/index.html` | Replace existing `.room-detail-section` `<style>` block (lines 3349–3567) | New vertical-layout CSS + lightbox styles |
| `rooms/index.html` | Append one `<script>` block before `</body>` | Initializer: builds room DOM from data, wires slider, builds lightbox |

No new files. No external assets.

---

## Task 1: Replace room section markup with data-driven stub

**Files:**
- Modify: `rooms/index.html` lines 3570–3646 (Deluxe) and 3648–3724 (King)
- Verify: visual diff via `git diff rooms/index.html`

**Interfaces:**
- Produces: two `<section class="room-detail-section" data-room="deluxe">…</section>` blocks where each contains a `<script type="application/json" class="rd-data">` element with the room payload.
- Consumes (later): the JSON schema `{ "name": string, "nameId": string, "description": string, "amenities": [{icon, label}], "images": [string] }`.

- [ ] **Step 1: Replace Deluxe markup**

Find lines 3570–3646 (from `<section class="room-detail-section" id="deluxe-room">` through its closing `</section>`) and replace with:

```html
<section class="room-detail-section" id="deluxe-room" data-room="deluxe">
  <div class="container">
    <div class="rd-inner">
      <div class="text-center rd-head">
        <span class="rd-eyebrow">Room Type</span>
        <h2 class="rd-title">Deluxe Double Room</h2>
        <hr class="rd-rule">
      </div>
      <script type="application/json" class="rd-data">
        {
          "name": "Deluxe Double Room",
          "nameId": "deluxe-room",
          "description": "Indulge in comfort and convenience at our hotel, designed to accommodate up to 2 guests. Enjoy a refreshing outdoor pool and modern bathroom amenities for your relaxation. Experience ultimate comfort with air conditioning and entertainment on a flat-screen TV. Step onto the terrace to soak in the views, stay connected with free Wi-Fi, and rest assured with complimentary parking during your stay.",
          "amenities": [
            { "icon": "fas fa-users",       "label": "2 Guest" },
            { "icon": "fas fa-bed",         "label": "Full Bed" },
            { "icon": "fas fa-shower",      "label": "1 Bathroom" },
            { "icon": "fas fa-wifi",        "label": "Wifi" },
            { "icon": "fas fa-swimming-pool","label": "Pool" },
            { "icon": "fas fa-snowflake",   "label": "Full AC" }
          ],
          "images": [
            "assets/img/rooms/deluxe/bed.webp",
            "assets/img/rooms/deluxe/bed-1.webp",
            "assets/img/rooms/deluxe/bathroom.webp",
            "assets/img/rooms/deluxe/bedroom-view.webp",
            "assets/img/rooms/deluxe/bed-morning.webp"
          ]
        }
      </script>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Replace King Room markup**

Find lines 3648–3724 (from `<section class="room-detail-section" id="king-room">` through its closing `</section>`) and replace with:

```html
<section class="room-detail-section" id="king-room" data-room="king">
  <div class="container">
    <div class="rd-inner">
      <div class="text-center rd-head">
        <span class="rd-eyebrow">Room Type</span>
        <h2 class="rd-title">King Room With Pool View</h2>
        <hr class="rd-rule">
      </div>
      <script type="application/json" class="rd-data">
        {
          "name": "King Room With Pool View",
          "nameId": "king-room",
          "description": "Indulge in luxury with our king room, designed to elevate your stay with spacious accommodation and upscale amenities. Experience comfort and style with separate living and sleeping areas, perfect for relaxation or productivity. Unwind in a lavish bathroom, savoring modern comforts and indulgent features. Elevate your experience with personalized service and unparalleled comfort in our king room.",
          "amenities": [
            { "icon": "fas fa-users",       "label": "2 Guest" },
            { "icon": "fas fa-bed",         "label": "King Bed" },
            { "icon": "fas fa-shower",      "label": "1 Bathroom" },
            { "icon": "fas fa-wifi",        "label": "Wifi" },
            { "icon": "fas fa-swimming-pool","label": "Pool" },
            { "icon": "fas fa-snowflake",   "label": "Full AC" }
          ],
          "images": [
            "assets/img/rooms/king-room/bed.webp",
            "assets/img/rooms/king-room/bed.webp",
            "assets/img/rooms/king-room/bed-lamp-night.webp",
            "assets/img/rooms/king-room/bathroom.webp",
            "assets/img/rooms/king-room/bed-bath-view.webp"
          ]
        }
      </script>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify replacement via grep**

Run: `grep -c 'class="room-detail-section"' rooms/index.html`
Expected: `2`

Run: `grep -c 'class="rd-data"' rooms/index.html`
Expected: `2`

If either count is wrong, re-check which section was replaced.

- [ ] **Step 4: Stage the change**

Run:
```bash
cd "/Users/rizmana/Downloads/Rarama Living Studio"
git diff --stat rooms/index.html
```
Expected: ~76 lines removed, ~74 lines added in `rooms/index.html`.

Do **not** commit yet — markup alone renders nothing useful. Proceed to Task 2.

---

## Task 2: Replace `.room-detail-section` CSS block with new vertical-layout styles

**Files:**
- Modify: `rooms/index.html` lines 3349–3567 (the existing `<style>` block starting with `/* ROOM DETAIL SECTIONS */` and ending with `}</style>` before `<section class="room-detail-section" id="deluxe-room">`)

**Interfaces:**
- Consumes: class names from Task 1 markup (`.rd-inner`, `.rd-head`, `.rd-eyebrow`, `.rd-title`, `.rd-rule`).
- Produces: CSS rules for those classes plus a placeholder `.rd-body { display:none }` so the page doesn't break before Task 3 JS runs. JS in Task 3 will remove this rule (or override it via inline style).

- [ ] **Step 1: Locate the exact CSS block to replace**

Confirm the block starts at `/* =========================\nROOM DETAIL SECTIONS` (line 3349 in current file) and ends with the closing `</style>` immediately before line 3570's `<section class="room-detail-section" id="deluxe-room">`.

- [ ] **Step 2: Replace the block with the new CSS**

Replace the entire block (from `<style>` open tag through `</style>` close) with:

```html
<style>
/* =========================
ROOM DETAIL SECTIONS — vertical layout
========================= */
.room-detail-section {
    padding: 120px 0 90px;
    background: #fff;
    position: relative;
    border-top: 1px solid #f0f0f0;
}
.room-detail-section:first-of-type {
    border-top: none;
}
.room-detail-section .rd-inner {
    max-width: 960px;
    margin: 0 auto;
}

/* HEAD (title block) */
.room-detail-section .rd-head {
    margin-bottom: 48px;
}
.room-detail-section .rd-eyebrow {
    display: inline-block;
    font-family: var(--subtext);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 4px;
    color: var(--color2);
    margin-bottom: 14px;
}
.room-detail-section .rd-title {
    font-family: var(--primtext);
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 500;
    color: var(--color2);
    margin: 0 0 18px 0;
    letter-spacing: 0.5px;
}
.room-detail-section .rd-rule {
    width: 60px;
    height: 2px;
    background: var(--colors);
    border: 0;
    margin: 0 auto;
}

/* BODY (filled by JS in Task 3) */
.room-detail-section .rd-body {
    display: none;
}
.room-detail-section .rd-body.rd-ready {
    display: block;
}

/* PHOTO BLOCK */
.room-detail-section .rd-photo {
    position: relative;
    margin-bottom: 40px;
}
.room-detail-section .rd-hero {
    display: block;
    width: 100%;
    aspect-ratio: 16/10;
    object-fit: cover;
    border-radius: 12px;
    cursor: zoom-in;
    background: #f5f5f5;
}
.room-detail-section .rd-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    border: none;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 250ms ease;
}
.room-detail-section .rd-nav:hover { background: rgba(0, 0, 0, 0.8); }
.room-detail-section .rd-prev { left: 14px; }
.room-detail-section .rd-next { right: 14px; }

.room-detail-section .rd-dots {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 14px;
}
.room-detail-section .rd-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.25);
    cursor: pointer;
    transition: background 200ms ease;
}
.room-detail-section .rd-dot.active { background: var(--colors); }

.room-detail-section .rd-thumbs {
    display: flex;
    gap: 8px;
    margin-top: 14px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
}
.room-detail-section .rd-thumb {
    flex: 0 0 auto;
    width: 96px;
    height: 64px;
    object-fit: cover;
    border-radius: 8px;
    opacity: 0.55;
    cursor: pointer;
    transition: opacity 200ms ease, outline-color 200ms ease;
    outline: 2px solid transparent;
}
.room-detail-section .rd-thumb.active {
    opacity: 1;
    outline-color: var(--colors);
}

/* DESCRIPTION */
.room-detail-section .rd-desc {
    text-align: center;
    max-width: 720px;
    margin: 0 auto 32px auto;
    font-family: var(--subtext);
    color: #555;
    font-size: 16px;
    line-height: 1.8;
}

/* AMENITIES */
.room-detail-section .rd-amenities {
    list-style: none;
    padding: 0;
    margin: 0 0 32px 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}
.room-detail-section .rd-amenities li {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
    padding: 20px 12px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    transition: border-color 300ms ease;
}
.room-detail-section .rd-amenities li:hover {
    border-color: var(--colors);
}
.room-detail-section .rd-amenities i {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(0, 82, 50, 0.08);
    color: var(--colors);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: background 300ms ease, color 300ms ease;
}
.room-detail-section .rd-amenities li:hover i {
    background: var(--colors);
    color: #fff;
}
.room-detail-section .rd-amenities span {
    font-family: var(--subtext);
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--color2);
}

/* CTA */
.room-detail-section .rd-cta-wrap {
    text-align: center;
}
.room-detail-section .rd-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    max-width: 480px;
    padding: 18px 0;
    background: var(--colors);
    color: #fff !important;
    font-family: var(--subtext);
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-weight: 600;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background 350ms ease, letter-spacing 350ms ease;
}
.room-detail-section .rd-cta i {
    transition: transform 350ms ease;
}
.room-detail-section .rd-cta:hover {
    background: var(--color4);
    letter-spacing: 4px;
}
.room-detail-section .rd-cta:hover i {
    transform: translateX(4px);
}

/* RESPONSIVE */
@media (max-width: 767px) {
    .room-detail-section .rd-amenities { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 479px) {
    .room-detail-section .rd-amenities { grid-template-columns: 1fr; }
    .room-detail-section .rd-nav { width: 36px; height: 36px; font-size: 18px; }
    .room-detail-section .rd-thumb { width: 72px; height: 48px; }
}

/* LIGHTBOX */
.rd-lightbox {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.92);
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
}
.rd-lightbox.open { display: flex; }
.rd-lightbox img {
    max-width: 90vw;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 8px;
}
.rd-lightbox button {
    position: absolute;
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 200ms ease;
}
.rd-lightbox button:hover { background: rgba(255, 255, 255, 0.35); }
.rd-lightbox .rd-lb-close {
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 22px;
}
.rd-lightbox .rd-lb-prev {
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    font-size: 24px;
}
.rd-lightbox .rd-lb-next {
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    font-size: 24px;
}
</style>
```

- [ ] **Step 3: Verify the new style block is in place**

Run: `grep -c 'rd-lightbox' rooms/index.html`
Expected: at least `5` (selector + 4 button refs)

Run: `grep -n 'rd-rule' rooms/index.html`
Expected: a single line referencing `.rd-rule`.

- [ ] **Step 4: Visual smoke check (no JS yet)**

Open `http://localhost:3005/rooms` in a browser. Expected:
- The page title block for each room appears (eyebrow + H2 + hr).
- **No photo, description, amenities, or CTA visible** (`.rd-body` is hidden until JS adds `rd-ready`).

If something other than the title is showing, you forgot to remove old `.rd-*` rules or didn't include `display:none` on `.rd-body`.

Do **not** commit yet — proceed to Task 3.

---

## Task 3: Append initializer script (build DOM + slider + lightbox)

**Files:**
- Modify: `rooms/index.html` — append one `<script>` block immediately before `</body>`.

**Interfaces:**
- Consumes: each `.room-detail-section[data-room]` with its `.rd-data` JSON payload.
- Produces:
  - `.rd-body` element per section containing `.rd-photo`, `.rd-desc`, `.rd-amenities`, `.rd-cta-wrap`.
  - A single global `.rd-lightbox` element appended to `<body>`.
  - Click handlers: thumbs, dots, prev/next (slider), hero (lightbox open), lightbox controls, keyboard.

- [ ] **Step 1: Locate the `</body>` tag**

Run: `grep -n '</body>' rooms/index.html`
Expected output: one line near the end of the file (e.g. line 5399).

- [ ] **Step 2: Insert the initializer script before `</body>`**

Insert this block immediately above the `</body>` tag:

```html
<script>
(function () {
    'use strict';

    function buildPhoto(images, name) {
        var photo = document.createElement('div');
        photo.className = 'rd-photo';

        var prev = document.createElement('button');
        prev.className = 'rd-nav rd-prev';
        prev.type = 'button';
        prev.setAttribute('aria-label', 'Previous photo');
        prev.textContent = '\u2039';

        var next = document.createElement('button');
        next.className = 'rd-nav rd-next';
        next.type = 'button';
        next.setAttribute('aria-label', 'Next photo');
        next.textContent = '\u203a';

        var hero = document.createElement('img');
        hero.className = 'rd-hero';
        hero.loading = 'lazy';
        hero.decoding = 'async';
        hero.src = images[0];
        hero.alt = name;
        hero.dataset.role = 'hero';

        var dots = document.createElement('div');
        dots.className = 'rd-dots';
        images.forEach(function (_, i) {
            var dot = document.createElement('span');
            dot.className = 'rd-dot' + (i === 0 ? ' active' : '');
            dot.dataset.idx = String(i);
            dots.appendChild(dot);
        });

        var thumbs = document.createElement('div');
        thumbs.className = 'rd-thumbs';
        images.forEach(function (src, i) {
            var t = document.createElement('img');
            t.className = 'rd-thumb' + (i === 0 ? ' active' : '');
            t.loading = 'lazy';
            t.decoding = 'async';
            t.src = src;
            t.alt = name + ' photo ' + (i + 1);
            t.dataset.idx = String(i);
            thumbs.appendChild(t);
        });

        photo.appendChild(prev);
        photo.appendChild(next);
        photo.appendChild(hero);
        photo.appendChild(dots);
        photo.appendChild(thumbs);
        return photo;
    }

    function buildDesc(text) {
        var desc = document.createElement('div');
        desc.className = 'rd-desc';
        var p = document.createElement('p');
        p.textContent = text;
        desc.appendChild(p);
        return desc;
    }

    function buildAmenities(items) {
        var ul = document.createElement('ul');
        ul.className = 'rd-amenities';
        items.forEach(function (item) {
            var li = document.createElement('li');
            var ic = document.createElement('i');
            ic.className = item.icon;
            var sp = document.createElement('span');
            sp.textContent = item.label;
            li.appendChild(ic);
            li.appendChild(sp);
            ul.appendChild(li);
        });
        return ul;
    }

    function buildCTA() {
        var wrap = document.createElement('div');
        wrap.className = 'rd-cta-wrap';
        var a = document.createElement('a');
        a.className = 'rd-cta';
        a.href = 'https://beds24.com/book-raramalivingstudio';
        var label = document.createElement('span');
        label.textContent = 'RESERVE NOW';
        var arrow = document.createElement('i');
        arrow.className = 'fas fa-arrow-right';
        a.appendChild(label);
        a.appendChild(arrow);
        wrap.appendChild(a);
        return wrap;
    }

    // Build one shared lightbox element on <body>.
    var lb = document.createElement('div');
    lb.className = 'rd-lightbox';
    var lbClose = document.createElement('button');
    lbClose.className = 'rd-lb-close';
    lbClose.type = 'button';
    lbClose.setAttribute('aria-label', 'Close');
    lbClose.textContent = '\u00d7';
    var lbPrev = document.createElement('button');
    lbPrev.className = 'rd-lb-prev';
    lbPrev.type = 'button';
    lbPrev.setAttribute('aria-label', 'Previous photo');
    lbPrev.textContent = '\u2039';
    var lbImg = document.createElement('img');
    lbImg.className = 'rd-lb-img';
    lbImg.alt = '';
    var lbNext = document.createElement('button');
    lbNext.className = 'rd-lb-next';
    lbNext.type = 'button';
    lbNext.setAttribute('aria-label', 'Next photo');
    lbNext.textContent = '\u203a';
    lb.appendChild(lbClose);
    lb.appendChild(lbPrev);
    lb.appendChild(lbImg);
    lb.appendChild(lbNext);
    document.body.appendChild(lb);

    // Per-section state for slider
    var sections = document.querySelectorAll('.room-detail-section[data-room]');
    var activeSection = null;

    function showIdx(section, i) {
        var hero = section.querySelector('.rd-hero');
        var thumbs = section.querySelectorAll('.rd-thumb');
        var dots = section.querySelectorAll('.rd-dot');
        var total = thumbs.length;
        var idx = ((i % total) + total) % total;
        hero.src = thumbs[idx].src;
        hero.alt = thumbs[idx].alt;
        thumbs.forEach(function (t, n) { t.classList.toggle('active', n === idx); });
        dots.forEach(function (d, n) { d.classList.toggle('active', n === idx); });
        section._rdIdx = idx;
    }

    function openLB(section) {
        activeSection = section;
        lbImg.src = section.querySelector('.rd-hero').src;
        lbImg.alt = section.querySelector('.rd-hero').alt;
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeLB() {
        lb.classList.remove('open');
        document.body.style.overflow = '';
        activeSection = null;
    }
    function lbNav(delta) {
        if (!activeSection) return;
        showIdx(activeSection, (activeSection._rdIdx || 0) + delta);
        lbImg.src = activeSection.querySelector('.rd-hero').src;
        lbImg.alt = activeSection.querySelector('.rd-hero').alt;
    }

    sections.forEach(function (section) {
        var dataNode = section.querySelector('script.rd-data');
        if (!dataNode) return;
        var data;
        try { data = JSON.parse(dataNode.textContent); }
        catch (e) { console.error('rd: bad JSON for', section.dataset.room, e); return; }

        var inner = section.querySelector('.rd-inner');
        var body = document.createElement('div');
        body.className = 'rd-body';
        body.appendChild(buildPhoto(data.images, data.name));
        body.appendChild(buildDesc(data.description));
        body.appendChild(buildAmenities(data.amenities));
        body.appendChild(buildCTA());
        inner.appendChild(body);
        body.classList.add('rd-ready');

        section._rdIdx = 0;
        section.querySelector('.rd-prev').addEventListener('click', function () { showIdx(section, (section._rdIdx || 0) - 1); });
        section.querySelector('.rd-next').addEventListener('click', function () { showIdx(section, (section._rdIdx || 0) + 1); });
        section.querySelectorAll('.rd-dot').forEach(function (d) {
            d.addEventListener('click', function () { showIdx(section, parseInt(d.dataset.idx, 10)); });
        });
        section.querySelectorAll('.rd-thumb').forEach(function (t) {
            t.addEventListener('click', function () { showIdx(section, parseInt(t.dataset.idx, 10)); });
        });
        section.querySelector('.rd-hero').addEventListener('click', function () { openLB(section); });
    });

    lbClose.addEventListener('click', closeLB);
    lbPrev.addEventListener('click', function () { lbNav(-1); });
    lbNext.addEventListener('click', function () { lbNav(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLB(); });
    document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') closeLB();
        if (e.key === 'ArrowLeft') lbNav(-1);
        if (e.key === 'ArrowRight') lbNav(1);
    });
})();
</script>
```

- [ ] **Step 3: Smoke check in browser**

Open `http://localhost:3005/rooms`. Hard reload (Cmd/Ctrl+Shift+R) to bust cache.

Verify in order:
- [ ] Both Deluxe and King Room sections now show: title → photo (hero) → thumb strip → description → 6 amenity cards in a 3-column grid → full-width RESERVE NOW button.
- [ ] Clicking a thumb swaps the hero image.
- [ ] Clicking a dot swaps the hero image.
- [ ] Clicking prev/next arrows cycles through images.
- [ ] Clicking the hero image opens the lightbox overlay.
- [ ] Lightbox: prev/next buttons navigate, × closes, outside-click closes, Esc closes, arrow keys navigate.
- [ ] Hovering an amenity card: border turns green, icon background turns green, icon turns white.
- [ ] Hovering the CTA: background darkens, letter-spacing widens, arrow shifts right.
- [ ] Resize browser to 600px width: amenity grid becomes 2 columns.
- [ ] Resize browser to 400px width: amenity grid becomes 1 column, nav arrows smaller, thumbs smaller.

If any check fails, fix the corresponding section in `rooms/index.html` and re-test before committing.

- [ ] **Step 4: Verify no console errors**

Open browser devtools console. Expected: no errors (warnings about FontAwesome deprecation are OK to ignore).

- [ ] **Step 5: Commit**

Run:
```bash
cd "/Users/rizmana/Downloads/Rarama Living Studio"
git add rooms/index.html
git commit -m "$(cat <<'EOF'
feat(rooms): redesign room-detail section with vertical layout + slider

Replace 2-column side-by-side layout with top-down flow:
title -> photo slider -> description -> amenities -> CTA.

- Generate markup from per-section JSON data attribute so both rooms
  stay structurally identical.
- Vanilla-JS slider (thumbs/dots/prev/next) + shared lightbox overlay.
- 6 amenities merged into a single 3-column icon grid (responsive 2/1).
- Full-width RESERVE CTA preserves the existing hover transition.
- No new dependencies.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds. `git log --oneline -1` shows the new commit on top.

---

## Task 4: Final visual diff and out-of-scope guard

**Files:**
- Inspect only: `rooms/index.html`

- [ ] **Step 1: Confirm no edits outside the three intended zones**

Run:
```bash
cd "/Users/rizmana/Downloads/Rarama Living Studio"
git diff HEAD~1 HEAD --stat
```
Expected: only `rooms/index.html` changed.

Run:
```bash
git diff HEAD~1 HEAD -- rooms/index.html | head -5
```
Expected: changes starting inside the `<style>` block for room-detail (line ~3349) and ending after the inserted `<script>` near `</body>`.

If changes appear in unrelated sections (header, footer, other room-preview blocks), something went wrong — revert with `git reset --hard HEAD~1` and investigate.

- [ ] **Step 2: Confirm design tokens are unchanged**

Run:
```bash
grep -E "(--colors|--color2|--color4|--color5|--primtext|--subtext):" rooms/index.html | head -10
```
Expected: same values as before (`#005232`, `#181818`, etc.).

- [ ] **Step 3: Confirm booking URL unchanged**

Run: `grep -c 'beds24.com/book-raramalivingstudio' rooms/index.html`
Expected: `1` (one occurrence, in the CTA template within the JS initializer).

- [ ] **Step 4: Final browser check**

Hard reload `http://localhost:3005/rooms`. Walk through both room sections end-to-end (slider, lightbox, hover states, responsive). All checks from Task 3 Step 3 should still pass.

If all four sub-steps pass, the redesign is complete. Push branch with `git push -u origin feat/rooms-page` if ready to ship.