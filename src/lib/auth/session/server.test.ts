import type {} from '@supabase/supabase-js';
import { describe, expect, it } from 'vitest';
import { getFakeSupabaseUser } from '@/lib/__mocks__/supabase';
import { createClient } from '@/lib/supabase/server';
import { getServerCurrentUserSession, getServerSession, getServerUser } from './server';

describe('auth/session/server', () => {
  const expectedSession = {
    access_token: 'fake-token',
    provider_token: 'fake-linkedin-token',
    user: getFakeSupabaseUser()
  };

  const expectedUser = getFakeSupabaseUser();

  describe('getServerSession', () => {
    it('should return the session from supabase', async () => {
      (await createClient()).auth.signInWithOAuth({ provider: 'linkedin' });
      const session = await getServerSession();

      expect(session).toEqual(expectedSession);
    });
  });

  describe('getServerUser', () => {
    it('should return the user from supabase', async () => {
      (await createClient()).auth.signInWithOAuth({ provider: 'linkedin' });
      const user = await getServerUser();

      expect(user).toEqual(expectedUser);
    });
  });

  describe('getServerCurrentUserSession', () => {
    it('should return both session and user', async () => {
      (await createClient()).auth.signInWithOAuth({ provider: 'linkedin' });

      const result = await getServerCurrentUserSession();
      expect(result).toEqual({ session: expectedSession, user: expectedUser });
    });
  });
});
