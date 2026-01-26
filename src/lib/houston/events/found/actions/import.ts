'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createDatabaseServerClient } from '@/lib/database/client/server';
import type { TablesInsert } from '@/lib/database/types';
import { actionClient } from '@/lib/server-actions/client';

type EventInsert = TablesInsert<'events'>;

const eventSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  url: z.string().optional(),
  starts_at: z.string(),
  ends_at: z.string()
});

const importEventsSchema = z.object({
  events: z.array(eventSchema)
});

export type ImportStatus = 'import' | 'skip' | 'invalid';

export type EventDryRunResult = {
  index: number;
  status: ImportStatus;
  reason?: string;
};

export const dryRunImportEvents = actionClient
  .inputSchema(importEventsSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createDatabaseServerClient();
    const results: EventDryRunResult[] = [];

    for (let i = 0; i < parsedInput.events.length; i++) {
      const event = parsedInput.events[i];

      const urlValidation = z.url().safeParse(event.url);
      if (event.url && !urlValidation.success) {
        results.push({
          index: i,
          status: 'invalid',
          reason: 'Invalid URL format'
        });
        continue;
      }

      const startsAt = new Date(event.starts_at);
      const endsAt = new Date(event.ends_at);
      if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
        results.push({
          index: i,
          status: 'invalid',
          reason: 'Invalid date format'
        });
        continue;
      }

      if (endsAt < startsAt) {
        results.push({
          index: i,
          status: 'invalid',
          reason: 'End date is before start date'
        });
        continue;
      }

      const { data: existing } = await supabase
        .from('events')
        .select('id')
        .eq('name', event.name)
        .eq('starts_at', event.starts_at)
        .single();

      if (existing) {
        results.push({
          index: i,
          status: 'skip',
          reason: 'Event already exists with same name and start date'
        });
        continue;
      }

      results.push({
        index: i,
        status: 'import'
      });
    }

    return { results };
  });

export const importEvents = actionClient
  .inputSchema(importEventsSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createDatabaseServerClient();
    let inserted = 0;
    const errors: string[] = [];

    for (const event of parsedInput.events) {
      try {
        const id = crypto.randomUUID();

        const eventData: EventInsert = {
          id,
          name: event.name,
          url: event.url || 'https://www.foundhamburg.com/',
          description: event.description,
          starts_at: event.starts_at,
          ends_at: event.ends_at
        };

        const { error } = await supabase.from('events').insert(eventData);

        if (error) {
          errors.push(`${event.name}: ${error.message}`);
        } else {
          inserted++;
        }
      } catch (error) {
        errors.push(`${event.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    revalidatePath('/houston/events');

    return { inserted, errors };
  });
