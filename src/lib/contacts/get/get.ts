'use server';

import type { Circle } from '@/lib/circles/types';
import type { Contact } from '@/lib/contacts/types';
import { createDatabaseServerClient } from '@/lib/database/client/server';

export async function getContacts(): Promise<Contact[]> {
  const supabase = await createDatabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !contacts) {
    return [];
  }

  const contactsWithCircles: Contact[] = await Promise.all(
    contacts.map(async (contact) => {
      const { data: contactCircles } = await supabase
        .from('contacts_circles')
        .select('circle_id')
        .eq('contact_id', contact.id)
        .eq('user_id', user.id);

      const circleIds =
        contactCircles?.map((cc) => cc.circle_id).filter((id): id is string => id !== null) || [];
      let circles: Circle[] = [];

      if (circleIds.length > 0) {
        const { data: circleData } = await supabase
          .from('circles')
          .select('id, name, created_at')
          .in('id', circleIds);

        circles =
          circleData?.map((c) => ({
            id: c.id,
            name: c.name,
            createdAt: c.created_at
          })) || [];
      }

      return {
        id: contact.id,
        name: contact.name,
        profileLink: contact.url || '',
        reason: contact.reason || '',
        dateAdded: contact.created_at,
        favorite: contact.favorite,
        circles
      };
    })
  );

  return contactsWithCircles;
}
