'use client';

import { IconHandClick, IconShare2, IconSquarePlus, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if running on iOS
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // Check if app is already installed (standalone mode)
    const standalone =
      ('standalone' in window.navigator &&
        (window.navigator as { standalone?: boolean }).standalone === true) ||
      window.matchMedia('(display-mode: standalone)').matches;

    setIsIOS(iOS);
    setIsStandalone(standalone);

    // Only show prompt on iOS if not already installed
    if (iOS && !standalone) {
      // Check if user has dismissed the prompt before
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt || !isIOS || isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-foreground">
            Install Let&apos;s Connect
          </h3>
          <button
            type="button"
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Dismiss"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-600 dark:text-muted-foreground mb-3">
          You'll get a much better experience.
        </p>
        <ol className="text-xs text-gray-600 dark:text-muted-foreground space-y-1 mb-3">
          <li className="flex items-center gap-1">
            <IconShare2 aria-hidden="true" size={20} className="text-blue-500 mb-1" />
            1. Tap the Share button
          </li>
          <li className="flex items-center gap-1">
            <IconSquarePlus aria-hidden="true" size={20} className="text-blue-500 mb-1" />
            2. Scroll down and tap &quot;Add to Home Screen&quot;
          </li>
          <li className="flex items-center gap-1">
            <IconHandClick aria-hidden="true" size={20} className="text-blue-500 mb-1" />
            3. Tap &quot;Add&quot; to confirm
          </li>
        </ol>
        <Button onClick={handleDismiss} variant="outline" size="sm" className="w-full">
          Got it
        </Button>
      </div>
    </div>
  );
}
