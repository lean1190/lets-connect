'use server';

import type { User } from '@supabase/supabase-js';
import webpush from 'web-push';
import { checkAuthenticatedOrThrow } from '@/lib/auth/errors/authentication';
import { getUser } from '@/lib/auth/session/server';
import { isAdmin } from '../settings/get/get';
import { createSubscription } from './database/create';
import { deleteSubscription } from './database/delete';
import type { PushSubscription } from './database/get';
import {
  getAllSubscriptions,
  getSubscriptionsByUserId,
  getUserSubscriptionByEndpoint,
  getUserSubscriptions
} from './database/get';

const defaultTitle = "Let's Connect";

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
  return createSubscription(sub);
}

export async function unsubscribeUser(endpoint: string) {
  return deleteSubscription(endpoint);
}

async function sendToSubscription(
  subscription: PushSubscription,
  message: string,
  title: string = defaultTitle
) {
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
        title,
        body: message,
        icon: '/web-app-manifest-192x192.png'
      })
    );
  } catch (error) {
    console.error(`Error sending notification to ${subscription.endpoint}:`, error);
    throw error;
  }
}

export async function sendNotification(
  message: string,
  options?: {
    title: string;
    endpoint?: string;
    userId?: string;
    toAllUsers?: boolean;
  }
) {
  const user = await getUser();
  checkAuthenticatedOrThrow(user);
  const authenticatedUser = user as User;

  const { title, endpoint, userId, toAllUsers } = options ?? {
    title: defaultTitle
  };

  let subscriptions: PushSubscription[] = [];

  if (toAllUsers) {
    if (!(await isAdmin())) {
      throw new Error('Only admins can send notifications to all users');
    }
    subscriptions = await getAllSubscriptions();
  } else if (userId) {
    if (!(await isAdmin()) && userId !== authenticatedUser.id) {
      throw new Error('You can only send notifications to yourself');
    }
    subscriptions = await getSubscriptionsByUserId(userId);
  } else if (endpoint) {
    const subscription = await getUserSubscriptionByEndpoint(endpoint);
    subscriptions = subscription ? [subscription] : [];
  } else {
    subscriptions = await getUserSubscriptions();
  }

  if (subscriptions.length === 0) {
    throw new Error('No subscriptions available');
  }

  const results = await Promise.allSettled(
    subscriptions.map((subscription) => sendToSubscription(subscription, message, title))
  );

  const failed = results.filter((result) => result.status === 'rejected').length;

  if (failed > 0) {
    console.warn(`Failed to send ${failed} out of ${subscriptions.length} notifications`);
  }

  return {
    sent: subscriptions.length - failed,
    failed,
    total: subscriptions.length
  };
}

export async function sendTestNotification(message: string, title: string = defaultTitle) {
  if (!(await isAdmin())) {
    throw new Error('You are allowed in this realm');
  }

  return sendNotification(message, { title });
}
