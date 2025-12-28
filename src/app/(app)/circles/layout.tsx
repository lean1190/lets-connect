'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { AppRoute } from '@/lib/constants/navigation';
import { getTitle } from '@/lib/title/get';
import { PageWithBackButtonLayout } from '../components/page-with-back-button-layout';
import { PageWithNavigationLayout } from '../components/page-with-navigation-layout';

const titles: Record<string, string> = {
  [AppRoute.Circles]: 'Circles',
  [AppRoute.NewCircle]: 'New circle',
  [AppRoute.EditCircle]: 'Edit circle'
};

export default function CirclesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const title = useMemo(
    () =>
      getTitle({
        pathname,
        titles,
        partialRoute: AppRoute.EditCircle
      }),
    [pathname]
  );

  return pathname === AppRoute.Circles ? (
    <PageWithNavigationLayout title={title}>{children}</PageWithNavigationLayout>
  ) : (
    <PageWithBackButtonLayout title={title}>{children}</PageWithBackButtonLayout>
  );
}
