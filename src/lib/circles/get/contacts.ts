'use server';

import type { Contact } from '@/lib/contacts/types';
import { createDatabaseServerClient } from '@/lib/database/client/server';

export async function getContactsInCircle(circleId: string) {
  const supabase = await createDatabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: contactCircles } = await supabase
    .from('contacts_circles')
    .select('contact_id')
    .eq('circle_id', circleId)
    .eq('user_id', user.id);

  if (!contactCircles || contactCircles.length === 0) {
    return [];
  }

  const contactIds = contactCircles
    .map((cc) => cc.contact_id)
    .filter((id): id is string => id !== null);

  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .in('id', contactIds)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !contacts) {
    return [];
  }

  return contacts.map((contact) => ({
    id: contact.id,
    name: contact.name,
    profileLink: contact.url ?? '',
    reason: contact.reason ?? '',
    dateAdded: contact.created_at
  })) as Contact[];
}
