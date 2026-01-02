import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { CtaButton } from '@/components/ui/cta-button';

export default function AboutPage() {
  return (
    <div className="space-y-6">
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
