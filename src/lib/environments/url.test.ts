import { describe, expect, it } from 'vitest';
import { getAppBaseUrl } from './url';

describe('getVercelUrl', () => {
  it('should return the Vercel URL when VERCEL_URL is defined', () => {
    process.env.VERCEL_URL = 'my-app.vercel.app';
    const url = getAppBaseUrl();
    expect(url).toBe('https://my-app.vercel.app');
  });

  it('should return localhost with the specified PORT when VERCEL_URL is not defined', () => {
    delete process.env.VERCEL_URL;
    process.env.PORT = '4000';
    const url = getAppBaseUrl();
    expect(url).toBe('http://localhost:4000');
  });

  it('should return localhost with default port 3000 when VERCEL_URL and PORT are not defined', () => {
    delete process.env.VERCEL_URL;
    delete process.env.PORT;
    const url = getAppBaseUrl();
    expect(url).toBe('http://localhost:3000');
  });
});
