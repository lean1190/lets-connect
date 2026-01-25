'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function Navigation() {
  const pathname = usePathname();
  const [eventsOpen, setEventsOpen] = useState(false);

  const navItems = [
    { href: '/houston', label: 'Dashboard' },
    { href: '/houston/stats', label: 'Stats' },
    { href: '/houston/notifications', label: 'Notifications' }
  ];

  const eventsItems = [
    { href: '/houston/events', label: 'Overview' },
    { href: '/houston/events/import', label: 'Import' }
  ];

  const isEventsActive = pathname === '/houston/events' || pathname?.startsWith('/houston/events');

  return (
    <nav className="flex space-x-1">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== '/houston' && pathname?.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      <Popover open={eventsOpen} onOpenChange={setEventsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isEventsActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            Events
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-1" align="start">
          <div className="flex flex-col">
            {eventsItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setEventsOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </nav>
  );
}
