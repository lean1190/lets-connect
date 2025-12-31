export function isDevEnvironment() {
  return process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production';
}

export function isProduction() {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
}
