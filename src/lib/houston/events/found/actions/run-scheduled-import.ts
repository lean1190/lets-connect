import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { AppRoute } from '@/lib/constants/navigation';
import { createPrivilegedClient } from '@/lib/database/client/server';
import type { TablesInsert } from '@/lib/database/types';
import { fetchEventsFromUrlCore } from '@/lib/houston/events/found/actions/fetch';
import { getLatestArchiveUrl } from '@/lib/houston/events/found/get-latest-url';
import { parseEventDate } from '@/lib/houston/events/parse';

type EventInsert = TablesInsert<'events'>;
type EventImportRow = TablesInsert<'event_imports'>;

type ParsedEvent = {
  name: string;
  description: string;
  url?: string;
  starts_at: string;
  ends_at: string;
};

type DryRunStatus = 'import' | 'skip' | 'invalid';

async function dryRunEvent(
  supabase: Awaited<ReturnType<typeof createPrivilegedClient>>,
  event: ParsedEvent
): Promise<{ status: DryRunStatus; reason?: string }> {
  const urlValidation = z.url().safeParse(event.url);
  if (event.url && !urlValidation.success) {
    return Promise.resolve({ status: 'invalid', reason: 'Invalid URL format' });
  }

  const startsAt = new Date(event.starts_at);
  const endsAt = new Date(event.ends_at);
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
    return Promise.resolve({ status: 'invalid', reason: 'Invalid date format' });
  }
  if (endsAt < startsAt) {
    return Promise.resolve({ status: 'invalid', reason: 'End date is before start date' });
  }

  const { data: existing } = await supabase
    .from('events')
    .select('id')
    .eq('name', event.name)
    .eq('starts_at', event.starts_at)
    .single();

  return existing
    ? { status: 'skip' as const, reason: 'Event already exists with same name and start date' }
    : { status: 'import' as const };
}

export async function runScheduledImport(): Promise<{ ok: boolean; error?: string }> {
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
    await supabase.from('event_imports').insert({
      import_from: 'https://www.foundhamburg.com/',
      imported: [],
      skipped: [],
      errors
    } as EventImportRow);
    return { ok: false, error: message };
  }

  const { data: latestImport } = await supabase
    .from('event_imports')
    .select('import_from, errors')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const sameUrl = latestImport?.import_from === importFrom;
  const hadErrors =
    Array.isArray(latestImport?.errors) && (latestImport?.errors as string[]).length > 0;
  if (sameUrl && !hadErrors) {
    return { ok: true };
  }

  let rawEvents: Awaited<ReturnType<typeof fetchEventsFromUrlCore>>;
  try {
    rawEvents = await fetchEventsFromUrlCore(importFrom);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    errors.push(`Failed to fetch events: ${message}`);
    await supabase.from('event_imports').insert({
      import_from: importFrom,
      imported: [],
      skipped: [],
      errors
    } as EventImportRow);
    return { ok: false, error: message };
  }

  if (rawEvents.length === 0) {
    const message = 'No events found';
    errors.push(message);
    await supabase.from('event_imports').insert({
      import_from: importFrom,
      imported: [],
      skipped: [],
      errors
    } as EventImportRow);
    return { ok: false, error: message };
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

  await supabase.from('event_imports').insert({
    import_from: importFrom,
    imported,
    skipped,
    errors
  } as EventImportRow);

  revalidatePath(AppRoute.HoustonEvents);
  revalidatePath(AppRoute.Events);

  return { ok: true };
}
