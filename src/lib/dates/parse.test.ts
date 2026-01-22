import { UTCDate } from '@date-fns/utc';
import { describe, expect, it } from 'vitest';
import { parseDateRange } from './parse';

describe('parseDateRange', () => {
  const baseYear = 2025;

  describe('single date (no range)', () => {
    it('should parse a single date and set end date to same as start date', () => {
      const result = parseDateRange('January 15', baseYear);
      const startDate = new UTCDate(result.starts_at);
      const endDate = new UTCDate(result.ends_at);

      expect(startDate.getUTCFullYear()).toBe(baseYear);
      expect(startDate.getUTCMonth()).toBe(0);
      expect(startDate.getUTCDate()).toBe(15);
      expect(startDate.getUTCHours()).toBe(0);
      expect(startDate.getUTCMinutes()).toBe(0);
      expect(startDate.getUTCSeconds()).toBe(0);

      expect(endDate.getUTCFullYear()).toBe(baseYear);
      expect(endDate.getUTCMonth()).toBe(0);
      expect(endDate.getUTCDate()).toBe(15);
      expect(endDate.getUTCHours()).toBe(0);
      expect(endDate.getUTCMinutes()).toBe(0);
      expect(endDate.getUTCSeconds()).toBe(0);
      expect(result.starts_at).toBe(result.ends_at);
    });

    it('should handle case insensitive month names', () => {
      const result1 = parseDateRange('JANUARY 15', baseYear);
      const result2 = parseDateRange('january 15', baseYear);
      const result3 = parseDateRange('January 15', baseYear);

      expect(result1.starts_at).toBe(result2.starts_at);
      expect(result2.starts_at).toBe(result3.starts_at);
    });

    it('should trim whitespace', () => {
      const result = parseDateRange('  January  15  ', baseYear);
      const date = new UTCDate(result.starts_at);

      expect(date.getUTCMonth()).toBe(0);
      expect(date.getUTCDate()).toBe(15);
    });
  });

  describe('date range with same month', () => {
    it('should parse range with day number only for end date', () => {
      const result = parseDateRange('January 15–20', baseYear);
      const startDate = new UTCDate(result.starts_at);
      const endDate = new UTCDate(result.ends_at);

      expect(startDate.getUTCMonth()).toBe(0);
      expect(startDate.getUTCDate()).toBe(15);
      expect(startDate.getUTCHours()).toBe(0);

      expect(endDate.getUTCMonth()).toBe(0);
      expect(endDate.getUTCDate()).toBe(20);
      expect(endDate.getUTCHours()).toBe(0);
      expect(endDate.getUTCMinutes()).toBe(0);
      expect(endDate.getUTCSeconds()).toBe(0);
    });

    it('should handle hyphen separator', () => {
      const result = parseDateRange('January 15-20', baseYear);
      const startDate = new UTCDate(result.starts_at);
      const endDate = new UTCDate(result.ends_at);

      expect(startDate.getUTCDate()).toBe(15);
      expect(endDate.getUTCDate()).toBe(20);
    });

    it('should handle en dash separator', () => {
      const result = parseDateRange('January 15–20', baseYear);
      const startDate = new UTCDate(result.starts_at);
      const endDate = new UTCDate(result.ends_at);

      expect(startDate.getUTCDate()).toBe(15);
      expect(endDate.getUTCDate()).toBe(20);
    });
  });

  describe('date range with different months', () => {
    it('should parse range spanning two months', () => {
      const result = parseDateRange('January 31–February 1', baseYear);
      const startDate = new UTCDate(result.starts_at);
      const endDate = new UTCDate(result.ends_at);

      expect(startDate.getUTCMonth()).toBe(0);
      expect(startDate.getUTCDate()).toBe(31);

      expect(endDate.getUTCMonth()).toBe(1);
      expect(endDate.getUTCDate()).toBe(1);
      expect(endDate.getUTCHours()).toBe(0);
      expect(endDate.getUTCMinutes()).toBe(0);
      expect(endDate.getUTCSeconds()).toBe(0);
    });

    it('should parse range spanning multiple months', () => {
      const result = parseDateRange('March 15–May 20', baseYear);
      const startDate = new UTCDate(result.starts_at);
      const endDate = new UTCDate(result.ends_at);

      expect(startDate.getUTCMonth()).toBe(2);
      expect(startDate.getUTCDate()).toBe(15);

      expect(endDate.getUTCMonth()).toBe(4);
      expect(endDate.getUTCDate()).toBe(20);
    });
  });

  describe('baseYear parameter', () => {
    it('should use provided baseYear', () => {
      const result = parseDateRange('January 15', 2023);
      const date = new UTCDate(result.starts_at);

      expect(date.getUTCFullYear()).toBe(2023);
    });

    it('should default to current year when baseYear not provided', () => {
      const currentYear = new Date().getUTCFullYear();
      const result = parseDateRange('January 15');
      const date = new UTCDate(result.starts_at);

      expect(date.getUTCFullYear()).toBe(currentYear);
    });
  });

  describe('all months', () => {
    const months = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december'
    ];

    it.each(months)('should parse %s correctly', (month) => {
      const capitalized = month.charAt(0).toUpperCase() + month.slice(1);
      const result = parseDateRange(`${capitalized} 15`, baseYear);
      const date = new UTCDate(result.starts_at);

      expect(date.getUTCMonth()).toBe(months.indexOf(month));
      expect(date.getUTCDate()).toBe(15);
    });
  });

  describe('error cases', () => {
    it('should throw error for invalid start date format', () => {
      expect(() => parseDateRange('Invalid', baseYear)).toThrow(
        'Unable to parse start date: Invalid'
      );
    });

    it('should throw error for unknown month', () => {
      expect(() => parseDateRange('InvalidMonth 15', baseYear)).toThrow(
        'Unknown month: invalidmonth'
      );
    });

    it('should throw error for invalid day (zero)', () => {
      expect(() => parseDateRange('January 0', baseYear)).toThrow('Invalid day: 0');
    });

    it('should throw error for invalid day (negative)', () => {
      expect(() => parseDateRange('January -5', baseYear)).toThrow('Invalid day: -5');
    });

    it('should throw error for invalid day (greater than 31)', () => {
      expect(() => parseDateRange('January 32', baseYear)).toThrow('Invalid day: 32');
    });

    it('should throw error for invalid end day in range', () => {
      expect(() => parseDateRange('January 15–32', baseYear)).toThrow('Invalid end day: 32');
    });

    it('should throw error for unknown month in end date', () => {
      expect(() => parseDateRange('January 15–InvalidMonth 20', baseYear)).toThrow(
        'Unknown month: invalidmonth'
      );
    });

    it('should throw error for empty string', () => {
      expect(() => parseDateRange('', baseYear)).toThrow('Unable to parse start date:');
    });

    it('should throw error for whitespace only', () => {
      expect(() => parseDateRange('   ', baseYear)).toThrow('Unable to parse start date:');
    });
  });

  describe('edge cases', () => {
    it('should handle first day of month', () => {
      const result = parseDateRange('January 1', baseYear);
      const date = new UTCDate(result.starts_at);

      expect(date.getUTCDate()).toBe(1);
    });

    it('should handle last day of month', () => {
      const result = parseDateRange('January 31', baseYear);
      const date = new UTCDate(result.starts_at);

      expect(date.getUTCDate()).toBe(31);
    });

    it('should handle range from last day of month to first day of next month', () => {
      const result = parseDateRange('January 31–February 1', baseYear);
      const startDate = new UTCDate(result.starts_at);
      const endDate = new UTCDate(result.ends_at);

      expect(startDate.getUTCMonth()).toBe(0);
      expect(startDate.getUTCDate()).toBe(31);
      expect(endDate.getUTCMonth()).toBe(1);
      expect(endDate.getUTCDate()).toBe(1);
    });

    it('should handle year boundary with custom year', () => {
      const result = parseDateRange('December 31–January 1', 2024);
      const startDate = new UTCDate(result.starts_at);
      const endDate = new UTCDate(result.ends_at);

      expect(startDate.getUTCFullYear()).toBe(2024);
      expect(startDate.getUTCMonth()).toBe(11);
      expect(startDate.getUTCDate()).toBe(31);
      expect(endDate.getUTCFullYear()).toBe(2024);
      expect(endDate.getUTCMonth()).toBe(0);
      expect(endDate.getUTCDate()).toBe(1);
    });
  });

  describe('ISO string format', () => {
    it('should return valid ISO strings', () => {
      const result = parseDateRange('January 15', baseYear);

      expect(result.starts_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(result.ends_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should return parseable ISO strings', () => {
      const result = parseDateRange('January 15', baseYear);

      expect(() => new Date(result.starts_at)).not.toThrow();
      expect(() => new Date(result.ends_at)).not.toThrow();
    });
  });
});
