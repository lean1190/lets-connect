import { getCircleById } from '@/lib/circles/get/by-id';
import PageLayout from '../../components/layouts/page-layout';
import { EditCirclePageClient } from './page-client';

export default async function EditCirclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const circle = await getCircleById(id);

  return (
    <PageLayout title="Edit circle" showBackButton>
      <EditCirclePageClient
        circleId={id}
        initialCircle={
          circle
            ? {
                name: circle.name,
                color: circle.color || null,
                description: circle.description || null,
                icon: circle.icon || null
              }
            : null
        }
      />
    </PageLayout>
  );
}
