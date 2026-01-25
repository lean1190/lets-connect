'use server';

import type { User } from '@supabase/supabase-js';
import webpush from 'web-push';
import { checkAuthenticatedOrThrow } from '@/lib/auth/errors/authentication';
import { getUser } from '@/lib/auth/session/server';
import { getSettings } from '../settings/get/get';

if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.warn(
    'VAPID keys are not set. Push notifications will not work. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables.'
  );
} else {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || '<mailto:your-email@example.com>',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

type PushSubscription = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

const subscriptions = new Map<string, PushSubscription>();

export async function subscribeUser(sub: PushSubscription) {
  const user = await getUser();
  checkAuthenticatedOrThrow(user);
  const authenticatedUser = user as User;

  subscriptions.set(authenticatedUser.id, sub);

  return { success: true };
}

export async function unsubscribeUser() {
  const user = await getUser();
  checkAuthenticatedOrThrow(user);
  const authenticatedUser = user as User;

  subscriptions.delete(authenticatedUser.id);

  return { success: true };
}

export async function sendNotification(message: string) {
  const user = await getUser();
  checkAuthenticatedOrThrow(user);
  const authenticatedUser = user as User;

  const settings = await getSettings();

  if (!settings.is_admin) {
    throw new Error('You are allowed in this realm');
  }

  const subscription = subscriptions.get(authenticatedUser.id);

  if (!subscription) {
    throw new Error('No subscription available');
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Let's Connect",
        body: message,
        icon: '/web-app-manifest-192x192.png'
      })
    );
    return { success: true };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}
