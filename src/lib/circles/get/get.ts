'use server';

import { getUser } from '@/lib/auth/session/server';
import type { Circle } from '@/lib/circles/types';
import { createDatabaseServerClient } from '@/lib/database/client/server';

export async function getCircles(): Promise<Circle[]> {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const supabase = await createDatabaseServerClient();

  const { data: circles, error } = await supabase
    .from('circles')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error || !circles) {
    return [];
  }

  const circlesWithCounts: Circle[] = await Promise.all(
    circles.map(async (circle) => {
      const { count } = await supabase
        .from('contacts_circles')
        .select('*', { count: 'exact', head: true })
        .eq('circle_id', circle.id)
        .eq('user_id', user.id);

      return {
        ...circle,
        contactCount: count || 0
      };
    })
  );

  return circlesWithCounts;
}
