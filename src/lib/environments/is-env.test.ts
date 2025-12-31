import { describe, expect, it } from 'vitest';
import { variabilityTest } from '@/lib/testing/variability';
import { isDevEnvironment, isProduction } from './is-env';

describe('isDevEnvironment', () => {
  const testCases = variabilityTest({
    'should return false when NEXT_PUBLIC_VERCEL_ENV is "production"': {
      input: 'production',
      expected: false
    },
    'should return true when NEXT_PUBLIC_VERCEL_ENV is "preview"': {
      input: 'preview',
      expected: true
    },
    'should return true when NEXT_PUBLIC_VERCEL_ENV is "development"': {
      input: 'development',
      expected: true
    },
    'should return true when NEXT_PUBLIC_VERCEL_ENV is undefined': {
      input: undefined,
      expected: true
    },
    'should return true when NEXT_PUBLIC_VERCEL_ENV is an unexpected value': {
      input: 'staging',
      expected: true
    }
  });

  it.each(testCases)('$caseName', ({ input, expected }) => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = input;
    expect(isDevEnvironment()).toBe(expected);
  });
});

describe('isProduction', () => {
  const testCases = variabilityTest({
    'should return true when NEXT_PUBLIC_VERCEL_ENV is "production"': {
      input: 'production',
      expected: true
    },
    'should return false when NEXT_PUBLIC_VERCEL_ENV is "preview"': {
      input: 'preview',
      expected: false
    },
    'should return false when NEXT_PUBLIC_VERCEL_ENV is "development"': {
      input: 'development',
      expected: false
    },
    'should return false when NEXT_PUBLIC_VERCEL_ENV is undefined': {
      input: undefined,
      expected: false
    },
    'should return false when NEXT_PUBLIC_VERCEL_ENV is an unexpected value': {
      input: 'staging',
      expected: false
    }
  });

  it.each(testCases)('$caseName', ({ input, expected }) => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = input;
    expect(isProduction()).toBe(expected);
  });
});
