import { ThemeSwitcher } from '@/components/theme-switcher';
import { Card, CardContent } from '@/components/ui/card';

export default async function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <ThemeSwitcher />
        </CardContent>
      </Card>
    </div>
  );
}
