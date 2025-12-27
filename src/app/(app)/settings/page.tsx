import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getUser } from '@/lib/auth/session/isomorphic';
import { signOut } from '@/lib/auth/signout';

export default async function SettingsPage() {
  const user = await getUser();

  return (
    <div className="space-y-6">
      <div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0A66C2] flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {user?.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <ThemeSwitcher />
              </div>

              <form action={signOut}>
                <Button variant="outline" className="w-full">
                  Sign out
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
