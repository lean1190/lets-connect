import { ThemeSwitcher } from '@/components/theme-switcher';
import { PushNotificationManager } from './components/push-notification-manager';

export default async function SettingsPage() {
  return (
    <div className="space-y-6">
      <ThemeSwitcher />
      <PushNotificationManager />
    </div>
  );
}
