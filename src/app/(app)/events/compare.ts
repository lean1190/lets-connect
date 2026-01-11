import { isAfter, isSameDay, isToday, startOfToday } from 'date-fns';

export function isUpcomingEvent(dateStr: string): boolean {
  const eventDate = new Date(dateStr);
  const today = startOfToday();
  return isAfter(eventDate, today) || isSameDay(eventDate, today);
}

export function isEventToday(dateStr: string): boolean {
  return isToday(new Date(dateStr));
}
