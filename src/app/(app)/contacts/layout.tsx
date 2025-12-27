'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { AppRoute } from '@/lib/constants/navigation';
import { getTitle } from '@/lib/title/get';
import { PageWithBackButtonLayout } from '../components/page-with-back-button-layout';
import { PageWithNavigationLayout } from '../components/page-with-navigation-layout';

const titles: Record<string, string> = {
  [AppRoute.Contacts]: 'Contacts',
  [AppRoute.NewContact]: 'New contact',
  [AppRoute.EditContact]: 'Edit contact'
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const title = useMemo(
    () =>
      getTitle({
        pathname,
        titles,
        partialRoute: AppRoute.EditContact
      }),
    [pathname]
  );

  return pathname === AppRoute.Contacts ? (
    <PageWithNavigationLayout title={title}>{children}</PageWithNavigationLayout>
  ) : (
    <PageWithBackButtonLayout title={title}>{children}</PageWithBackButtonLayout>
  );
}
