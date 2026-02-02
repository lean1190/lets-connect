import { IconUser } from '@tabler/icons-react';
import Link from 'next/link';
import { CtaButton } from '@/components/ui/cta-button';
import { getContacts } from '@/lib/contacts/get/get';
import { getContactsListMode } from '@/lib/settings/get/get';
import { ContactsList } from '../components/contacts/contacts-list';
import PageLayout from '../components/layouts/page-layout';

export default async function ContactsPage() {
  const [contacts, settings] = await Promise.all([getContacts(), getContactsListMode()]);

  return (
    <PageLayout title="Contacts">
      {contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <IconUser
            className="w-16 h-16 text-gray-400 dark:text-muted-foreground mb-4"
            stroke={1.5}
          />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-2">
            No contacts yet
          </h2>
          <p className="text-gray-600 dark:text-muted-foreground mb-8">
            Scan a QR code to get started
          </p>
          <Link href="/scan">
            <CtaButton size="sm">Scan</CtaButton>
          </Link>
        </div>
      ) : (
        <ContactsList contacts={contacts} initialListMode={settings.contacts_list_mode} />
      )}
    </PageLayout>
  );
}
