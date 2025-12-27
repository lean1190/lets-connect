import { describe, expect, test } from 'vitest';
import { isClient } from './client';

describe('isClient', () => {
  test('should return true when window is defined', () => {
    // In vitest/jsdom environment, window is defined
    expect(isClient()).toBe(true);
  });

  test('should return false when window is undefined', () => {
    // Mock window as undefined
    const originalWindow = global.window;
    // @ts-expect-error - temporarily delete window
    delete global.window;

    expect(isClient()).toBe(false);

    // Restore window
    global.window = originalWindow;
  });
});
