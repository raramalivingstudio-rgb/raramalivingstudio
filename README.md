# Rarama Living Studio

Local website replica (design clone of https://restoransorai.com/), served at `http://localhost:3005`.

## Run it

```bash
cd "/Users/rizmana/Downloads/Rarama Living Studio"
npm install
npm start
```

Then open http://localhost:3005 in your browser.

## Edit it

- **Copy** — edit `index.html` directly. Placeholder regions are flagged with `<!-- placeholder: ... -->` comments.
- **Photos** — drop your images into `assets/img/` and swap the `<img src>` in `index.html`.
- **Reviews** — edit `data/reviews.json` (no rebuild needed; the page fetches it on load).
- **Colors / fonts** — change the CSS variables at the top of `assets/css/style.css`.

## Stack

Node.js + Express (static files + one JSON endpoint), vanilla HTML/CSS/JS, Swiper.js via CDN.
