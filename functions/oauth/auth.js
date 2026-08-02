export async function onRequestGet(context) {
  const { request, env } = context;
  const origin = new URL(request.url).origin;
  if (!env.GITHUB_CLIENT_ID) {
    return new Response('Missing GITHUB_CLIENT_ID environment variable.', { status: 500 });
  }
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', `${origin}/oauth/callback`);
  authUrl.searchParams.set('scope', 'repo,user');
  authUrl.searchParams.set('state', crypto.randomUUID());
  return Response.redirect(authUrl.toString(), 302);
}
