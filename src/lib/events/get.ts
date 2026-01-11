'use server';

import { createDatabaseServerClient } from '@/lib/database/client/server';
import type { Tables } from '@/lib/database/types';

type Event = Tables<'events'>;

export async function getEvents(): Promise<Event[]> {
  const supabase = await createDatabaseServerClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('starts_at', { ascending: true });

  if (error) {
    console.error('Failed to fetch events:', error);
    return [];
  }

  return data ?? [];
}
