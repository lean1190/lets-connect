import type { SupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { AppRoute } from '@/lib/constants/navigation';
import { createPrivilegedClient } from '@/lib/database/client/server';
import { handleDatabaseResponse } from '@/lib/database/handler/response-handler';
import type { Tables, TablesInsert } from '@/lib/database/types';
import { fetchEventsFromUrlCore } from '@/lib/houston/events/found/actions/fetch';
import { getLatestArchiveUrl } from '@/lib/houston/events/found/get-latest-url';
import { parseEventDate } from '@/lib/houston/events/parse';
import { dryRunEvent } from '../dry-run';
import type { ParsedEvent } from '../types';

type EventInsert = TablesInsert<'events'>;
type EventImportInsert = TablesInsert<'event_imports'>;
type EventImportRow = Tables<'event_imports'>;

async function getLatestImport(supabase: SupabaseClient) {
  try {
    return handleDatabaseResponse(
      await supabase
        .from('event_imports')
        .select()
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
    ) as EventImportRow;
  } catch (_) {
    return null;
  }
}

async function insertEventImport(supabase: SupabaseClient, insert: EventImportInsert) {
  return supabase.from('event_imports').insert(insert).select().single();
}

export async function runScheduledImport(): Promise<{
  success: boolean;
  row: EventImportRow;
  alreadyImported?: true;
}> {
  const supabase = await createPrivilegedClient();

  let importFrom = '';
  const imported: { id: string; name: string; date: string }[] = [];
  const skipped: { name: string; date: string }[] = [];
  const errors: string[] = [];

  try {
    importFrom = await getLatestArchiveUrl();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    errors.push(`Failed to get latest URL: ${message}`);

    const eventImport = {
      import_from: 'https://www.foundhamburg.com/',
      imported: [],
      skipped: [],
      errors
    } as EventImportInsert;

    const { data: inserted } = await insertEventImport(supabase, eventImport);
    const row = inserted ?? (await getLatestImport(supabase));
    if (!row) throw new Error('Failed to record import');
    return { success: false, row };
  }

  const latestImport = await getLatestImport(supabase);

  const sameUrl = latestImport?.import_from === importFrom;
  const hadErrors =
    Array.isArray(latestImport?.errors) && (latestImport?.errors as string[]).length > 0;
  if (sameUrl && !hadErrors && latestImport) {
    return { success: true, alreadyImported: true, row: latestImport };
  }

  let rawEvents: Awaited<ReturnType<typeof fetchEventsFromUrlCore>>;
  try {
    rawEvents = await fetchEventsFromUrlCore(importFrom);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    errors.push(`Failed to fetch events: ${message}`);

    const eventImport = {
      import_from: importFrom,
      imported: [],
      skipped: [],
      errors
    } as EventImportInsert;

    const { data: inserted } = await insertEventImport(supabase, eventImport);
    const row = inserted ?? (await getLatestImport(supabase));
    if (!row) throw new Error('Failed to record import');
    return { success: false, row };
  }

  if (rawEvents.length === 0) {
    const message = 'No events found';
    errors.push(message);

    const eventImport = {
      import_from: importFrom,
      imported: [],
      skipped: [],
      errors
    } as EventImportInsert;

    const { data: inserted } = await insertEventImport(supabase, eventImport);
    const row = inserted ?? (await getLatestImport(supabase));
    if (!row) throw new Error('Failed to record import');
    return { success: false, row };
  }

  const baseYear = new Date().getFullYear();
  const parsedEvents: ParsedEvent[] = [];

  for (const raw of rawEvents) {
    try {
      const { starts_at, ends_at } = parseEventDate(raw.dateRange, baseYear);
      parsedEvents.push({
        name: raw.name,
        description: raw.description,
        url: raw.url,
        starts_at,
        ends_at
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`${raw.name} (${raw.dateRange}): ${message}`);
    }
  }

  for (const event of parsedEvents) {
    const { status, reason } = await dryRunEvent(supabase, event);
    const date = event.starts_at;

    if (status === 'skip') {
      skipped.push({ name: event.name, date });
      continue;
    }
    if (status === 'invalid') {
      errors.push(`${event.name} (${date}): ${reason ?? 'Invalid'}`);
      continue;
    }

    try {
      const id = crypto.randomUUID();
      const eventData: EventInsert = {
        id,
        name: event.name,
        url: event.url ?? 'https://www.foundhamburg.com/',
        description: event.description,
        starts_at: event.starts_at,
        ends_at: event.ends_at
      };
      const { error } = await supabase.from('events').insert(eventData);
      if (error) {
        errors.push(`${event.name}: ${error.message}`);
      } else {
        imported.push({ id, name: event.name, date });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`${event.name}: ${message}`);
    }
  }

  const eventImport = {
    import_from: importFrom,
    imported,
    skipped,
    errors
  } as EventImportInsert;

  const { data: row, error } = await insertEventImport(supabase, eventImport);

  revalidatePath(AppRoute.HoustonEvents);
  revalidatePath(AppRoute.Events);

  if (error || !row) throw new Error(error?.message ?? 'Failed to record import');

  return { success: true, row };
}
