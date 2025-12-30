import { getSettings } from '@/lib/server-actions/settings';
import { MyQRPageClient } from './my-qr-page-client';

export default async function MyQRPage() {
  const settings = await getSettings();
  return <MyQRPageClient initialQrLink={settings.qrLink} />;
}
