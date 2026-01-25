'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  sendTestNotification,
  subscribeUser,
  unsubscribeUser
} from '@/lib/push-notifications/actions';
import { urlBase64ToUint8Array } from '@/lib/push-notifications/utils';
import type { Settings } from '@/lib/settings/types';

type Props = {
  settings: Settings;
};

export function PushNotificationManager({ settings }: Props) {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function registerServiceWorker() {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    }

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '')
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    if (!subscription) {
      return;
    }

    await subscription.unsubscribe();
    await unsubscribeUser(subscription.endpoint);
    setSubscription(null);
  }

  async function testNotification() {
    if (subscription && settings.is_admin) {
      await sendTestNotification(message);
      setMessage('');
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Push notifications are not supported in this browser.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Push notifications</p>
            <p className="text-xs text-muted-foreground mt-1">
              {subscription
                ? 'You are subscribed to push notifications.'
                : 'Subscribe to receive in-phone notifications'}
            </p>
          </div>
          {subscription ? (
            <Button onClick={unsubscribeFromPush} variant="outline">
              Disable
            </Button>
          ) : (
            <Button onClick={subscribeToPush}>Enable</Button>
          )}
        </div>
        {settings.is_admin && subscription ? (
          <div className="space-y-2 mt-8">
            <p>Test notifications</p>
            <Input
              type="text"
              placeholder="Enter notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && message.trim()) {
                  testNotification();
                }
              }}
            />
            <Button onClick={testNotification} disabled={!message.trim()}>
              Send Test Notification
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
