'use server';

import type { Circle } from '@/lib/circles/types';
import { createDatabaseServerClient } from '@/lib/database/client/server';

export async function getCircleById(id: string): Promise<Circle | null> {
  const supabase = await createDatabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: circle, error } = await supabase
    .from('circles')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !circle) {
    return null;
  }

  const { count } = await supabase
    .from('contacts_circles')
    .select('*', { count: 'exact', head: true })
    .eq('circle_id', id)
    .eq('user_id', user.id);

  return {
    ...circle,
    contactCount: count || 0
  };
}
