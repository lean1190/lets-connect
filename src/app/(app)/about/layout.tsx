import PageWithNavigationLayout from '../components/layouts/page-with-navigation-layout';

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <PageWithNavigationLayout title="About">{children}</PageWithNavigationLayout>;
}
