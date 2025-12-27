export function getAppBaseUrl() {
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT || 3000}`;
}

export function getBaseUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ?? // Site URL in production env
    process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
    'http://localhost:3000/';

  const startsWithHttp = url.startsWith('http');
  const endsWithSlash = url.endsWith('/');

  return `${startsWithHttp ? url : `https://${url}`}${endsWithSlash ? '' : '/'}`;
}
