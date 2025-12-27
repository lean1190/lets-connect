import { PageWithBackButtonLayout } from '../components/page-with-back-button-layout';

export default function MyQrLayout({ children }: { children: React.ReactNode }) {
  return <PageWithBackButtonLayout title="My QR">{children}</PageWithBackButtonLayout>;
}
