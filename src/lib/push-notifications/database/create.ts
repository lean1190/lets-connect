'use server';

import type { User } from '@supabase/supabase-js';
import { checkAuthenticatedOrThrow } from '@/lib/auth/errors/authentication';
import { getUser } from '@/lib/auth/session/server';
import { createDatabaseServerClient } from '@/lib/database/client/server';
import type { TablesInsert } from '@/lib/database/types';

type PushSubscriptionInput = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export async function createSubscription(sub: PushSubscriptionInput) {
  const user = await getUser();
  checkAuthenticatedOrThrow(user);
  const authenticatedUser = user as User;

  const supabase = await createDatabaseServerClient();
  const now = new Date().toISOString();

  const subscriptionData: TablesInsert<'push_subscriptions'> = {
    user_id: authenticatedUser.id,
    endpoint: sub.endpoint,
    p256dh: sub.keys.p256dh,
    auth: sub.keys.auth,
    created_at: now,
    updated_at: now
  };

  const { error } = await supabase.from('push_subscriptions').upsert(subscriptionData, {
    onConflict: 'user_id,endpoint',
    ignoreDuplicates: false
  });

  if (error) {
    throw new Error(`Failed to create subscription: ${error.message}`);
  }

  return { success: true };
}
