import { addDays } from 'date-fns';
import { parseDateRange } from '@/lib/dates/parse';

export function parseRecurringEvent(dateRange: string): { starts_at: string; ends_at: string } {
  const dayMap: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
  };

  const match = dateRange.match(/^Every\s+([A-Z][a-z]+)/i);
  if (!match) {
    throw new Error(`Invalid recurring event pattern: ${dateRange}`);
  }

  const dayName = match[1]?.toLowerCase() ?? '';
  const targetDay = dayMap[dayName];

  if (targetDay === undefined) {
    throw new Error(`Unknown day: ${dayName}`);
  }

  const now = new Date();
  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)
  );
  const currentDay = todayUTC.getUTCDay();
  let daysUntilNext = (targetDay - currentDay + 7) % 7;
  if (daysUntilNext === 0) {
    daysUntilNext = 7;
  }

  const nextOccurrence = addDays(todayUTC, daysUntilNext);

  return {
    starts_at: nextOccurrence.toISOString(),
    ends_at: nextOccurrence.toISOString()
  };
}

export function parseEventDate(
  dateRange: string,
  baseYear: number = new Date().getFullYear()
): { starts_at: string; ends_at: string } {
  if (/^Every\s+[A-Z][a-z]+/i.test(dateRange)) {
    return parseRecurringEvent(dateRange);
  }
  return parseDateRange(dateRange, baseYear);
}
