'use client';

import { AppHeader } from './app-header';
import { AppNavigation } from './app-navigation';

type PageWithNavigationLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export function PageWithNavigationLayout({ title, children }: PageWithNavigationLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title={title} />
      <main className="pb-24">{children}</main>
      <AppNavigation />
    </div>
  );
}
