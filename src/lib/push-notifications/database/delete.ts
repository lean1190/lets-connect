'use server';

import type { User } from '@supabase/supabase-js';
import { checkAuthenticatedOrThrow } from '@/lib/auth/errors/authentication';
import { getUser } from '@/lib/auth/session/server';
import { createDatabaseServerClient } from '@/lib/database/client/server';

export async function deleteSubscription(endpoint: string) {
  const user = await getUser();
  checkAuthenticatedOrThrow(user);
  const authenticatedUser = user as User;

  const supabase = await createDatabaseServerClient();

  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('user_id', authenticatedUser.id)
    .eq('endpoint', endpoint);

  if (error) {
    throw new Error(`Failed to delete subscription: ${error.message}`);
  }

  return { success: true };
}
