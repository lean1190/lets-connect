import { getCircles } from '@/lib/circles/get/get';
import { getContactById } from '@/lib/contacts/get/by-id';
import { EditContactPageClient } from './page-client';

export default async function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [contact, circles] = await Promise.all([
    getContactById(id),
    getCircles({ withCount: false, orderAscending: true })
  ]);

  return <EditContactPageClient contactId={id} initialContact={contact} initialCircles={circles} />;
}
