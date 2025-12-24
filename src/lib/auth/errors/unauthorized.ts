import { extractLinkedInAccessToken } from '@/lib/linkedin/user/extract';
import type { CurrentUserSession } from '../session/types';

export enum AuthenticationErrorType {
  Unauthorized = 'Unauthorized',
  SessionExpired = 'SessionExpired'
}

export class AuthenticationError extends Error {
  type: string;

  constructor(message: string, type: string) {
    super(message);
    this.type = type;
  }

  public get redirectPath() {
    const errorPath = `/?error=${this.type}`;
    const url = new URL(errorPath, 'http://placeholder');

    return {
      errorPath,
      pathname: url.pathname,
      queryParams: new URLSearchParams(url.search)
    };
  }
}

export function checkUnauthorized({
  user,
  session
}: CurrentUserSession): AuthenticationError | null {
  const hasToken = extractLinkedInAccessToken(session);

  if (user && hasToken) {
    return null;
  }

  return new AuthenticationError(
    'User is not properly authenticated',
    !user ? AuthenticationErrorType.Unauthorized : AuthenticationErrorType.SessionExpired
  );
}
