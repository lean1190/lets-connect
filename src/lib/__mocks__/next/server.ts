import type { NextRequest } from 'next/server';
import { vi } from 'vitest';

vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server');
  return {
    ...actual,
    NextResponse: {
      next: vi.fn((_?: { request?: NextRequest }) => {
        const response = {
          cookies: {
            getAll: vi.fn(() => []),
            set: vi.fn(),
            setAll: vi.fn()
          }
        };
        return response;
      }),
      redirect: vi.fn((url: URL) => ({
        status: 302,
        url: url.toString()
      }))
    }
  };
});

export const createMockRequest = (pathname: string): NextRequest => {
  const url = new URL(`https://example.com${pathname}`);
  return {
    nextUrl: {
      pathname,
      clone: () => {
        const cloned = new URL(url);
        return cloned;
      }
    },
    cookies: {
      getAll: vi.fn(() => []),
      set: vi.fn()
    }
  } as unknown as NextRequest;
};
