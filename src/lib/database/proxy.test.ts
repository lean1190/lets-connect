import { NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockRequest } from '@/lib/__mocks__/next/server';
import { getSupabaseClientMock } from '../__mocks__/supabase';
import { AppRoute } from '../constants/navigation';
import { updateSession } from './proxy';

describe('updateSession', () => {
  const mockGetClaims = vi.fn();
  const mockSupabaseClient = {
    auth: {
      getClaims: mockGetClaims
    }
  };

  beforeEach(async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'test-key';

    (await getSupabaseClientMock()).mockReturnValue(mockSupabaseClient);
  });

  it('should return response when user is authenticated', async () => {
    mockGetClaims.mockResolvedValue({
      data: { claims: { sub: 'user-id' } }
    });

    const request = createMockRequest(AppRoute.Contacts);
    const response = await updateSession(request);

    expect(response).toBeDefined();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it('should return response when route is always allowed', async () => {
    mockGetClaims.mockResolvedValue({
      data: { claims: null }
    });

    const request = createMockRequest(AppRoute.Landing);
    const response = await updateSession(request);

    expect(response).toBeDefined();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it('should return response when route is signin', async () => {
    mockGetClaims.mockResolvedValue({
      data: { claims: null }
    });

    const request = createMockRequest(AppRoute.Signin);
    const response = await updateSession(request);

    expect(response).toBeDefined();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it('should return response when route starts with signin', async () => {
    mockGetClaims.mockResolvedValue({
      data: { claims: null }
    });

    const request = createMockRequest(`${AppRoute.Signin}/callback`);
    const response = await updateSession(request);

    expect(response).toBeDefined();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it('should redirect to signin when user is not authenticated and route is protected', async () => {
    mockGetClaims.mockResolvedValue({
      data: { claims: null }
    });

    const request = createMockRequest(AppRoute.Contacts);
    await updateSession(request);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = vi.mocked(NextResponse.redirect).mock.calls[0]?.[0];
    expect((redirectUrl as URL)?.pathname).toBe(AppRoute.Signin);
  });

  it('should handle getClaims returning null data', async () => {
    mockGetClaims.mockResolvedValue({
      data: null
    });

    const request = createMockRequest(AppRoute.Contacts);
    await updateSession(request);

    expect(NextResponse.redirect).toHaveBeenCalled();
  });

  it('should handle getClaims returning undefined data', async () => {
    mockGetClaims.mockResolvedValue({
      data: undefined
    });

    const request = createMockRequest(AppRoute.Contacts);
    await updateSession(request);

    expect(NextResponse.redirect).toHaveBeenCalled();
  });
});
