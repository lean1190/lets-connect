'use client';

import { IconSettings, IconUser, IconUsers } from '@tabler/icons-react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { AppRoute } from '@/lib/constants/navigation';

const getNavItemClassName = (isActive: boolean): string =>
  clsx('flex items-center gap-2 px-4 py-2 rounded-full transition-all', {
    'bg-white/20 text-white': isActive,
    'text-white/60 hover:text-white/80': !isActive
  });

type NavItem = {
  route: AppRoute;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

const navItems: NavItem[] = [
  { route: AppRoute.Contacts, icon: IconUser, label: 'Contacts' },
  { route: AppRoute.Groups, icon: IconUsers, label: 'Groups' },
  { route: AppRoute.Settings, icon: IconSettings, label: 'Settings' }
];

export function AppNavigation() {
  const pathname = usePathname();

  const isActivePathname = useCallback(
    (expected: AppRoute) => pathname === expected || pathname?.includes(`${expected}/`),
    [pathname]
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="relative bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl">
          {/* Liquid glass shine effect */}
          <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent rounded-t-2xl"></div>

          <div className="relative z-10 flex justify-around items-center px-4 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePathname(item.route);

              return (
                <Link key={item.route} href={item.route} className={getNavItemClassName(isActive)}>
                  <Icon className="w-5 h-5" />
                  {isActive && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
