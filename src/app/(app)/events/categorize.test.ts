import { addDays, addMonths, subDays } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Event } from '@/lib/events/types';
import { categorizeEvents } from './categorize';

const FIXED_DATE = new Date('2025-01-15T00:00:00.000Z');

function createEvent(startsAt: Date, name: string): Event {
  const endsAt = new Date(startsAt);
  endsAt.setHours(23, 59, 59, 999);
  return {
    id: crypto.randomUUID(),
    name,
    description: null,
    url: 'https://example.com',
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
    created_at: FIXED_DATE.toISOString()
  };
}

function setupFakeTimers() {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_DATE);
}

function cleanupFakeTimers() {
  vi.useRealTimers();
}

describe('categorizeEvents', () => {
  beforeEach(() => setupFakeTimers());
  afterEach(() => cleanupFakeTimers());

  it('should return empty arrays when no events provided', () => {
    const result = categorizeEvents([]);

    expect(result).toStrictEqual({
      thisWeek: [],
      thisMonth: [],
      nextMonth: [],
      upcoming: []
    });
  });

  it('should filter out past events', () => {
    const pastEvent = createEvent(subDays(FIXED_DATE, 1), 'Past Event');
    const result = categorizeEvents([pastEvent]);

    expect(result).toStrictEqual({
      thisWeek: [],
      thisMonth: [],
      nextMonth: [],
      upcoming: []
    });
  });

  it('should categorize event happening today as thisWeek', () => {
    const event = createEvent(FIXED_DATE, 'Today Event');
    const result = categorizeEvents([event]);

    expect(result).toStrictEqual({
      thisWeek: [event],
      thisMonth: [],
      nextMonth: [],
      upcoming: []
    });
  });

  it('should categorize event within 7 days as thisWeek', () => {
    const event = createEvent(addDays(FIXED_DATE, 3), 'This Week Event');
    const result = categorizeEvents([event]);

    expect(result).toStrictEqual({
      thisWeek: [event],
      thisMonth: [],
      nextMonth: [],
      upcoming: []
    });
  });

  it('should categorize event exactly 7 days from today as thisWeek', () => {
    const event = createEvent(addDays(FIXED_DATE, 7), 'Week Boundary Event');
    const result = categorizeEvents([event]);

    expect(result).toStrictEqual({
      thisWeek: [event],
      thisMonth: [],
      nextMonth: [],
      upcoming: []
    });
  });

  it('should categorize event after this week but within current month as thisMonth', () => {
    const event = createEvent(addDays(FIXED_DATE, 10), 'This Month Event');
    const result = categorizeEvents([event]);

    expect(result).toStrictEqual({
      thisWeek: [],
      thisMonth: [event],
      nextMonth: [],
      upcoming: []
    });
  });

  it('should categorize event on last day of current month as thisMonth', () => {
    const lastDayOfMonth = new Date(FIXED_DATE.getFullYear(), FIXED_DATE.getMonth() + 1, 0);
    lastDayOfMonth.setHours(0, 0, 0, 0);
    const event = createEvent(lastDayOfMonth, 'Last Day Event');
    const result = categorizeEvents([event]);

    expect(result).toStrictEqual({
      thisWeek: [],
      thisMonth: [event],
      nextMonth: [],
      upcoming: []
    });
  });

  it('should categorize event in next month as nextMonth', () => {
    const nextMonthDate = addMonths(FIXED_DATE, 1);
    nextMonthDate.setDate(1);
    const event = createEvent(nextMonthDate, 'Next Month Event');
    const result = categorizeEvents([event]);

    expect(result).toStrictEqual({
      thisWeek: [],
      thisMonth: [],
      nextMonth: [event],
      upcoming: []
    });
  });

  it('should categorize event on last day of next month as nextMonth', () => {
    const lastDayOfNextMonth = new Date(FIXED_DATE.getFullYear(), FIXED_DATE.getMonth() + 2, 0);
    lastDayOfNextMonth.setHours(0, 0, 0, 0);
    const event = createEvent(lastDayOfNextMonth, 'Last Day Next Month Event');
    const result = categorizeEvents([event]);

    expect(result).toStrictEqual({
      thisWeek: [],
      thisMonth: [],
      nextMonth: [event],
      upcoming: []
    });
  });

  it('should categorize event beyond next month as upcoming', () => {
    const futureDate = addMonths(FIXED_DATE, 3);
    const event = createEvent(futureDate, 'Upcoming Event');
    const result = categorizeEvents([event]);

    expect(result).toStrictEqual({
      thisWeek: [],
      thisMonth: [],
      nextMonth: [],
      upcoming: [event]
    });
  });

  it('should sort events within each category by date', () => {
    const event1 = createEvent(addDays(FIXED_DATE, 5), 'Event 1');
    const event2 = createEvent(addDays(FIXED_DATE, 2), 'Event 2');
    const event3 = createEvent(addDays(FIXED_DATE, 1), 'Event 3');
    const result = categorizeEvents([event1, event2, event3]);

    expect(result).toStrictEqual({
      thisWeek: [event3, event2, event1],
      thisMonth: [],
      nextMonth: [],
      upcoming: []
    });
  });

  it('should correctly categorize multiple events across all categories', () => {
    const thisWeekEvent = createEvent(addDays(FIXED_DATE, 3), 'This Week');
    const thisMonthEvent = createEvent(addDays(FIXED_DATE, 10), 'This Month');
    const nextMonthEvent = createEvent(addMonths(FIXED_DATE, 1), 'Next Month');
    const upcomingEvent = createEvent(addMonths(FIXED_DATE, 3), 'Upcoming');
    const pastEvent = createEvent(subDays(FIXED_DATE, 5), 'Past');

    const result = categorizeEvents([
      thisWeekEvent,
      thisMonthEvent,
      nextMonthEvent,
      upcomingEvent,
      pastEvent
    ]);

    expect(result).toStrictEqual({
      thisWeek: [thisWeekEvent],
      thisMonth: [thisMonthEvent],
      nextMonth: [nextMonthEvent],
      upcoming: [upcomingEvent]
    });
  });

  it('should handle events at exact boundary between thisWeek and thisMonth', () => {
    const weekBoundary = addDays(FIXED_DATE, 7);
    const afterWeek = addDays(FIXED_DATE, 8);

    const event1 = createEvent(weekBoundary, 'Week Boundary');
    const event2 = createEvent(afterWeek, 'After Week');

    const result = categorizeEvents([event1, event2]);

    expect(result).toStrictEqual({
      thisWeek: [event1],
      thisMonth: [event2],
      nextMonth: [],
      upcoming: []
    });
  });

  it('should handle events at exact boundary between thisMonth and nextMonth', () => {
    const lastDayOfMonth = new Date(FIXED_DATE.getFullYear(), FIXED_DATE.getMonth() + 1, 0);
    lastDayOfMonth.setHours(0, 0, 0, 0);
    const firstDayOfNextMonth = new Date(FIXED_DATE.getFullYear(), FIXED_DATE.getMonth() + 1, 1);
    firstDayOfNextMonth.setHours(0, 0, 0, 0);

    const event1 = createEvent(lastDayOfMonth, 'Last Day This Month');
    const event2 = createEvent(firstDayOfNextMonth, 'First Day Next Month');

    const result = categorizeEvents([event1, event2]);

    expect(result).toStrictEqual({
      thisWeek: [],
      thisMonth: [event1],
      nextMonth: [event2],
      upcoming: []
    });
  });

  it('should handle events at exact boundary between nextMonth and upcoming', () => {
    const lastDayOfNextMonth = new Date(FIXED_DATE.getFullYear(), FIXED_DATE.getMonth() + 2, 0);
    lastDayOfNextMonth.setHours(0, 0, 0, 0);
    const firstDayAfterNextMonth = new Date(FIXED_DATE.getFullYear(), FIXED_DATE.getMonth() + 2, 1);
    firstDayAfterNextMonth.setHours(0, 0, 0, 0);

    const event1 = createEvent(lastDayOfNextMonth, 'Last Day Next Month');
    const event2 = createEvent(firstDayAfterNextMonth, 'After Next Month');

    const result = categorizeEvents([event1, event2]);

    expect(result).toStrictEqual({
      thisWeek: [],
      thisMonth: [],
      nextMonth: [event1],
      upcoming: [event2]
    });
  });

  it('should maintain event order when multiple events have same date', () => {
    const sameDate = addDays(FIXED_DATE, 3);
    const event1 = createEvent(sameDate, 'Event A');
    const event2 = createEvent(sameDate, 'Event B');
    const event3 = createEvent(sameDate, 'Event C');

    const result = categorizeEvents([event1, event2, event3]);

    expect(result).toStrictEqual({
      thisWeek: [event1, event2, event3],
      thisMonth: [],
      nextMonth: [],
      upcoming: []
    });
  });

  describe('UTC timezone consistency', () => {
    it('should not show event on tomorrow UTC as today when today is previous day', () => {
      const todayUTC = new Date('2026-01-23T12:00:00.000Z');
      vi.setSystemTime(todayUTC);

      const tomorrowEvent = createEvent(new Date('2026-01-24T00:00:00.000Z'), 'Tomorrow Event');
      const result = categorizeEvents([tomorrowEvent]);

      expect(result).toStrictEqual({
        thisWeek: [tomorrowEvent],
        thisMonth: [],
        nextMonth: [],
        upcoming: []
      });
    });

    it('should filter out past events based on UTC date, not local timezone', () => {
      const todayUTC = new Date('2026-01-23T12:00:00.000Z');
      vi.setSystemTime(todayUTC);

      const yesterdayEvent = createEvent(new Date('2026-01-22T23:59:59.000Z'), 'Yesterday Event');
      const result = categorizeEvents([yesterdayEvent]);

      expect(result).toStrictEqual({
        thisWeek: [],
        thisMonth: [],
        nextMonth: [],
        upcoming: []
      });
    });

    it('should correctly categorize event at UTC midnight on today', () => {
      const todayUTC = new Date('2026-01-23T12:00:00.000Z');
      vi.setSystemTime(todayUTC);

      const todayEvent = createEvent(new Date('2026-01-23T00:00:00.000Z'), 'Today Event');
      const result = categorizeEvents([todayEvent]);

      expect(result).toStrictEqual({
        thisWeek: [todayEvent],
        thisMonth: [],
        nextMonth: [],
        upcoming: []
      });
    });

    it('should correctly categorize event at UTC midnight on tomorrow', () => {
      const todayUTC = new Date('2026-01-23T12:00:00.000Z');
      vi.setSystemTime(todayUTC);

      const tomorrowEvent = createEvent(new Date('2026-01-24T00:00:00.000Z'), 'Tomorrow Event');
      const result = categorizeEvents([tomorrowEvent]);

      expect(result).toStrictEqual({
        thisWeek: [tomorrowEvent],
        thisMonth: [],
        nextMonth: [],
        upcoming: []
      });
    });

    it('should handle events consistently regardless of local timezone offset', () => {
      const todayUTC = new Date('2026-01-23T00:00:00.000Z');
      vi.setSystemTime(todayUTC);

      const eventSameDay = createEvent(new Date('2026-01-23T00:00:00.000Z'), 'Same Day');
      const eventNextDay = createEvent(new Date('2026-01-24T00:00:00.000Z'), 'Next Day');
      const eventPreviousDay = createEvent(new Date('2026-01-22T00:00:00.000Z'), 'Previous Day');

      const result = categorizeEvents([eventSameDay, eventNextDay, eventPreviousDay]);

      expect(result).toStrictEqual({
        thisWeek: [eventSameDay, eventNextDay],
        thisMonth: [],
        nextMonth: [],
        upcoming: []
      });
    });

    it('should correctly handle the specific bug scenario: event on 2026-01-24 when today is 2026-01-23', () => {
      const todayUTC = new Date('2026-01-23T12:00:00.000Z');
      vi.setSystemTime(todayUTC);

      const event = {
        id: 'bcc0a444-da77-4079-9cf4-4bedf5923f25',
        name: 'Test Event',
        description: null,
        url: 'https://example.com',
        starts_at: '2026-01-24T00:00:00.000Z',
        ends_at: '2026-01-24T00:00:00.000Z',
        created_at: '2026-01-23T00:00:00.000Z'
      };

      const result = categorizeEvents([event]);

      expect(result).toStrictEqual({
        thisWeek: [event],
        thisMonth: [],
        nextMonth: [],
        upcoming: []
      });
    });
  });
});
