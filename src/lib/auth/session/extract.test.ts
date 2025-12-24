import { describe, expect, it } from 'vitest';
import { extractUserEmail, extractUserId } from './extract';
import type { NullableUser } from './types';

describe('extractUserEmail', () => {
  it('should return the email if present', () => {
    const user: NullableUser = { email: 'test@example.com', id: 'abc' } as NullableUser;
    expect(extractUserEmail(user)).toBe('test@example.com');
  });

  it('should return undefined if user is undefined', () => {
    expect(extractUserEmail(undefined as unknown as NullableUser)).toBeUndefined();
  });

  it('should return undefined if user is null', () => {
    expect(extractUserEmail(null as unknown as NullableUser)).toBeUndefined();
  });

  it('should return undefined if email is missing', () => {
    const user: NullableUser = { id: 'abc' } as NullableUser;
    expect(extractUserEmail(user)).toBeUndefined();
  });
});

describe('extractUserId', () => {
  it('should return the id if present', () => {
    const user: NullableUser = { email: 'test@example.com', id: 'abc' } as NullableUser;
    expect(extractUserId(user)).toBe('abc');
  });

  it('should return undefined if user is undefined', () => {
    expect(extractUserId(undefined as unknown as NullableUser)).toBeUndefined();
  });

  it('should return undefined if user is null', () => {
    expect(extractUserId(null as unknown as NullableUser)).toBeUndefined();
  });

  it('should return undefined if id is missing', () => {
    const user: NullableUser = { email: 'test@example.com' } as NullableUser;
    expect(extractUserId(user)).toBeUndefined();
  });
});
