import PageWithBackButtonLayout from '../../components/page-with-back-button-layout';

export default function NewCircleLayout({ children }: { children: React.ReactNode }) {
  return <PageWithBackButtonLayout title="New circle">{children}</PageWithBackButtonLayout>;
}
