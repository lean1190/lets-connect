import type { User } from '@supabase/supabase-js';
import { describe, expect, it } from 'vitest';
import { AuthenticationError, AuthenticationErrorType, checkAuthenticated } from './authentication';

describe('checkAuthenticated', () => {
  const mockUser = {
    id: '1',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z'
  } as User;

  it('should return null when user is valid', () => {
    const result = checkAuthenticated(mockUser);
    expect(result).toBeNull();
  });

  it('should return an AuthenticationError with Unauthorized type when user is null', () => {
    const result = checkAuthenticated(null);
    expect(result).toBeInstanceOf(AuthenticationError);
    expect(result?.type).toBe(AuthenticationErrorType.Unauthorized);
  });

  it('should correctly generate the redirectPath for AuthenticationError when type is Unauthorized', () => {
    const error = new AuthenticationError(
      'User is not properly authenticated',
      AuthenticationErrorType.Unauthorized
    );
    const redirectPath = error.redirectPath;
    expect(redirectPath.errorPath).toBe('/?error=Unauthorized');
    expect(redirectPath.pathname).toBe('/');
    expect(redirectPath.queryParams.get('error')).toBe('Unauthorized');
  });

  it('should correctly generate the redirectPath for AuthenticationError when type is SessionExpired', () => {
    const error = new AuthenticationError(
      'User is not properly authenticated',
      AuthenticationErrorType.SessionExpired
    );
    const redirectPath = error.redirectPath;
    expect(redirectPath.errorPath).toBe('/?error=SessionExpired');
    expect(redirectPath.pathname).toBe('/');
    expect(redirectPath.queryParams.get('error')).toBe('SessionExpired');
  });
});
