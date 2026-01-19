import { startOfToday } from 'date-fns';
import { createPrivilegedClient } from '@/lib/database/client/server';
import type { Tables } from '@/lib/database/types';
import { EventsFilter } from './types';

type Event = Tables<'events'>;

export async function getEvents(filter: EventsFilter = EventsFilter.Upcoming): Promise<Event[]> {
  const supabase = await createPrivilegedClient();
  const todayIso = startOfToday().toISOString();

  let query = supabase.from('events').select('*');

  if (filter === EventsFilter.Upcoming) {
    query = query.gte('starts_at', todayIso).order('starts_at', { ascending: true });
  } else {
    query = query.lt('starts_at', todayIso).order('starts_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return data ?? [];
}
