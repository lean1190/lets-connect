import { IconUser } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CtaButton } from '@/components/ui/cta-button';
import { AppRoute } from '@/lib/constants/navigation';
import { getContacts } from '@/lib/server-actions/contacts';

export default async function ContactsPage() {
  const contacts = await getContacts();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

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

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <Card key={contact.id} className="hover:border-white/30 transition-all">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-2xl font-normal text-gray-900 dark:text-foreground mb-1">
                {contact.name}
              </h3>
              <p className="text-gray-600 dark:text-muted-foreground text-sm mb-4">
                {contact.reason}
              </p>
            </div>

            <div className="flex gap-4 mb-6 text-center">
              <div className="flex-1 bg-gray-50 dark:bg-muted rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-muted-foreground mb-1">
                  Connected on
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-foreground">
                  {formatDate(contact.dateAdded)}
                </div>
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-muted rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-muted-foreground mb-1">Groups</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-foreground">
                  In {contact.groups?.length || 0}{' '}
                  {contact.groups?.length === 1 ? 'group' : 'groups'}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href={`${AppRoute.EditContact}${contact.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Edit
                </Button>
              </Link>
              <Link
                href={contact.profileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full">Go to profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
