'use server';

import webpush from 'web-push';
import { checkAuthenticatedOrThrow } from '@/lib/auth/errors/authentication';
import { getUser } from '@/lib/auth/session/server';
import { isAdmin } from '../settings/get/get';
import { createSubscription } from './database/create';
import { deleteSubscription } from './database/delete';
import type { PushSubscription } from './database/get';
import { getUserSubscriptionByEndpoint, getUserSubscriptions } from './database/get';

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

type PushSubscriptionInput = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export async function subscribeUser(sub: PushSubscriptionInput) {
  await createSubscription(sub);
  return { success: true };
}

export async function unsubscribeUser(endpoint: string) {
  await deleteSubscription(endpoint);
  return { success: true };
}

export async function sendNotification(message: string, endpoint?: string) {
  const user = await getUser();
  checkAuthenticatedOrThrow(user);

  let subscription: PushSubscription | null;

  if (endpoint) {
    subscription = await getUserSubscriptionByEndpoint(endpoint);
  } else {
    const subscriptions = await getUserSubscriptions();
    subscription = subscriptions[0] ?? null;
  }

  if (!subscription) {
    throw new Error('No subscription available');
  }

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth
        }
      },
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

export async function sendTestNotification(message: string) {
  if (!(await isAdmin())) {
    throw new Error('You are allowed in this realm');
  }

  return sendNotification(message);
}
