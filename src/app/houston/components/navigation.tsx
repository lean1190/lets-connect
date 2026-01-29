'use client';

import { IconMenu2, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: '/houston', label: 'Dashboard' },
    { href: '/houston/stats', label: 'Stats' },
    { href: '/houston/notifications', label: 'Notifications' }
  ];

  const eventsItems = [
    { href: '/houston/events', label: 'Overview' },
    { href: '/houston/events/import', label: 'Import' }
  ];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const linkClass = (isActive: boolean) =>
    cn(
      'flex px-4 py-3 rounded-md text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
    );

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setMenuOpen(true)}>
        <IconMenu2 size={20} className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </Button>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          'fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background border-r z-50 shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto',
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)}>
              <IconX className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/houston' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={linkClass(!!isActive)}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 mt-2 border-t border-border">
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Events
              </p>
              {eventsItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={linkClass(!!isActive)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="pt-4 mt-2 border-t border-border">
              <Link
                href="/contacts"
                onClick={() => setMenuOpen(false)}
                className={linkClass(pathname?.startsWith('/contacts') ?? false)}
              >
                App
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
