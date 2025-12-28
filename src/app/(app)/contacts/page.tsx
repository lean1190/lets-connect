import { IconUser } from '@tabler/icons-react';
import Link from 'next/link';
import { CtaButton } from '@/components/ui/cta-button';
import { getContacts } from '@/lib/server-actions/contacts';
import { ContactsList } from './components/contacts-list';

export default async function ContactsPage() {
  const contacts = await getContacts();

  if (contacts.length === 0) {
    return (
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
    );
  }

  return <ContactsList contacts={contacts} />;
}
