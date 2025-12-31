import type { User } from '@supabase/supabase-js';
import { vi } from 'vitest';

vi.mock('@supabase/ssr', () => ({ createServerClient: vi.fn() }));
vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
vi.mock('@/lib/supabase/client', () => ({
  supabaseClient: vi.fn(),
  createClient: vi.fn()
}));

export const mockSupabaseClient = {
  auth: { getClaims: vi.fn() }
};

export const getSupabaseClientMock = async (mock = mockSupabaseClient) => {
  const { createServerClient } = await import('@supabase/ssr');
  return vi.mocked(createServerClient).mockReturnValue(mock);
};

export const getFakeSupabaseUser = (user?: Partial<User>) => ({
  id: '123',
  email: 'linkedin-user@example.com',
  identities: [{ id: 'fake-linkedin-id' }],
  user_metadata: { picture: 'fake-picture' },
  ...user
});
