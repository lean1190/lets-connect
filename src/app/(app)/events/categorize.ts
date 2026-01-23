import { UTCDate } from '@date-fns/utc';
import type { Event } from '@/lib/events/types';

export function categorizeEvents(events: Event[]): {
  thisWeek: Event[];
  thisMonth: Event[];
  nextMonth: Event[];
  upcoming: Event[];
} {
  const now = new UTCDate();
  const today = new UTCDate(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  const endOfWeek = new UTCDate(today);
  endOfWeek.setUTCDate(today.getUTCDate() + 7);

  const endOfThisMonth = new UTCDate(today.getUTCFullYear(), today.getUTCMonth() + 1, 0);
  endOfThisMonth.setUTCHours(23, 59, 59, 999);

  const startOfNextMonth = new UTCDate(today.getUTCFullYear(), today.getUTCMonth() + 1, 1);
  startOfNextMonth.setUTCHours(0, 0, 0, 0);

  const endOfNextMonth = new UTCDate(today.getUTCFullYear(), today.getUTCMonth() + 2, 0);
  endOfNextMonth.setUTCHours(23, 59, 59, 999);

  const thisWeek: Event[] = [];
  const thisMonth: Event[] = [];
  const nextMonth: Event[] = [];
  const upcoming: Event[] = [];

  for (const event of events) {
    const eventDate = new UTCDate(event.starts_at);
    eventDate.setUTCHours(0, 0, 0, 0);

    if (eventDate < today) continue;

    if (eventDate <= endOfWeek) {
      thisWeek.push(event);
    } else if (eventDate <= endOfThisMonth) {
      thisMonth.push(event);
    } else if (eventDate >= startOfNextMonth && eventDate <= endOfNextMonth) {
      nextMonth.push(event);
    } else {
      upcoming.push(event);
    }
  }

  // Sort each category by date
  const sortByDate = (a: Event, b: Event) => {
    return new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime();
  };

  thisWeek.sort(sortByDate);
  thisMonth.sort(sortByDate);
  nextMonth.sort(sortByDate);
  upcoming.sort(sortByDate);

  return { thisWeek, thisMonth, nextMonth, upcoming };
}
