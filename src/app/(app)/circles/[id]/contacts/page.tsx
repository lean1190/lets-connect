import { IconUserPlus } from '@tabler/icons-react';
import { getCircleById } from '@/lib/circles/get/by-id';
import { getContactsInCircle } from '@/lib/circles/get/contacts';
import type { ContactOutput } from '@/lib/contacts/types';
import { ContactsList } from '../../../components/contacts-list';

export default async function CircleContactsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [circle, contacts] = await Promise.all([getCircleById(id), getContactsInCircle(id)]);

  if (!circle) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <p>Circle not found</p>
      </div>
    );
  }

  // Convert the simplified contact objects to ContactOutput format
  const contactOutputs: ContactOutput[] = contacts.map((contact) => ({
    id: contact.id,
    name: contact.name,
    profileLink: contact.profileLink || '',
    reason: contact.reason || '',
    dateAdded: contact.dateAdded,
    circles: [] // Not needed for this view
  }));

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">{circle.name}</h1>
      </div>

      {contactOutputs.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <IconUserPlus
            className="w-16 h-16 text-gray-400 dark:text-muted-foreground mb-4"
            stroke={1.5}
          />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-2">
            No contacts in this circle
          </h2>
          <p className="text-gray-600 dark:text-muted-foreground">
            Edit a contact to add them to this circle
          </p>
        </div>
      ) : (
        <ContactsList contacts={contactOutputs} showCirclesCount={false} />
      )}
    </>
  );
}
