import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getContactsInGroup, getGroupById } from '@/lib/server-actions/groups';
import { EditGroupButton } from './edit-group-button';

export default async function GroupDetailPage({ params }: { params: { id: string } }) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{group.name}</h1>
        <EditGroupButton groupId={id} groupName={group.name} />
      </div>

      {contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <span className="text-6xl mb-4">📭</span>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No contacts in this group</h2>
          <p className="text-gray-600">Edit a contact to add them to this group</p>
        </div>
      ) : (
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
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
