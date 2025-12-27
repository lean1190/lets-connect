import { IconUserPlus } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getContactsInGroup, getGroupById } from '@/lib/server-actions/groups';

export default async function GroupContactsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const [group, contacts] = await Promise.all([getGroupById(id), getContactsInGroup(id)]);

  if (!group) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <p>Group not found</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d');
    } catch {
      return '';
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{group.name}</h1>
      </div>

      {contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <IconUserPlus className="w-16 h-16 text-gray-400 mb-4" stroke={1.5} />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No contacts in this group</h2>
          <p className="text-gray-600">Edit a contact to add them to this group</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="hover:border-white/30 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                  <span className="text-xs text-gray-500">{formatDate(contact.dateAdded)}</span>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-2">{contact.reason}</p>
                {contact.profileLink && (
                  <Link
                    href={contact.profileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0A66C2] font-semibold text-sm hover:underline block mb-4"
                  >
                    View Profile →
                  </Link>
                )}
                <Link href={`/contacts/${contact.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Contact
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
