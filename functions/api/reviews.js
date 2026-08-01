// Cloudflare Pages Function — GET /api/reviews
//
// Mirrors the Express route in server.js: reads data/reviews.json and returns
// { reviews: [...] }. On Cloudflare Pages the JSON is bundled as a static asset,
// so we fetch it from the same deployment via ASSETS. Editing data/reviews.json
// and redeploying updates the reviews with no other code changes — same workflow
// described in the README.
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const empty = () =>
    new Response(JSON.stringify({ reviews: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });

  try {
    // Pull the bundled data file from the static assets of this deployment.
    const assetUrl = new URL('/data/reviews.json', url.origin);
    const res = await env.ASSETS.fetch(new Request(assetUrl, request));
    if (!res.ok) return empty();

    const parsed = await res.json();
    const reviews = Array.isArray(parsed.reviews) ? parsed.reviews : [];
    return new Response(JSON.stringify({ reviews }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (err) {
    // Match the Express handler: never fail hard, just return an empty list.
    return empty();
  }
}
