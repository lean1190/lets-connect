import { UTCDate } from '@date-fns/utc';
import z from 'zod';
import type { createAdminClient } from '@/lib/database/client/server';
import type { ParsedEvent } from './types';

type DryRunStatus = 'import' | 'skip' | 'invalid';

export async function dryRunEvent(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
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

  const now = new Date();
  const todayStartUtc = new UTCDate(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  if (endsAt.getTime() < todayStartUtc.getTime()) {
    return Promise.resolve({ status: 'invalid', reason: 'Event date is in the past' });
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
