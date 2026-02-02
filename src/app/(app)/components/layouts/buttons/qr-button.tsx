import { IconQrcode } from '@tabler/icons-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppRoute } from '@/lib/constants/navigation';

export default function QrButton() {
  return (
    <Link href={AppRoute.MyQr}>
      <Button variant="outline" className="px-4 py-2 text-sm font-semibold">
        <IconQrcode />
      </Button>
    </Link>
  );
}
