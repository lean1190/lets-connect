import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getContacts } from "@/lib/server-actions/contacts";
import { DeleteContactButton } from "./delete-contact-button";

export default async function ContactsPage() {
  const contacts = await getContacts();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Unknown date";
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <span className="text-6xl mb-4">👋</span>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No contacts yet
          </h2>
          <p className="text-gray-600 mb-8">
            Scan a LinkedIn QR code to get started
          </p>
          <Link href="/scan">
            <Button className="bg-[#0A66C2]">Start Scanning</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <div className="space-y-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{contact.name}</CardTitle>
                <span className="text-xs text-gray-500">
                  {formatDate(contact.dateAdded)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4 line-clamp-2">
                {contact.reason}
              </p>
              {contact.groups && contact.groups.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {contact.groups.map((group) => (
                    <span
                      key={group.id}
                      className="px-3 py-1 bg-[#E8F4FD] text-[#0A66C2] rounded-full text-xs font-medium"
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
                  className="text-[#0A66C2] font-semibold text-sm hover:underline"
                >
                  View Profile →
                </Link>
              )}
              <div className="mt-4 flex gap-2">
                <Link href={`/contact/${contact.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Edit Contact
                  </Button>
                </Link>
                <DeleteContactButton
                  contactId={contact.id}
                  contactName={contact.name}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
