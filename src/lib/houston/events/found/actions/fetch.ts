'use server';

import { z } from 'zod';
import { parseHtmlToEvents } from '@/lib/houston/events/parse/html-to-events';
import { actionClient } from '@/lib/server-actions/client';
import type { WebsiteEventInput } from '../../types';

export async function fetchEventsFromUrlCore(url: string): Promise<WebsiteEventInput[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }
  const html = await response.text();
  return parseHtmlToEvents(html);
}

const fetchEventsSchema = z.object({
  url: z.url('Invalid URL')
});

export const fetchEventsFromUrl = actionClient
  .inputSchema(fetchEventsSchema)
  .action(async ({ parsedInput }) => {
    const events = await fetchEventsFromUrlCore(parsedInput.url);
    return { events };
  });
