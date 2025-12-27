import { IconUser } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { CtaButton } from '@/components/ui/cta-button';
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
        <IconUser className="w-16 h-16 text-gray-400 mb-4" stroke={1.5} />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No contacts yet</h2>
        <p className="text-gray-600 mb-8">Scan a QR code to get started</p>
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
            <Link href={`/contacts/${contact.id}`} className="block">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                <span className="text-xs text-gray-500">{formatDate(contact.dateAdded)}</span>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-2">{contact.reason}</p>
              {contact.groups && contact.groups.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {contact.groups.map((group) => (
                    <span
                      key={group.id}
                      className="px-3 py-1 bg-[#0A66C2]/20 backdrop-blur-sm border border-[#0A66C2]/30 text-[#0A66C2] rounded-full text-xs font-medium"
                    >
                      {group.name}
                    </span>
                  ))}
                </div>
              )}
            </Link>
            {contact.profileLink && (
              <Link
                href={contact.profileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0A66C2] font-semibold text-sm hover:underline mb-4 inline-block"
              >
                View Profile →
              </Link>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
