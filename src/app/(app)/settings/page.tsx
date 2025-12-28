import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CtaButton } from '@/components/ui/cta-button';
import { getUser } from '@/lib/auth/session/isomorphic';
import { signOut } from '@/lib/auth/signout';

export default async function SettingsPage() {
  const user = await getUser();
  const email = user?.email ?? 'No email?';
  const name = user?.user_metadata?.name ?? 'You';

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0A66C2] flex items-center justify-center">
                <span className="text-white text-xl font-bold">{name[0].toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{email}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <ThemeSwitcher />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-10">
        <CardContent className="pt-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-6">About</h2>

            <div className="space-y-3 mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Let&apos;s connect
              </h3>

              <p className="text-xs text-gray-600 dark:text-gray-400">
                A simple and effective way to stay in touch with your entrepreneurial circle.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mb-6">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                If you are one of those people who want to help a cause and don't know where to
                start, consider this button 😄👇
              </p>
              <CtaButton href="https://paypal.me/leanvilas" className="w-full" size="sm">
                Donate
              </CtaButton>
            </div>

            <div className="text-center text-xs text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                Questions?{' '}
                <a
                  href="mailto:me@leanvilas.com"
                  className="text-[#0A66C2] hover:underline dark:text-blue-400"
                >
                  me@leanvilas.com
                </a>
              </p>
              <p>
                Made with <span className="text-red-500">♥</span> in Hamburg, Germany
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form action={signOut}>
        <Button variant="outline" className="w-full">
          Sign out
        </Button>
      </form>
    </div>
  );
}
