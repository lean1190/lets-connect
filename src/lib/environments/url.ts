import { productionUrl } from '../constants/links';
import { isProduction } from './is-dev';

export function getAppBaseUrl() {
  if (isProduction()) {
    return productionUrl;
  }

  return process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : `http://localhost:${process.env.PORT || 3000}`;
}
