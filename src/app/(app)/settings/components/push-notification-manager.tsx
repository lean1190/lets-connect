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
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
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
      <CardHeader>
        <CardTitle>Push Notifications</CardTitle>
        <CardDescription>
          Subscribe to receive push notifications from Let&apos;s Connect
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription ? (
          <>
            <p className="text-sm text-muted-foreground">
              You are subscribed to push notifications.
            </p>
            <div className="flex gap-2">
              <Button onClick={unsubscribeFromPush} variant="outline">
                Unsubscribe
              </Button>
            </div>
            {settings.is_admin ? (
              <div className="space-y-2">
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
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              You are not subscribed to push notifications.
            </p>
            <Button onClick={subscribeToPush}>Subscribe</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
