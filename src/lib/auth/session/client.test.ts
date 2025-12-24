import { AuthError, type Session, type User } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';
import * as supabaseClientModule from '../../supabase/client';
import { getClientCurrentUserSession, getClientSession, getClientUser } from './client';

type MockSupabaseUserResponse = ReturnType<typeof supabaseClientModule.supabaseClient.auth.getUser>;
type MockSupabaseSessionResponse = ReturnType<
  typeof supabaseClientModule.supabaseClient.auth.getSession
>;

const mockSession: Session = {
  access_token: 'token',
  refresh_token: 'refresh',
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: 'user-id',
    aud: '',
    email: 'test@example.com',
    created_at: '',
    app_metadata: {},
    user_metadata: {},
    identities: [],
    phone: '',
    role: ''
  },
  provider_token: null,
  provider_refresh_token: null,
  expires_at: undefined
};

const mockUser: User = {
  id: 'user-id',
  aud: '',
  email: 'test@example.com',
  created_at: '',
  app_metadata: {},
  user_metadata: {},
  identities: [],
  phone: '',
  role: ''
};

describe('auth session', () => {
  describe('getClientSession', () => {
    it('should return session if supabase returns a session', async () => {
      vi.spyOn(supabaseClientModule.supabaseClient.auth, 'getSession').mockResolvedValue({
        data: { session: mockSession },
        error: null
      });
      const session = await getClientSession();
      expect(session).toEqual(mockSession);
    });

    it('should return null if supabase returns no session', async () => {
      vi.spyOn(supabaseClientModule.supabaseClient.auth, 'getSession').mockResolvedValue({
        data: { session: null },
        error: null
      });
      const session = await getClientSession();
      expect(session).toBeNull();
    });

    it('should return null if supabase returns undefined data', async () => {
      vi.spyOn(supabaseClientModule.supabaseClient.auth, 'getSession').mockImplementation(
        () => ({ data: undefined, error: null }) as unknown as MockSupabaseSessionResponse
      );
      const session = await getClientSession();
      expect(session).toBeNull();
    });
  });

  describe('getClientUser', () => {
    it('should return user if supabase returns a user', async () => {
      vi.spyOn(supabaseClientModule.supabaseClient.auth, 'getUser').mockResolvedValue({
        data: { user: mockUser },
        error: null
      });
      const user = await getClientUser();
      expect(user).toEqual(mockUser);
    });

    it('should return null if supabase returns no user', async () => {
      vi.spyOn(supabaseClientModule.supabaseClient.auth, 'getUser').mockResolvedValue({
        data: { user: null },
        error: new AuthError('User error')
      });
      const user = await getClientUser();
      expect(user).toBeNull();
    });

    it('should return null if supabase returns undefined data', async () => {
      vi.spyOn(supabaseClientModule.supabaseClient.auth, 'getUser').mockImplementation(
        () => ({ data: undefined, error: null }) as unknown as MockSupabaseUserResponse
      );
      const user = await getClientUser();
      expect(user).toBeNull();
    });
  });

  describe('getClientCurrentUserSession', () => {
    it('should return both session and user if supabase returns both', async () => {
      vi.spyOn(supabaseClientModule.supabaseClient.auth, 'getSession').mockResolvedValue({
        data: { session: mockSession },
        error: null
      });
      vi.spyOn(supabaseClientModule.supabaseClient.auth, 'getUser').mockResolvedValue({
        data: { user: mockUser },
        error: null
      });
      const result = await getClientCurrentUserSession();
      expect(result).toEqual({ session: mockSession, user: mockUser });
    });

    it('should return null if supabase returns null data for both session and user', async () => {
      vi.spyOn(supabaseClientModule.supabaseClient.auth, 'getSession').mockResolvedValue({
        data: { session: null },
        error: null
      });
      vi.spyOn(supabaseClientModule.supabaseClient.auth, 'getUser').mockResolvedValue({
        data: { user: null },
        error: new AuthError('User error')
      });
      const result = await getClientCurrentUserSession();
      expect(result).toEqual({ session: null, user: null });
    });
  });
});
