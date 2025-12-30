'use client';

import { useRouter } from 'next/navigation';
import type QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AppRoute } from '@/lib/constants/navigation';

export default function ScanPage() {
  const router = useRouter();
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initScanner() {
      try {
        const QrScanner = (await import('qr-scanner')).default;
        const videoElement = document.getElementById('qr-reader') as HTMLVideoElement;

        if (!videoElement || !mounted) return;

        const scanner = new QrScanner(
          videoElement,
          (result: { data: string }) => {
            if (scanned || !mounted) return;
            setScanned(true);
            scanner.stop();

            const isLinkedIn =
              result.data.includes('linkedin.com/in/') ||
              result.data.includes('linkedin.com/profile/view');
            const isWhatsApp =
              result.data.includes('wa.me/') ||
              result.data.includes('api.whatsapp.com') ||
              result.data.includes('whatsapp://');

            if (isLinkedIn || isWhatsApp) {
              router.push(`${AppRoute.NewContact}?profileLink=${encodeURIComponent(result.data)}`);
            } else {
              setError(
                "This doesn't appear to be a LinkedIn or WhatsApp QR code. Please try again."
              );
              setScanned(false);
            }
          },
          {
            preferredCamera: 'environment',
            highlightScanRegion: true,
            highlightCodeOutline: true,
            onDecodeError: () => {
              // Ignore scanning errors
            }
          }
        );

        if (!mounted) return;

        await scanner.start();
        scannerRef.current = scanner;
        setHasPermission(true);
      } catch (err) {
        console.error('Error starting scanner:', err);
        if (mounted) {
          setHasPermission(false);
        }
      }
    }

    initScanner();

    return () => {
      mounted = false;
      if (scannerRef.current) {
        Promise.resolve(scannerRef.current.stop()).catch((err: Error) => {
          console.error('Error stopping scanner:', err);
        });
      }
    };
  }, [router, scanned]);

  if (hasPermission === false) {
    return (
      <div className="h-dvh min-h-dvh bg-black flex items-center justify-center p-8">
        <div className="text-center text-white">
          <p className="text-lg mb-4">Camera permission is required to scan QR codes.</p>
          <p className="text-sm text-gray-400 mb-8">
            Please enable camera access in your browser settings and refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <video id="qr-reader" className="h-dvh min-h-dvh w-full min-w-full object-cover">
        <track kind="captions" />
      </video>
      {error && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-4 max-w-sm mx-4 z-30">
          <p className="text-red-600 text-center mb-4">{error}</p>
          <Button
            onClick={async () => {
              setError(null);
              setScanned(false);
              if (scannerRef.current) {
                try {
                  await scannerRef.current.start();
                } catch (err) {
                  console.error('Error resuming scanner:', err);
                }
              }
            }}
            className="w-full"
          >
            Try Again
          </Button>
        </div>
      )}
      {scanned && !error && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30">
          <Button
            onClick={async () => {
              setScanned(false);
              if (scannerRef.current) {
                try {
                  await scannerRef.current.start();
                } catch (err) {
                  console.error('Error resuming scanner:', err);
                }
              }
            }}
            className="bg-[#007AFF]"
          >
            Scan Again
          </Button>
        </div>
      )}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="w-[250px] h-[250px] border-4 border-white rounded-lg">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
        </div>
      </div>
      <p className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-white text-center px-4 z-10">
        Position the QR code within the frame
      </p>
    </div>
  );
}
