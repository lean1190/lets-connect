import { createPrivilegedClient } from '@/lib/database/client/server';
import type { Tables } from '@/lib/database/types';

type Event = Tables<'events'>;

export async function getEvents(): Promise<Event[]> {
  const supabase = await createPrivilegedClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('starts_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return data ?? [];
}
