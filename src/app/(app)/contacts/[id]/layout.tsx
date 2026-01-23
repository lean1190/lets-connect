import PageWithBackButtonLayout from '../../components/layouts/page-with-back-button-layout';

export default function EditContactLayout({ children }: { children: React.ReactNode }) {
  return <PageWithBackButtonLayout title="Edit contact">{children}</PageWithBackButtonLayout>;
}
