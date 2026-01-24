'use server';

import type { Circle } from '@/lib/circles/types';
import type { Contact } from '@/lib/contacts/types';
import { createDatabaseServerClient } from '@/lib/database/client/server';
import { handleDatabaseResponse } from '@/lib/database/handler/response-handler';

export async function getContactById(id: string): Promise<Contact | null> {
  const supabase = await createDatabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: contact, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !contact) {
    return null;
  }

  const { data: contactCircles } = await supabase
    .from('contacts_circles')
    .select('circle_id')
    .eq('contact_id', id)
    .eq('user_id', user.id);

  const circleIds =
    contactCircles?.map((cc) => cc.circle_id).filter((id): id is string => id !== null) || [];

  const circles: Circle[] =
    circleIds.length > 0
      ? (handleDatabaseResponse(await supabase.from('circles').select('*').in('id', circleIds)) ??
        [])
      : [];

  return {
    ...contact,
    circles
  };
}
