'use client';

import { usePathname } from 'next/navigation';
import { AppRoute } from '@/lib/constants/navigation';
import { getTitle } from '@/lib/title/get';
import { PageWithNavigationLayout } from '../components/page-with-navigation-layout';

const titles: Record<string, string> = {
  [AppRoute.Contacts]: 'Contacts',
  [AppRoute.NewContact]: 'New contact',
  [AppRoute.EditContact]: 'Edit contact'
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <PageWithNavigationLayout
      title={getTitle({
        pathname,
        titles,
        partialRoute: AppRoute.EditContact,
        defaultTitle: titles[AppRoute.Contacts]
      })}
    >
      {children}
    </PageWithNavigationLayout>
  );
}
