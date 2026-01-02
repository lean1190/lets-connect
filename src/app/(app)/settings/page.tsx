import Image from 'next/image';
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CtaButton } from '@/components/ui/cta-button';
import { getUser } from '@/lib/auth/session/isomorphic';
import { signOut } from '@/lib/auth/signout';
import { extractLinkedInEmail, extractLinkedInName } from '@/lib/linkedin/user/extract';
import { getSettings } from '@/lib/settings/get/get';

export default async function SettingsPage() {
  const user = await getUser();
  const settings = await getSettings();

  const email = extractLinkedInEmail(user);
  const name = extractLinkedInName(user);
  const profileImageUrl = settings.profile_image_url;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {profileImageUrl ? (
                <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0">
                  <Image
                    src={profileImageUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#0A66C2] flex items-center justify-center shrink-0">
                  <span className="text-white text-xl font-bold">{name[0].toUpperCase()}</span>
                </div>
              )}
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
                start, consider this button 👇
              </p>
              <CtaButton href="http://buymeacoffee.com/leanvilas" className="w-full" size="sm">
                Support the cause 😄
              </CtaButton>
            </div>

            <div className="text-center text-xs text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                Questions?{' '}
                <a
                  href="mailto:me@leanvilas.com"
                  className="text-blue-400 hover:underline dark:text-blue-400"
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

      <div className="text-xs flex justify-center gap-2 items-center">
        <Link href="/terms" className="text-blue-400 hover:underline dark:text-blue-400">
          Terms and Conditions
        </Link>
        <span>•</span>
        <Link href="/privacy" className="text-blue-400 hover:underline dark:text-blue-400">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
