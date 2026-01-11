'use server';

import type { CircleOutput } from '@/lib/circles/types';
import { createDatabaseServerClient } from '@/lib/database/client/server';

export async function getContactById(id: string) {
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
  let circles: CircleOutput[] = [];

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
    ...contact,
    circles
  };
}
