import { getSettings } from '@/lib/settings/get/get';
import { MyQRPageClient } from './my-qr-page-client';

export default async function MyQRPage() {
  const settings = await getSettings();
  return <MyQRPageClient initialQrLink={settings.qrLink} />;
}
