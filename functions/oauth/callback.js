export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const provider = 'github';
  if (!code) return new Response('Missing ?code from GitHub.', { status: 400 });
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response('Missing GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET env vars.', { status: 500 });
  }
  let payload;
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'rarama-cms' },
      body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code }),
    });
    const data = await res.json();
    if (data.access_token) { payload = { token: data.access_token, provider }; }
    else { return renderMessage(`authorization:${provider}:error:${JSON.stringify(data)}`); }
  } catch (err) {
    return renderMessage(`authorization:${provider}:error:${JSON.stringify({ error: String(err) })}`);
  }
  return renderMessage(`authorization:${provider}:success:${JSON.stringify(payload)}`);
}
function renderMessage(message) {
  const html = `<!doctype html><html><body>
<script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(${JSON.stringify(message)}, e.origin);
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
<p>Completing sign-in... you can close this window.</p>
</body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
