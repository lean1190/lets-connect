import { IconUser } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
        <div
          key={contact.id}
          className="relative bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden hover:border-white/30 transition-all"
        >
          {/* Liquid glass shine effect */}
          <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent"></div>

          <div className="relative z-10 p-6">
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
            <div className="mt-4 flex gap-2">
              <Link href={`/contacts/${contact.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
