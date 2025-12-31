import { getCircles } from '@/lib/circles/get/get';
import { getContactById } from '@/lib/contacts/get/by-id';
import { EditContactForm } from './edit-contact-form';

export default async function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [contact, circles] = await Promise.all([getContactById(id), getCircles()]);

  return <EditContactForm contactId={id} initialContact={contact} initialCircles={circles} />;
}
