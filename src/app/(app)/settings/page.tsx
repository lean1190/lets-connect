import { ThemeSwitcher } from '@/components/theme-switcher';
import { Card, CardContent } from '@/components/ui/card';
import { getSettings } from '@/lib/settings/get/get';
import { PushNotificationManager } from './components/push-notification-manager';

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <ThemeSwitcher />
        </CardContent>
      </Card>
      <PushNotificationManager settings={settings} />
    </div>
  );
}
