'use client';

import { usePathname } from 'next/navigation';
import { AppRoute } from '@/lib/constants/navigation';
import { getTitle } from '@/lib/title/get';
import { PageWithNavigationLayout } from '../components/page-with-navigation-layout';

const titles: Record<string, string> = {
  [AppRoute.Groups]: 'Groups',
  [AppRoute.NewGroup]: 'New group',
  [AppRoute.EditGroup]: 'Edit group'
};

export default function GroupsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <PageWithNavigationLayout
      title={getTitle({
        pathname,
        titles,
        partialRoute: AppRoute.EditGroup,
        defaultTitle: titles[AppRoute.Groups]
      })}
    >
      {children}
    </PageWithNavigationLayout>
  );
}
