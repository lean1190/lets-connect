import { Suspense } from 'react';
import { getUser } from '@/lib/auth/session/server';
import { getSettings } from '@/lib/settings/get/get';
import AppMenu from './app-menu';
import BackButton from './layouts/buttons/back-button';
import QrButton from './layouts/buttons/qr-button';
import ScanButton from './layouts/buttons/scan-button';

type Props = {
  title?: string;
  showBackButton?: boolean;
};

export default async function AppHeader({ title, showBackButton = false }: Props) {
  const user = await getUser();
  const settings = await getSettings();

  return (
    <header className="bg-white dark:bg-card border-b dark:border-border sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Suspense fallback={null}>
              {showBackButton ? <BackButton /> : <AppMenu user={user} settings={settings} />}
            </Suspense>
            {title ? <h1 className="text-lg font-medium text-foreground">{title}</h1> : null}
          </div>
          <div className="flex items-center gap-2">
            <QrButton />
            <ScanButton />
          </div>
        </div>
      </div>
    </header>
  );
}
