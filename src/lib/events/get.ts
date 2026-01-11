'use server';

import { createDatabaseServerClient } from '@/lib/database/client/server';
import type { Event } from './types';

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
