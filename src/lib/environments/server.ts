export function isServer(): boolean {
  return typeof window === 'undefined';
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}
