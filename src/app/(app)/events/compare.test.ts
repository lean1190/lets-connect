import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isEventToday, isUpcomingEvent } from './compare';

const FIXED_DATE = new Date('2026-01-23T12:00:00.000Z');

function setupFakeTimers() {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_DATE);
}

function cleanupFakeTimers() {
  vi.useRealTimers();
}

describe('isEventToday', () => {
  beforeEach(() => setupFakeTimers());
  afterEach(() => cleanupFakeTimers());

  it('should return true for event at UTC midnight on today', () => {
    const eventDate = '2026-01-23T00:00:00.000Z';
    expect(isEventToday(eventDate)).toBe(true);
  });

  it('should return false for event at UTC midnight on tomorrow', () => {
    const eventDate = '2026-01-24T00:00:00.000Z';
    expect(isEventToday(eventDate)).toBe(false);
  });

  it('should return false for event at UTC midnight on yesterday', () => {
    const eventDate = '2026-01-22T00:00:00.000Z';
    expect(isEventToday(eventDate)).toBe(false);
  });

  it('should return true for event at any time on today in UTC', () => {
    const eventDate = '2026-01-23T23:59:59.000Z';
    expect(isEventToday(eventDate)).toBe(true);
  });

  it('should return false for event at end of day when crossing UTC date boundary', () => {
    const eventDate = '2026-01-24T00:00:00.000Z';
    expect(isEventToday(eventDate)).toBe(false);
  });
});

describe('isUpcomingEvent', () => {
  beforeEach(() => setupFakeTimers());
  afterEach(() => cleanupFakeTimers());

  it('should return true for event at UTC midnight on today', () => {
    const eventDate = '2026-01-23T00:00:00.000Z';
    expect(isUpcomingEvent(eventDate)).toBe(true);
  });

  it('should return true for event at UTC midnight on tomorrow', () => {
    const eventDate = '2026-01-24T00:00:00.000Z';
    expect(isUpcomingEvent(eventDate)).toBe(true);
  });

  it('should return false for event at UTC midnight on yesterday', () => {
    const eventDate = '2026-01-22T00:00:00.000Z';
    expect(isUpcomingEvent(eventDate)).toBe(false);
  });

  it('should return true for event in the future', () => {
    const eventDate = '2026-02-15T00:00:00.000Z';
    expect(isUpcomingEvent(eventDate)).toBe(true);
  });
});
