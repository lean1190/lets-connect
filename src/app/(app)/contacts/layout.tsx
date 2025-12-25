'use client';

import { usePathname } from 'next/navigation';
import { PageWithNavigationLayout } from '../components/page-with-navigation-layout';

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title =
    pathname === '/contacts'
      ? 'Contacts'
      : pathname.includes('/contacts/')
        ? 'Edit Contact'
        : 'Add Contact';

  return <PageWithNavigationLayout title={title}>{children}</PageWithNavigationLayout>;
}
