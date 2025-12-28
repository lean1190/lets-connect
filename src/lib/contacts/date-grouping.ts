import type { ContactOutput } from '@/lib/contacts/types';

export type DateFilter = 'all' | 'today' | 'last3days' | 'lastWeek' | 'lastMonth';

export interface ContactGroup {
  label: string;
  contacts: ContactOutput[];
}

export function getDateGroupLabel(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const contactDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffTime = today.getTime() - contactDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  }
  if (diffDays <= 3) {
    return 'Last 3 days';
  }
  if (diffDays <= 7) {
    return 'Last week';
  }
  if (diffDays <= 30) {
    return 'Last month';
  }
  return 'Older';
}

export function groupContactsByDate(contacts: ContactOutput[]): ContactGroup[] {
  const groups: Map<string, ContactOutput[]> = new Map();

  for (const contact of contacts) {
    const date = new Date(contact.dateAdded);
    const label = getDateGroupLabel(date);

    if (!groups.has(label)) {
      groups.set(label, []);
    }
    const groupContacts = groups.get(label);
    if (groupContacts) {
      groupContacts.push(contact);
    }
  }

  // Define order for date groups
  const order = ['Today', 'Last 3 days', 'Last week', 'Last month', 'Older'];

  return order
    .filter((label) => groups.has(label))
    .map((label) => {
      const groupContacts = groups.get(label);
      return {
        label,
        contacts: groupContacts || []
      };
    });
}

export function filterContactsByDate(
  contacts: ContactOutput[],
  filter: DateFilter
): ContactOutput[] {
  if (filter === 'all') {
    return contacts;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return contacts.filter((contact) => {
    const contactDate = new Date(contact.dateAdded);
    const contactDateOnly = new Date(
      contactDate.getFullYear(),
      contactDate.getMonth(),
      contactDate.getDate()
    );
    const diffTime = today.getTime() - contactDateOnly.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    switch (filter) {
      case 'today':
        return diffDays === 0;
      case 'last3days':
        return diffDays <= 3;
      case 'lastWeek':
        return diffDays <= 7;
      case 'lastMonth':
        return diffDays <= 30;
      default:
        return true;
    }
  });
}
