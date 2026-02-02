import { ThemeSwitcher } from '@/components/theme-switcher';
import PageLayout from '../components/layouts/page-layout';
import { PushNotificationManager } from './components/push-notification-manager';

export default async function SettingsPage() {
  return (
    <PageLayout title="Settings">
      <div className="space-y-6">
        <ThemeSwitcher />
        <PushNotificationManager />
      </div>
    </PageLayout>
  );
}
