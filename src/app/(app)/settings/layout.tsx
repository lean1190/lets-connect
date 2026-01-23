import PageWithNavigationLayout from '../components/layouts/page-with-navigation-layout';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <PageWithNavigationLayout title="Settings">{children}</PageWithNavigationLayout>;
}
