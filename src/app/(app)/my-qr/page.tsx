'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const QRCodeSVG = dynamic(() => import('qrcode.react').then((mod) => mod.QRCodeSVG), {
  ssr: false
}) as React.ComponentType<{ value: string; size?: number }>;

const LINKEDIN_URL_KEY = 'my_linkedin_url';

export default function MyQRPage() {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(LINKEDIN_URL_KEY);
    if (saved) {
      setLinkedInUrl(saved);
    }
  }, []);

  const saveLinkedInUrl = () => {
    localStorage.setItem(LINKEDIN_URL_KEY, tempUrl);
    setLinkedInUrl(tempUrl);
    setIsEditing(false);
  };

  const startEditing = () => {
    setTempUrl(linkedInUrl);
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {!linkedInUrl && !isEditing ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <span className="text-6xl mb-5">🔗</span>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Set up your LinkedIn</h2>
            <p className="text-gray-600 mb-8 max-w-md">
              Add your LinkedIn profile URL to generate a QR code others can scan
            </p>
            <Button onClick={startEditing} className="bg-[#0A66C2]">
              Add LinkedIn URL
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
            <Card className="p-8 mb-6">
              <QRCodeSVG value={linkedInUrl} size={200} />
            </Card>
            <p className="text-[#0A66C2] text-sm mb-4 text-center">{linkedInUrl}</p>
            <Button
              variant="outline"
              onClick={startEditing}
              className="border-[#0A66C2] text-[#0A66C2]"
            >
              Change URL
            </Button>
            <p className="text-gray-500 text-sm text-center mt-8 max-w-md">
              Let others scan this QR code to connect with you
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
