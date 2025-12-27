import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { productionUrl } from '../constants/links';
import { getAppBaseUrl } from './url';

describe('getAppBaseUrl', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return production URL when NEXT_PUBLIC_VERCEL_ENV is production', () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = 'production';
    delete process.env.NEXT_PUBLIC_VERCEL_URL;
    delete process.env.PORT;
    const url = getAppBaseUrl();
    expect(url).toBe(productionUrl);
  });

  it('should return the Vercel URL when NEXT_PUBLIC_VERCEL_URL is defined and not in production', () => {
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    process.env.NEXT_PUBLIC_VERCEL_URL = 'my-app.vercel.app';
    delete process.env.PORT;
    const url = getAppBaseUrl();
    expect(url).toBe('https://my-app.vercel.app');
  });

  it('should return localhost with the specified PORT when NEXT_PUBLIC_VERCEL_URL is not defined and not in production', () => {
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    delete process.env.NEXT_PUBLIC_VERCEL_URL;
    process.env.PORT = '4000';
    const url = getAppBaseUrl();
    expect(url).toBe('http://localhost:4000');
  });

  it('should return localhost with default port 3000 when NEXT_PUBLIC_VERCEL_URL and PORT are not defined and not in production', () => {
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    delete process.env.NEXT_PUBLIC_VERCEL_URL;
    delete process.env.PORT;
    const url = getAppBaseUrl();
    expect(url).toBe('http://localhost:3000');
  });
});
