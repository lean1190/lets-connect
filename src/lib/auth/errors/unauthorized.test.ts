import { describe, expect, it } from 'vitest';
import type { CurrentUserSession } from '../session/types';
import { AuthenticationError, AuthenticationErrorType, checkUnauthorized } from './unauthorized';

describe('checkUnauthorized', () => {
  const mockSession = { provider_token: 'valid_token' };
  const mockUser = { id: 1, name: 'Test User' };

  it('should return null when user and token are valid', () => {
    const session: CurrentUserSession = {
      user: mockUser,
      session: mockSession
    } as unknown as CurrentUserSession;
    const result = checkUnauthorized(session);
    expect(result).toBeNull();
  });

  it('should return an AuthenticationError with Unauthorized type when user is missing', () => {
    const session: CurrentUserSession = {
      user: null,
      session: mockSession
    } as unknown as CurrentUserSession;
    const result = checkUnauthorized(session);
    expect(result).toBeInstanceOf(AuthenticationError);
    expect(result?.type).toBe(AuthenticationErrorType.Unauthorized);
  });

  it('should return an AuthenticationError with SessionExpired type when token is missing', () => {
    const session: CurrentUserSession = {
      user: mockUser,
      session: { provider_token: null }
    } as unknown as CurrentUserSession;
    const result = checkUnauthorized(session);
    expect(result).toBeInstanceOf(AuthenticationError);
    expect(result?.type).toBe(AuthenticationErrorType.SessionExpired);
  });

  it('should return an AuthenticationError with Unauthorized type when both user and token are missing', () => {
    const session: CurrentUserSession = {
      user: null,
      session: { provider_token: null }
    } as unknown as CurrentUserSession;
    const result = checkUnauthorized(session);
    expect(result).toBeInstanceOf(AuthenticationError);
    expect(result?.type).toBe(AuthenticationErrorType.Unauthorized);
  });

  it('should return an AuthenticationError with Unauthorized type when user is falsy but token exists', () => {
    const session: CurrentUserSession = {
      user: undefined,
      session: mockSession
    } as unknown as CurrentUserSession;
    const result = checkUnauthorized(session);
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
