import type { User } from '@supabase/supabase-js';
import type { NullableUser } from '../session/types';

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

export function checkAuthenticated(user: NullableUser): AuthenticationError | null {
  if (user) {
    return null;
  }

  return new AuthenticationError(
    'User is not properly authenticated',
    AuthenticationErrorType.Unauthorized
  );
}

export function checkAuthenticatedOrThrow(user: NullableUser): user is User {
  const error = checkAuthenticated(user);
  if (error) throw error;
  return true;
}
