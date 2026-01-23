import PageWithBackButtonLayout from '../../../components/page-with-back-button-layout';

export default function CircleContactsLayout({ children }: { children: React.ReactNode }) {
  return <PageWithBackButtonLayout title="Circle people">{children}</PageWithBackButtonLayout>;
}
