'use client';

import { usePathname } from 'next/navigation';
import { AppRoute } from '@/lib/constants/navigation';
import { PageWithNavigationLayout } from '../components/page-with-navigation-layout';

const titles: Record<string, string> = {
  [AppRoute.Contacts]: 'Contacts',
  [AppRoute.NewContact]: 'New contact',
  [AppRoute.EditContact]: 'Edit contact'
};

const getTitle = (pathname: string) => {
  const title = titles[pathname];
  return title
    ? title
    : pathname?.startsWith(AppRoute.EditContact)
      ? AppRoute.EditContact
      : 'Contacts';
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return <PageWithNavigationLayout title={getTitle(pathname)}>{children}</PageWithNavigationLayout>;
}
