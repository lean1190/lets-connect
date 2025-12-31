import { getSettings } from '@/lib/settings/get/get';
import { MyQRPageClient } from './page-client';

export default async function MyQRPage() {
  const settings = await getSettings();
  return <MyQRPageClient initialQrLink={settings.qrLink} />;
}
