import PageLayout from '../../components/layouts/page-layout';
import NewCirclePageClient from './page-client';

export default function NewCirclePage() {
  return (
    <PageLayout title="New circle" showBackButton>
      <NewCirclePageClient />
    </PageLayout>
  );
}
