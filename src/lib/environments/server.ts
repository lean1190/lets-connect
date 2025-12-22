export function isServer(): boolean {
  return typeof window === "undefined";
}

export function getHoustonCredentials() {
  const username = process.env.HOUSTON_USERNAME;
  const password = process.env.HOUSTON_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "Houston credentials not configured. Please set HOUSTON_USERNAME and HOUSTON_PASSWORD environment variables.",
    );
  }

  return { username, password };
}
