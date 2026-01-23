import { getCircleById } from '@/lib/circles/get/by-id';
import PageWithBackButtonLayout from '../../components/page-with-back-button-layout';
import { EditCirclePageClient } from './page-client';

export default async function EditCirclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const circle = await getCircleById(id);

  return (
    <PageWithBackButtonLayout title="Edit circle">
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
    </PageWithBackButtonLayout>
  );
}
