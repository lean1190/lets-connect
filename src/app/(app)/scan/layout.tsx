'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="secondary"
          onClick={() => router.back()}
          className="bg-white/90 hover:bg-white"
        >
          ← Back
        </Button>
      </div>
      {children}
    </div>
  );
}
