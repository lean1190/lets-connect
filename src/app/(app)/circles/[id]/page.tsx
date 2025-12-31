import { getCircleById } from '@/lib/circles/get/by-id';
import { EditCircleForm } from './edit-circle-form';

export default async function EditCirclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const circle = await getCircleById(id);

  return (
    <EditCircleForm
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
  );
}
