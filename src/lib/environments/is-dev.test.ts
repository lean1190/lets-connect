import { describe, expect, it } from 'vitest';
import { isDevEnvironment } from './is-dev';

describe('isDevEnvironment', () => {
  it('should return false when NEXT_PUBLIC_VERCEL_ENV is "production"', () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = 'production';
    expect(isDevEnvironment()).toBe(false);
  });

  it('should return true when NEXT_PUBLIC_VERCEL_ENV is "preview"', () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview';
    expect(isDevEnvironment()).toBe(true);
  });

  it('should return true when NEXT_PUBLIC_VERCEL_ENV is "development"', () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = 'development';
    expect(isDevEnvironment()).toBe(true);
  });

  it('should return true when NEXT_PUBLIC_VERCEL_ENV is undefined', () => {
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    expect(isDevEnvironment()).toBe(true);
  });

  it('should return true when NEXT_PUBLIC_VERCEL_ENV is an unexpected value', () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = 'staging';
    expect(isDevEnvironment()).toBe(true);
  });
});
