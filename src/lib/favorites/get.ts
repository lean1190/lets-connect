'use server';

import type { CircleOutput } from '@/lib/circles/types';
import type { ContactOutput } from '@/lib/contacts/types';
import { createDatabaseServerClient } from '@/lib/database/client/server';

export type FavoriteContact = ContactOutput & { type: 'contact' };
export type FavoriteCircle = CircleOutput & { type: 'circle' };
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
    id: contact.id,
    name: contact.name,
    profileLink: contact.url || '',
    reason: contact.reason || '',
    dateAdded: contact.created_at,
    favorite: contact.favorite,
    type: 'contact' as const
  }));

  const circlesWithCounts: FavoriteCircle[] = await Promise.all(
    (circlesResult.data || []).map(async (circle) => {
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
        icon: circle.icon || null,
        favorite: circle.favorite ?? true,
        type: 'circle' as const
      };
    })
  );

  const all: FavoriteItem[] = [...contacts, ...circlesWithCounts].sort((a, b) => {
    const dateA = 'dateAdded' in a ? a.dateAdded : a.createdAt;
    const dateB = 'dateAdded' in b ? b.dateAdded : b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return {
    contacts,
    circles: circlesWithCounts,
    all
  };
}
