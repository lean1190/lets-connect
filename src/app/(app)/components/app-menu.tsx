'use client';

import { IconMenu2, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { NullableUser } from '@/lib/auth/session/types';
import { signOut } from '@/lib/auth/signout';
import { AppRoute } from '@/lib/constants/navigation';
import { extractLinkedInEmail, extractLinkedInName } from '@/lib/linkedin/user/extract';
import type { Settings } from '@/lib/settings/types';
import { cn } from '@/lib/utils';

type Props = {
  user: NullableUser;
  settings: Settings;
};

export default function AppMenu({ user, settings }: Props) {
  const [open, setOpen] = useState(false);

  const email = extractLinkedInEmail(user);
  const name = extractLinkedInName(user);
  const profileImageUrl = settings.profile_image_url;

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <IconMenu2 size={20} className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </Button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Off-canvas menu */}
      <div
        className={cn(
          'fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background border-r z-50 shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/logo/light.png"
                  alt="Let's Connect Logo"
                  width={32}
                  height={32}
                  className="dark:hidden"
                />
                <Image
                  src="/logo/dark.png"
                  alt="Let's Connect Logo"
                  width={32}
                  height={32}
                  className="hidden dark:block"
                />
              </div>
              <h2 className="text-lg font-semibold">Let&apos;s connect</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <IconX className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-6 flex-1">
            {/* Profile Section */}
            <div className="flex items-center gap-4 pb-4 border-b">
              {profileImageUrl ? (
                <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0">
                  <Image
                    src={profileImageUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#0A66C2] flex items-center justify-center shrink-0">
                  <span className="text-white text-xl font-bold">{name[0].toUpperCase()}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{email}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2">
              <Link
                href={AppRoute.Settings}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors"
              >
                Settings
              </Link>
              <Link
                href={AppRoute.About}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors"
              >
                About
              </Link>
            </div>

            {/* Sign Out */}
            <div className="pt-4 border-t mt-auto">
              <form action={signOut}>
                <Button type="submit" variant="outline" className="w-full">
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
