import { IconCamera } from '@tabler/icons-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppRoute } from '@/lib/constants/navigation';

export default function ScanButton() {
  return (
    <Link href={AppRoute.Scan}>
      <Button variant="default" aria-label="Scan QR">
        <IconCamera className="w-5 h-5" />
        Scan
      </Button>
    </Link>
  );
}
