// Target the account-root Pages site, including before the repository is renamed.
export function resolveSiteUrl(env = process.env) {
  const url = new URL(env.VITE_SITE_URL || 'https://khatran1012.github.io/');
  if (!['https:', 'http:'].includes(url.protocol) || url.search || url.hash || url.username || url.password) {
    throw new Error('VITE_SITE_URL must be an HTTP(S) URL without a query or fragment.');
  }
  if (url.pathname !== '/') {
    throw new Error("VITE_SITE_URL must target the domain root because Vite base is '/'.");
  }
  return url.href;
}
