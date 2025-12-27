import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getContactById } from '@/lib/server-actions/contacts';
import { DeleteContactButton } from '../components/delete-contact-button';

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const contact = await getContactById(id);

  if (!contact) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <p>Contact not found</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden">
        {/* Liquid glass shine effect */}
        <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent"></div>

        <div className="relative z-10 p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">{contact.name}</h1>
            <span className="text-xs text-gray-500">{formatDate(contact.created_at)}</span>
          </div>
          {contact.reason && <p className="text-gray-700 mb-4">{contact.reason}</p>}
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
          {contact.url && (
            <Link
              href={contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0A66C2] font-semibold text-sm hover:underline block mb-4"
            >
              View Profile →
            </Link>
          )}
          <div className="flex gap-2 mt-4">
            <Link href={`/contacts/${id}/edit`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                Edit
              </Button>
            </Link>
            <DeleteContactButton contactId={id} contactName={contact.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
