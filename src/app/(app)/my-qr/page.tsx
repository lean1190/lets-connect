'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSettings, updateSettings } from '@/lib/server-actions/settings';

const QRCodeSVG = dynamic(() => import('qrcode.react').then((mod) => mod.QRCodeSVG), {
  ssr: false
}) as React.ComponentType<{ value: string; size?: number }>;

export default function MyQRPage() {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const { execute: updateSettingsAction, result: updateResult } = useAction(updateSettings);

  useEffect(() => {
    async function loadQrLink() {
      try {
        const settings = await getSettings();
        if (settings.qrLink) {
          setLinkedInUrl(settings.qrLink);
        }
      } catch (error) {
        console.error('Error loading QR link:', error);
      }
    }
    loadQrLink();
  }, []);

  useEffect(() => {
    if (updateResult?.serverError) {
      alert(`Error: ${updateResult.serverError}`);
    } else if (updateResult?.data) {
      setLinkedInUrl(tempUrl);
      setIsEditing(false);
    }
  }, [updateResult, tempUrl]);

  const saveLinkedInUrl = () => {
    updateSettingsAction({ qrLink: tempUrl });
  };

  const startEditing = () => {
    setTempUrl(linkedInUrl);
    setIsEditing(true);
  };

  return (
    <div>
      {!linkedInUrl && !isEditing ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <span className="text-6xl mb-5">🔗</span>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-3">
            Set up your QR code
          </h2>
          <p className="text-gray-600 dark:text-muted-foreground mb-8 max-w-md">
            Add your LinkedIn or Wsp URL
          </p>
          <Button onClick={startEditing} className="bg-[#0A66C2]">
            Add URL
          </Button>
        </div>
      ) : isEditing ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkedinUrl">URL (e.g. LinkedIn or Wsp)</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  className="mt-1"
                  autoFocus
                />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={saveLinkedInUrl} className="flex-1 bg-[#0A66C2]">
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center">
          <Card className="p-6 mb-4">
            <QRCodeSVG value={linkedInUrl} size={200} />
          </Card>
          <p className="text-gray-500 dark:text-muted-foreground text-sm text-center mb-6 max-w-md">
            Let others scan this QR code to connect with you
          </p>
          <Link
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-sm mb-4 text-center"
          >
            {linkedInUrl}
          </Link>
          <Button variant="outline" onClick={startEditing}>
            Change URL
          </Button>
        </div>
      )}
    </div>
  );
}
