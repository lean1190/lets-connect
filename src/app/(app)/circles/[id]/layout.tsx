import PageWithBackButtonLayout from '../../components/page-with-back-button-layout';

export default function EditCircleLayout({ children }: { children: React.ReactNode }) {
  return <PageWithBackButtonLayout title="Edit circle">{children}</PageWithBackButtonLayout>;
}
