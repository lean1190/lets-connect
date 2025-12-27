import { PageWithNavigationLayout } from '../components/page-with-navigation-layout';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <PageWithNavigationLayout title="Settings">{children}</PageWithNavigationLayout>;
}
