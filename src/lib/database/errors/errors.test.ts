import { describe, expect, it } from 'vitest';
import { variabilityTest } from '@/lib/testing/variability';
import { isDuplicatedConstraintError } from './errors';

describe('isDuplicatedConstraintError', () => {
  const testCases = variabilityTest<unknown, boolean>({
    'should return true for PostgreSQL duplicate constraint error': {
      input: { code: '23505' },
      expected: true
    },
    'should return false for other error codes': {
      input: { code: '23506' },
      expected: false
    },
    'should return false for errors without code property': {
      input: { message: 'Some other error' },
      expected: false
    },
    'should return false for null errors': {
      input: null,
      expected: false
    },
    'should return false for undefined errors': {
      input: undefined,
      expected: false
    },
    'should return false for string errors': {
      input: 'String error message',
      expected: false
    },
    'should return false for number values': {
      input: 123,
      expected: false
    },
    'should return false for boolean values': {
      input: true,
      expected: false
    }
  });

  it.each(testCases)('$caseName', ({ input, expected }) => {
    expect(isDuplicatedConstraintError(input)).toBe(expected);
  });
});
