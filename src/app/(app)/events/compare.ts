import { UTCDate } from '@date-fns/utc';
import { isAfter, isSameDay } from 'date-fns';

export function isUpcomingEvent(dateStr: string): boolean {
  const eventDate = new UTCDate(dateStr);
  const now = new UTCDate();
  const today = new UTCDate(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return isAfter(eventDate, today) || isSameDay(eventDate, today);
}

export function isEventToday(dateStr: string): boolean {
  const eventDate = new UTCDate(dateStr);
  const now = new UTCDate();
  const today = new UTCDate(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return isSameDay(eventDate, today);
}
