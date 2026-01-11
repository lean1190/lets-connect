'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createPrivilegedClient } from '@/lib/database/client/server';
import type { TablesInsert } from '@/lib/database/types';
import { actionClient } from '@/lib/server-actions/client';

type EventInsert = TablesInsert<'events'>;

const importEventsSchema = z.object({
  events: z.array(
    z.object({
      name: z.string().min(1),
      description: z.string(),
      url: z.url().optional(),
      starts_at: z.string(),
      ends_at: z.string()
    })
  )
});

export const importEvents = actionClient
  .inputSchema(importEventsSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createPrivilegedClient();
    let inserted = 0;
    let skipped = 0;
    const errors: string[] = [];

    console.log('---> events', parsedInput.events);

    for (const event of parsedInput.events) {
      try {
        // Check if event already exists
        const { data: existing } = await supabase
          .from('events')
          .select('id')
          .eq('name', event.name)
          .eq('starts_at', event.starts_at)
          .single();

        if (existing) {
          skipped++;
          continue;
        }

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

    return { inserted, skipped, errors };
  });
