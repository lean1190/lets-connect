import { getCircles } from '@/lib/server-actions/circles';
import { getContactById } from '@/lib/server-actions/contacts';
import { EditContactForm } from './edit-contact-form';

export default async function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [contact, circles] = await Promise.all([getContactById(id), getCircles()]);

  return <EditContactForm contactId={id} initialContact={contact} initialCircles={circles} />;
}
