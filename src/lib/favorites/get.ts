'use server';

import type { Circle } from '@/lib/circles/types';
import type { Contact } from '@/lib/contacts/types';
import { createDatabaseServerClient } from '@/lib/database/client/server';
import { FavoriteType } from './types';

export type FavoriteContact = Contact & { type: FavoriteType.Contact };
export type FavoriteCircle = Circle & { type: FavoriteType.Circle };
export type FavoriteItem = FavoriteContact | FavoriteCircle;

export type FavoritesData = {
  contacts: FavoriteContact[];
  circles: FavoriteCircle[];
  all: FavoriteItem[];
};

export async function getFavorites(): Promise<FavoritesData> {
  const supabase = await createDatabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { contacts: [], circles: [], all: [] };
  }

  const [contactsResult, circlesResult] = await Promise.all([
    supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .eq('favorite', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('circles')
      .select('*')
      .eq('user_id', user.id)
      .eq('favorite', true)
      .order('created_at', { ascending: false })
  ]);

  const contacts: FavoriteContact[] = (contactsResult.data || []).map((contact) => ({
    ...contact,
    type: FavoriteType.Contact
  }));

  const circlesWithCounts: FavoriteCircle[] = await Promise.all(
    (circlesResult.data || []).map(async (circle) => {
      const { count } = await supabase
        .from('contacts_circles')
        .select('*', { count: 'exact', head: true })
        .eq('circle_id', circle.id)
        .eq('user_id', user.id);

      return {
        ...circle,
        contactCount: count || 0,
        type: FavoriteType.Circle
      };
    })
  );

  const all: FavoriteItem[] = [...contacts, ...circlesWithCounts].sort((a, b) => {
    const dateA = (a as FavoriteContact | FavoriteCircle).created_at;
    const dateB = (b as FavoriteContact | FavoriteCircle).created_at;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return {
    contacts,
    circles: circlesWithCounts,
    all
  };
}
