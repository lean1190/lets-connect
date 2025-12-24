import { isProduction } from './is-dev';

export function getAppBaseUrl() {
  const vercelUrl = `https://${process.env.VERCEL_URL}`;

  return isProduction()
    ? vercelUrl
    : process.env.VERCEL_URL
      ? vercelUrl
      : `http://localhost:${process.env.PORT || 3000}`;
}
