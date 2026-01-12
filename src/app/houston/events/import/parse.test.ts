import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parseEventDate, parseRecurringEvent } from './parse';

describe('parseRecurringEvent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const setToday = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    vi.setSystemTime(date);
  };

  describe('successful parsing', () => {
    it('should parse Every Saturday and return next Saturday', () => {
      setToday(2025, 0, 1);
      const result = parseRecurringEvent('Every Saturday');
      const startDate = new Date(result.starts_at);
      const endDate = new Date(result.ends_at);

      expect(startDate.getDay()).toBe(6);
      expect(startDate.getDate()).toBe(4);
      expect(startDate.getMonth()).toBe(0);
      expect(startDate.getFullYear()).toBe(2025);
      expect(startDate.getHours()).toBe(0);
      expect(startDate.getMinutes()).toBe(0);
      expect(startDate.getSeconds()).toBe(0);

      expect(endDate.getDay()).toBe(6);
      expect(endDate.getDate()).toBe(4);
      expect(endDate.getMonth()).toBe(0);
      expect(endDate.getFullYear()).toBe(2025);
      expect(endDate.getHours()).toBe(23);
      expect(endDate.getMinutes()).toBe(59);
      expect(endDate.getSeconds()).toBe(59);
    });

    it('should parse Every Sunday and return next Sunday', () => {
      setToday(2025, 0, 1);
      const result = parseRecurringEvent('Every Sunday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getDay()).toBe(0);
      expect(startDate.getDate()).toBe(5);
    });

    it('should parse Every Monday and return next Monday', () => {
      setToday(2025, 0, 1);
      const result = parseRecurringEvent('Every Monday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getDay()).toBe(1);
      expect(startDate.getDate()).toBe(6);
    });

    it('should parse Every Tuesday and return next Tuesday', () => {
      setToday(2025, 0, 1);
      const result = parseRecurringEvent('Every Tuesday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getDay()).toBe(2);
      expect(startDate.getDate()).toBe(7);
    });

    it('should parse Every Wednesday and return next Wednesday', () => {
      setToday(2025, 0, 1);
      const result = parseRecurringEvent('Every Wednesday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getDay()).toBe(3);
      expect(startDate.getDate()).toBe(8);
    });

    it('should parse Every Thursday and return next Thursday', () => {
      setToday(2025, 0, 1);
      const result = parseRecurringEvent('Every Thursday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getDay()).toBe(4);
      expect(startDate.getDate()).toBe(2);
    });

    it('should parse Every Friday and return next Friday', () => {
      setToday(2025, 0, 1);
      const result = parseRecurringEvent('Every Friday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getDay()).toBe(5);
      expect(startDate.getDate()).toBe(3);
    });

    it('should return next week if today is the target day', () => {
      setToday(2025, 0, 4);
      const result = parseRecurringEvent('Every Saturday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getDay()).toBe(6);
      expect(startDate.getDate()).toBe(11);
    });

    it('should handle case insensitive day names', () => {
      setToday(2025, 0, 1);
      const result1 = parseRecurringEvent('Every SATURDAY');
      const result2 = parseRecurringEvent('Every saturday');
      const result3 = parseRecurringEvent('Every Saturday');

      expect(result1.starts_at).toBe(result2.starts_at);
      expect(result2.starts_at).toBe(result3.starts_at);
    });

    it('should handle colon after day name', () => {
      setToday(2025, 0, 1);
      const result = parseRecurringEvent('Every Saturday:');
      const startDate = new Date(result.starts_at);

      expect(startDate.getDay()).toBe(6);
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

  const setToday = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    vi.setSystemTime(date);
  };

  describe('recurring events', () => {
    it('should parse recurring event and return next occurrence', () => {
      setToday(2025, 0, 1);
      const result = parseEventDate('Every Saturday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getDay()).toBe(6);
    });

    it('should handle recurring event with colon', () => {
      setToday(2025, 0, 1);
      const result = parseEventDate('Every Saturday:');
      const startDate = new Date(result.starts_at);

      expect(startDate.getDay()).toBe(6);
    });
  });

  describe('regular date events', () => {
    it('should parse regular date using parseDateRange', () => {
      const baseYear = 2025;
      const result = parseEventDate('January 15', baseYear);
      const startDate = new Date(result.starts_at);
      const endDate = new Date(result.ends_at);

      expect(startDate.getFullYear()).toBe(baseYear);
      expect(startDate.getMonth()).toBe(0);
      expect(startDate.getDate()).toBe(15);
      expect(startDate.getHours()).toBe(0);

      expect(endDate.getFullYear()).toBe(baseYear);
      expect(endDate.getMonth()).toBe(0);
      expect(endDate.getDate()).toBe(15);
      expect(endDate.getHours()).toBe(23);
    });

    it('should parse date range', () => {
      const baseYear = 2025;
      const result = parseEventDate('January 15–20', baseYear);
      const startDate = new Date(result.starts_at);
      const endDate = new Date(result.ends_at);

      expect(startDate.getDate()).toBe(15);
      expect(endDate.getDate()).toBe(20);
    });

    it('should use current year as default baseYear', () => {
      const currentYear = new Date().getFullYear();
      const result = parseEventDate('January 15');
      const startDate = new Date(result.starts_at);

      expect(startDate.getFullYear()).toBe(currentYear);
    });
  });

  describe('edge cases', () => {
    it('should prioritize recurring pattern over date pattern', () => {
      setToday(2025, 0, 1);
      const result = parseEventDate('Every Saturday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getDay()).toBe(6);
    });

    it('should handle case insensitive recurring pattern', () => {
      setToday(2025, 0, 1);
      const result = parseEventDate('every saturday');
      const startDate = new Date(result.starts_at);

      expect(startDate.getDay()).toBe(6);
    });
  });
});
