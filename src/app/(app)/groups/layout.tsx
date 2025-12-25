'use client';

import { usePathname } from 'next/navigation';
import { PageWithNavigationLayout } from '../components/page-with-navigation-layout';

export default function GroupsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = pathname === '/groups' ? 'Groups' : 'Group';

  return <PageWithNavigationLayout title={title}>{children}</PageWithNavigationLayout>;
}
