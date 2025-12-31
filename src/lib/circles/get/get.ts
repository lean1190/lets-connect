'use server';

import type { CircleOutput } from '@/lib/circles/types';
import { getSupabaseClient } from '@/lib/database/client/isomorphic';

export async function getCircles(): Promise<CircleOutput[]> {
  const supabase = await getSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: circles, error } = await supabase
    .from('circles')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !circles) {
    return [];
  }

  const circlesWithCounts: CircleOutput[] = await Promise.all(
    circles.map(async (circle) => {
      const { count } = await supabase
        .from('contacts_circles')
        .select('*', { count: 'exact', head: true })
        .eq('circle_id', circle.id)
        .eq('user_id', user.id);

      return {
        id: circle.id,
        name: circle.name,
        createdAt: circle.created_at,
        contactCount: count || 0,
        color: circle.color || null,
        description: circle.description || null,
        icon: circle.icon || null
      };
    })
  );

  return circlesWithCounts;
}
