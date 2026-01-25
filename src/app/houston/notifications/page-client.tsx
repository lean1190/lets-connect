'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendNotification } from '@/lib/push-notifications/actions';

type Props = {
  usersCount: number;
};

type RecipientType = 'all' | 'specific';

export function SendNotificationsPageClient({ usersCount }: Props) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState<RecipientType>('all');
  const [userIds, setUserIds] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);
    setResult(null);

    try {
      if (recipientType === 'all') {
        const result = await sendNotification(message, {
          title: title || "Let's Connect",
          toAllUsers: true
        });
        setResult(result);
      } else {
        const ids = userIds
          .split(',')
          .map((id) => id.trim())
          .filter((id) => id.length > 0);

        if (ids.length === 0) {
          setError('Please enter at least one user ID');
          setIsSending(false);
          return;
        }

        const results = await Promise.allSettled(
          ids.map((userId) =>
            sendNotification(message, {
              title: title || "Let's Connect",
              userId
            })
          )
        );

        const successful = results.filter((r) => r.status === 'fulfilled');
        const failed = results.filter((r) => r.status === 'rejected');

        const totalSent = successful.reduce(
          (sum, r) => sum + (r.status === 'fulfilled' ? r.value.sent : 0),
          0
        );
        const totalFailed = successful.reduce(
          (sum, r) => sum + (r.status === 'fulfilled' ? r.value.failed : 0),
          0
        );

        setResult({
          sent: totalSent,
          failed: totalFailed + failed.length,
          total: totalSent + totalFailed + failed.length
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send notifications');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Send Push Notifications</h1>

      <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow border border-border p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Title
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Let's Connect"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
              Message <span className="text-destructive">*</span>
            </label>
            <Input
              id="message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message"
              required
            />
          </div>

          <div>
            <label
              htmlFor="recipientType"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Recipients{' '}
              <span className="text-xs text-muted-foreground">({usersCount} users available)</span>
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="recipientType"
                    value="all"
                    checked={recipientType === 'all'}
                    onChange={() => setRecipientType('all')}
                    className="w-4 h-4"
                  />
                  <span>All users</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="recipientType"
                    value="specific"
                    checked={recipientType === 'specific'}
                    onChange={() => setRecipientType('specific')}
                    className="w-4 h-4"
                  />
                  <span>Specific users</span>
                </label>
              </div>

              {recipientType === 'specific' && (
                <div>
                  <Input
                    type="text"
                    value={userIds}
                    onChange={(e) => setUserIds(e.target.value)}
                    placeholder="Enter user IDs separated by commas (e.g., id1, id2, id3)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter user IDs separated by commas.
                  </p>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" disabled={isSending || !message.trim()}>
            {isSending ? 'Sending...' : 'Send Notifications'}
          </Button>
        </div>
      </form>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-card rounded-lg shadow border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Results</h2>
          <div className="space-y-2">
            <p className="text-sm text-foreground">
              <span className="font-medium">Total:</span> {result.total} notifications
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              <span className="font-medium">Sent:</span> {result.sent} notifications
            </p>
            {result.failed > 0 && (
              <p className="text-sm text-destructive">
                <span className="font-medium">Failed:</span> {result.failed} notifications
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
