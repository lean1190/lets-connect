import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { createAdminClient } from '@/lib/database/client/server';
import { dryRunEvent } from './dry-run';
import type { ParsedEvent } from './types';

function supabaseWithNoMatchingEvent(): Awaited<ReturnType<typeof createAdminClient>> {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null })
          })
        })
      })
    })
  } as unknown as Awaited<ReturnType<typeof createAdminClient>>;
}

describe('dryRunEvent', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date(Date.UTC(2025, 3, 10, 12, 0, 0, 0)) });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns invalid when event end is before today in UTC', async () => {
    const supabase = supabaseWithNoMatchingEvent();
    const event: ParsedEvent = {
      name: 'Past meetup',
      description: 'Desc',
      starts_at: '2025-03-05T00:00:00.000Z',
      ends_at: '2025-03-05T00:00:00.000Z'
    };

    const result = await dryRunEvent(supabase, event);

    expect(result.status).toBe('invalid');
    expect(result.reason).toBe('Event date is in the past');
  });

  it('returns import when event ends today in UTC', async () => {
    const supabase = supabaseWithNoMatchingEvent();
    const event: ParsedEvent = {
      name: 'Today meetup',
      description: 'Desc',
      starts_at: '2025-04-10T00:00:00.000Z',
      ends_at: '2025-04-10T00:00:00.000Z'
    };

    const result = await dryRunEvent(supabase, event);

    expect(result.status).toBe('import');
  });

  it('returns import when event ends after today in UTC', async () => {
    const supabase = supabaseWithNoMatchingEvent();
    const event: ParsedEvent = {
      name: 'Future meetup',
      description: 'Desc',
      starts_at: '2025-04-15T00:00:00.000Z',
      ends_at: '2025-04-15T00:00:00.000Z'
    };

    const result = await dryRunEvent(supabase, event);

    expect(result.status).toBe('import');
  });
});
