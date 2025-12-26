import { describe, expect, test } from 'vitest';
import { isDuplicatedConstraintError } from './errors';

describe('isDuplicatedConstraintError', () => {
  test('should return true for PostgreSQL duplicate constraint error', () => {
    const error = { code: '23505' };
    expect(isDuplicatedConstraintError(error)).toBe(true);
  });

  test('should return false for other error codes', () => {
    const error = { code: '23506' };
    expect(isDuplicatedConstraintError(error)).toBe(false);
  });

  test('should return false for errors without code property', () => {
    const error = { message: 'Some other error' };
    expect(isDuplicatedConstraintError(error)).toBe(false);
  });

  test('should return false for null/undefined errors', () => {
    expect(isDuplicatedConstraintError(null)).toBe(false);
    expect(isDuplicatedConstraintError(undefined)).toBe(false);
  });

  test('should return false for string errors', () => {
    const error = 'String error message';
    expect(isDuplicatedConstraintError(error)).toBe(false);
  });

  test('should return false for primitive values', () => {
    expect(isDuplicatedConstraintError(123)).toBe(false);
    expect(isDuplicatedConstraintError(true)).toBe(false);
  });
});
