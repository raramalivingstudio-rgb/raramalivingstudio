# Deploying Rarama Living Studio to Cloudflare Pages (free)

This site runs on Cloudflare Pages' free plan with no code rewrite. It is a
static site (HTML/CSS/JS + images) plus one tiny dynamic endpoint.

- Home + pages (/, /rooms, /gallery, /kuta-area, /contact) are served
  automatically from the folder structure — Pages does clean URLs natively.
- /api/reviews is handled by functions/api/reviews.js, a Pages Function that
  returns the same JSON as the old Express route (reads data/reviews.json).
- Images, CSS, JS and fonts are served from Pages' CDN, cached via _headers.

server.js and the express dependency are no longer used in production.

## Deploy from the Cloudflare dashboard

1. Push this branch to GitHub.
2. Cloudflare dashboard: Workers & Pages -> Create -> Pages -> Connect to Git.
3. Pick the raramalivingstudio repository and this branch.
4. Build settings:
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: /
5. Save and Deploy. The site goes live at https://<project>.pages.dev

Every push to the connected branch redeploys automatically.

## Remaining step: set your real domain

The page metadata still points at http://localhost:3005 (canonical links,
Open Graph / Twitter URLs, sitemap.xml, robots.txt, JSON-LD). The site renders
fine, but for correct SEO and social sharing these should point at the live URL.
Affected files: index.html, rooms/index.html, gallery/index.html,
kuta-area/index.html, contact/index.html, sitemap.xml, robots.txt.
