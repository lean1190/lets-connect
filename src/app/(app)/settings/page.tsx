import { ThemeSwitcher } from '@/components/theme-switcher';
import { getSettings } from '@/lib/settings/get/get';
import { PushNotificationManager } from './components/push-notification-manager';

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <ThemeSwitcher />
      <PushNotificationManager settings={settings} />
    </div>
  );
}
