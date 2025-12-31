'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

const NEW_YEAR_EASTER_EGG_KEY = 'new-year-easter-egg-dismissed-2026';

export function NewYearEasterEgg() {
  const [isNewYear, setIsNewYear] = useState(false);
  const [bursts, setBursts] = useState<number[]>([]);

  useEffect(() => {
    const now = new Date();
    const isJan1_2026 = now.getFullYear() === 2026 && now.getMonth() === 0 && now.getDate() === 1;
    const hasBeenDismissed = localStorage.getItem(NEW_YEAR_EASTER_EGG_KEY) === 'true';

    if (isJan1_2026 && !hasBeenDismissed) {
      setIsNewYear(true);
      setBursts([Date.now()]); // Initial burst
    }
  }, []);

  useEffect(() => {
    if (!isNewYear) {
      setBursts([]);
      return;
    }

    const interval = setInterval(() => {
      setBursts((prev) => [...prev, Date.now()]);
    }, 1000);

    return () => clearInterval(interval);
  }, [isNewYear]);

  if (!isNewYear) {
    return null;
  }

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'];

  return (
    <>
      {isNewYear && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/20 z-40 pointer-events-none" />
      )}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {bursts.map((burstId) =>
          Array.from({ length: 16 }).map((_, i) => {
            const randomX = (Math.random() - 0.5) * 200; // Horizontal spread
            const duration = 1.5 + Math.random() * 1; // 1.5-2.5s duration
            const startX = 20 + Math.random() * 60; // Start from bottom center area
            const burstDelay = i * 0.05; // Small stagger within burst

            return (
              <div
                key={`${burstId}-${i}`}
                className="confetti-piece"
                style={
                  {
                    left: `${startX}%`,
                    '--random-x': `${randomX}px`,
                    animationDelay: `${burstDelay}s`,
                    animationDuration: `${duration}s`,
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)]
                  } as React.CSSProperties & { '--random-x': string }
                }
              />
            );
          })
        )}
      </div>
      <Dialog
        open={isNewYear}
        onOpenChange={(open) => {
          setIsNewYear(open);
          if (!open) {
            localStorage.setItem(NEW_YEAR_EASTER_EGG_KEY, 'true');
          }
        }}
      >
        <DialogContent
          className="text-center max-w-2xl sm:max-w-3xl px-8 py-8"
          showCloseButton={true}
        >
          <DialogHeader>
            <DialogTitle className="text-5xl sm:text-6xl text-center font-bold bg-linear-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              🎉 Happy New Year! 🎉
            </DialogTitle>
            <DialogDescription className="text-2xl text-white sm:text-3xl mt-6 text-center">
              Wishing you a fantastic 2026 filled with success, growth, and amazing connections!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
