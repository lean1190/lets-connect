import PageWithNavigationLayout from '../components/layouts/page-with-navigation-layout';

export default async function EventsLayout({ children }: { children: React.ReactNode }) {
  return <PageWithNavigationLayout title="Events">{children}</PageWithNavigationLayout>;
}
