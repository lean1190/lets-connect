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

  const today = new Date();
  const currentDay = today.getDay();
  let daysUntilNext = (targetDay - currentDay + 7) % 7;
  if (daysUntilNext === 0) {
    daysUntilNext = 7;
  }

  const nextOccurrence = new Date(today);
  nextOccurrence.setDate(today.getDate() + daysUntilNext);
  nextOccurrence.setHours(0, 0, 0, 0);

  const endDate = new Date(nextOccurrence);
  endDate.setHours(23, 59, 59, 999);

  return {
    starts_at: nextOccurrence.toISOString(),
    ends_at: endDate.toISOString()
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
