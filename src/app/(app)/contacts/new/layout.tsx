import PageWithBackButtonLayout from '../../components/layouts/page-with-back-button-layout';

export default function NewContactLayout({ children }: { children: React.ReactNode }) {
  return <PageWithBackButtonLayout title="New contact">{children}</PageWithBackButtonLayout>;
}
