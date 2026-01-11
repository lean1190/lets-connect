import type { Event } from '@/lib/events/types';

export function categorizeEvents(events: Event[]): {
  thisWeek: Event[];
  thisMonth: Event[];
  nextMonth: Event[];
  upcoming: Event[];
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);

  const endOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  endOfThisMonth.setHours(23, 59, 59, 999);

  const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  startOfNextMonth.setHours(0, 0, 0, 0);

  const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
  endOfNextMonth.setHours(23, 59, 59, 999);

  const thisWeek: Event[] = [];
  const thisMonth: Event[] = [];
  const nextMonth: Event[] = [];
  const upcoming: Event[] = [];

  for (const event of events) {
    const eventDate = new Date(event.starts_at);
    eventDate.setHours(0, 0, 0, 0);

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
