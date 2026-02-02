import { getSettings } from '@/lib/settings/get/get';
import PageLayout from '../components/layouts/page-layout';
import { MyQRPageClient } from './page-client';

export default async function MyQRPage() {
  const settings = await getSettings();
  return (
    <PageLayout title="My QR" showBackButton>
      <MyQRPageClient initialQrLink={settings.qr_link} />
    </PageLayout>
  );
}
