import { IconCamera, IconQrcode } from '@tabler/icons-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppRoute } from '@/lib/constants/navigation';

type Props = {
  title: string;
};

export function AppHeader({ title }: Props) {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-lg font-medium">{title}</h1>
          <div className="flex items-center gap-2">
            <Link href={AppRoute.MyQr}>
              <Button variant="outline" className="px-4 py-2 text-sm font-semibold">
                <IconQrcode />
              </Button>
            </Link>
            <Link href={AppRoute.Scan}>
              <Button variant="default" aria-label="Scan QR">
                <IconCamera className="w-5 h-5" />
                Scan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
