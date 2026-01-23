import type { ContactOutput } from './types';

export function searchContacts(contacts: ContactOutput[], query: string): ContactOutput[] {
  if (!query.trim()) {
    return contacts;
  }

  const lowerQuery = query.toLowerCase().trim();

  return contacts.filter((contact) => {
    if (contact.name.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    if (contact.reason.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    if (contact.circles?.some((circle) => circle.name.toLowerCase().includes(lowerQuery))) {
      return true;
    }

    return false;
  });
}
