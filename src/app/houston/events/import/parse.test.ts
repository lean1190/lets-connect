import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parseEventDate, parseRecurringEvent } from './parse';

describe('parseRecurringEvent', () => {
  const setTodayUTC = (year: number, month: number, day: number) => {
    vi.setSystemTime(new Date(Date.UTC(year, month, day, 0, 0, 0, 0)));
  };

  beforeEach(() => vi.useFakeTimers());

  describe('successful parsing', () => {
    it('should parse Every Saturday and return next Saturday', () => {
      setTodayUTC(2025, 0, 1);
      const result = parseRecurringEvent('Every Saturday');
      const startDate = new Date(result.starts_at);
      const endDate = new Date(result.ends_at);

      expect(startDate.getUTCDay()).toBe(6);
      expect(startDate.getUTCDate()).toBe(4);
      expect(startDate.getUTCMonth()).toBe(0);
      expect(startDate.getUTCFullYear()).toBe(2025);
      expect(startDate.getUTCHours()).toBe(0);
      expect(startDate.getUTCMinutes()).toBe(0);
      expect(startDate.getUTCSeconds()).toBe(0);

      expect(endDate.getUTCDay()).toBe(6);
      expect(endDate.getUTCDate()).toBe(4);
      expect(endDate.getUTCMonth()).toBe(0);
      expect(endDate.getUTCFullYear()).toBe(2025);
      expect(endDate.getUTCHours()).toBe(0);
      expect(endDate.getUTCMinutes()).toBe(0);
      expect(endDate.getUTCSeconds()).toBe(0);
      expect(result.starts_at).toBe(result.ends_at);
    });

    it('should parse Every Sunday and return next Sunday', () => {
      setTodayUTC(2025, 0, 1);
      const result = parseRecurringEvent('Every Sunday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getUTCDay()).toBe(0);
      expect(startDate.getUTCDate()).toBe(5);
    });

    it('should parse Every Monday and return next Monday', () => {
      setTodayUTC(2025, 0, 1);
      const result = parseRecurringEvent('Every Monday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getUTCDay()).toBe(1);
      expect(startDate.getUTCDate()).toBe(6);
    });

    it('should parse Every Tuesday and return next Tuesday', () => {
      setTodayUTC(2025, 0, 1);
      const result = parseRecurringEvent('Every Tuesday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getUTCDay()).toBe(2);
      expect(startDate.getUTCDate()).toBe(7);
    });

    it('should parse Every Wednesday and return next Wednesday', () => {
      setTodayUTC(2025, 0, 1);
      const result = parseRecurringEvent('Every Wednesday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getUTCDay()).toBe(3);
      expect(startDate.getUTCDate()).toBe(8);
    });

    it('should parse Every Thursday and return next Thursday', () => {
      setTodayUTC(2025, 0, 1);
      const result = parseRecurringEvent('Every Thursday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getUTCDay()).toBe(4);
      expect(startDate.getUTCDate()).toBe(2);
    });

    it('should parse Every Friday and return next Friday', () => {
      setTodayUTC(2025, 0, 1);
      const result = parseRecurringEvent('Every Friday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getUTCDay()).toBe(5);
      expect(startDate.getUTCDate()).toBe(3);
    });

    it('should return next week if today is the target day', () => {
      setTodayUTC(2025, 0, 4);
      const result = parseRecurringEvent('Every Saturday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getUTCDay()).toBe(6);
      expect(startDate.getUTCDate()).toBe(11);
    });

    it('should handle case insensitive day names', () => {
      setTodayUTC(2025, 0, 1);
      const result1 = parseRecurringEvent('Every SATURDAY');
      const result2 = parseRecurringEvent('Every saturday');
      const result3 = parseRecurringEvent('Every Saturday');

      expect(result1.starts_at).toBe(result2.starts_at);
      expect(result2.starts_at).toBe(result3.starts_at);
    });

    it('should handle colon after day name', () => {
      setTodayUTC(2025, 0, 1);
      const result = parseRecurringEvent('Every Saturday:');
      const startDate = new Date(result.starts_at);

      expect(startDate.getUTCDay()).toBe(6);
    });
  });

  describe('error handling', () => {
    it('should throw error for invalid pattern', () => {
      expect(() => parseRecurringEvent('Saturday')).toThrow(
        'Invalid recurring event pattern: Saturday'
      );
    });

    it('should throw error for unknown day', () => {
      expect(() => parseRecurringEvent('Every InvalidDay')).toThrow('Unknown day: invalidday');
    });

    it('should throw error for empty string', () => {
      expect(() => parseRecurringEvent('')).toThrow('Invalid recurring event pattern: ');
    });
  });
});

describe('parseEventDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const setTodayUTC = (year: number, month: number, day: number) => {
    vi.setSystemTime(new Date(Date.UTC(year, month, day, 0, 0, 0, 0)));
  };

  describe('recurring events', () => {
    it('should parse recurring event and return next occurrence', () => {
      setTodayUTC(2025, 0, 1);
      const result = parseEventDate('Every Saturday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getUTCDay()).toBe(6);
    });

    it('should handle recurring event with colon', () => {
      setTodayUTC(2025, 0, 1);
      const result = parseEventDate('Every Saturday:');
      const startDate = new Date(result.starts_at);

      expect(startDate.getUTCDay()).toBe(6);
    });
  });

  describe('regular date events', () => {
    it('should parse regular date using parseDateRange', () => {
      const baseYear = 2025;
      const result = parseEventDate('January 15', baseYear);
      const startDate = new Date(result.starts_at);
      const endDate = new Date(result.ends_at);

      expect(startDate.getUTCFullYear()).toBe(baseYear);
      expect(startDate.getUTCMonth()).toBe(0);
      expect(startDate.getUTCDate()).toBe(15);
      expect(startDate.getUTCHours()).toBe(0);

      expect(endDate.getUTCFullYear()).toBe(baseYear);
      expect(endDate.getUTCMonth()).toBe(0);
      expect(endDate.getUTCDate()).toBe(15);
      expect(endDate.getUTCHours()).toBe(0);
      expect(result.starts_at).toBe(result.ends_at);
    });

    it('should parse date range', () => {
      const baseYear = 2025;
      const result = parseEventDate('January 15–20', baseYear);
      const startDate = new Date(result.starts_at);
      const endDate = new Date(result.ends_at);

      expect(startDate.getUTCDate()).toBe(15);
      expect(endDate.getUTCDate()).toBe(20);
      expect(endDate.getUTCHours()).toBe(0);
    });

    it('should use current year as default baseYear', () => {
      const currentYear = new Date().getFullYear();
      const result = parseEventDate('January 15');
      const startDate = new Date(result.starts_at);

      expect(startDate.getUTCFullYear()).toBe(currentYear);
    });
  });

  describe('edge cases', () => {
    it('should prioritize recurring pattern over date pattern', () => {
      setTodayUTC(2025, 0, 1);
      const result = parseEventDate('Every Saturday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getUTCDay()).toBe(6);
    });

    it('should handle case insensitive recurring pattern', () => {
      setTodayUTC(2025, 0, 1);
      const result = parseEventDate('every saturday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getUTCDay()).toBe(6);
    });
  });
});
