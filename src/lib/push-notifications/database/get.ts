'use server';

import type { User } from '@supabase/supabase-js';
import { checkAuthenticatedOrThrow } from '@/lib/auth/errors/authentication';
import { getUser } from '@/lib/auth/session/server';
import { createDatabaseServerClient } from '@/lib/database/client/server';
import type { Tables } from '@/lib/database/types';

export type PushSubscription = Tables<'push_subscriptions'>;

export async function getUserSubscriptions(): Promise<PushSubscription[]> {
  const user = await getUser();
  checkAuthenticatedOrThrow(user);
  const authenticatedUser = user as User;

  const supabase = await createDatabaseServerClient();

  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', authenticatedUser.id);

  if (error) {
    throw new Error(`Failed to get subscriptions: ${error.message}`);
  }

  return data ?? [];
}

export async function getUserSubscriptionByEndpoint(
  endpoint: string
): Promise<PushSubscription | null> {
  const user = await getUser();
  checkAuthenticatedOrThrow(user);
  const authenticatedUser = user as User;

  const supabase = await createDatabaseServerClient();

  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', authenticatedUser.id)
    .eq('endpoint', endpoint)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get subscription: ${error.message}`);
  }

  return data;
}
