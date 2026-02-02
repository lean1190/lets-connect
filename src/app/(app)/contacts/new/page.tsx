import { getCircles } from '@/lib/circles/get/get';
import PageLayout from '../../components/layouts/page-layout';
import { NewContactPageClient } from './page-client';

export default async function NewContactPage({
  searchParams
}: {
  searchParams: Promise<{ profileLink?: string }>;
}) {
  const { profileLink = '' } = await searchParams;
  const circles = await getCircles({ withCount: false, orderAscending: true });

  return (
    <PageLayout title="New contact" showBackButton>
      <NewContactPageClient profileLink={profileLink} initialCircles={circles} />
    </PageLayout>
  );
}
