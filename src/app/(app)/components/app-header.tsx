'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = {
  title: string;
};

export function AppHeader({ title }: Props) {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold">{title}</h1>
          <div className="flex items-center gap-2">
            <Link href="/my-qr">
              <Button className="bg-[#0A66C2] text-white px-4 py-2 text-sm font-semibold">
                My QR
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
