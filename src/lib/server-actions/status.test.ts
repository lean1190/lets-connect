import type { HookActionStatus } from 'next-safe-action/hooks';
import { describe, expect, it } from 'vitest';
import { variabilityTest } from '@/lib/testing/variability';
import { isError, isExecuting } from './status';

describe('server action status utilities', () => {
  describe('isExecuting', () => {
    const testCases = variabilityTest<HookActionStatus, boolean>({
      'should return true for executing status': {
        input: 'executing' as HookActionStatus,
        expected: true
      },
      'should return false for idle status': {
        input: 'idle' as HookActionStatus,
        expected: false
      },
      'should return false for hasSucceeded status': {
        input: 'hasSucceeded' as HookActionStatus,
        expected: false
      },
      'should return false for hasErrored status': {
        input: 'hasErrored' as HookActionStatus,
        expected: false
      }
    });

    it.each(testCases)('$caseName', ({ input, expected }) => {
      expect(isExecuting(input)).toBe(expected);
    });
  });

  describe('isError', () => {
    const testCases = variabilityTest<HookActionStatus, boolean>({
      'should return true for hasErrored status': {
        input: 'hasErrored' as HookActionStatus,
        expected: true
      },
      'should return false for idle status': {
        input: 'idle' as HookActionStatus,
        expected: false
      },
      'should return false for executing status': {
        input: 'executing' as HookActionStatus,
        expected: false
      },
      'should return false for hasSucceeded status': {
        input: 'hasSucceeded' as HookActionStatus,
        expected: false
      }
    });

    it.each(testCases)('$caseName', ({ input, expected }) => {
      expect(isError(input)).toBe(expected);
    });
  });
});
