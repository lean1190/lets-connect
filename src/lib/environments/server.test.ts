import { describe, expect, test } from 'vitest';
import { removeWindow } from '../testing/window';
import { isBrowser, isServer } from './server';

describe('isServer', () => {
  test('should return false when window is defined', () => {
    // In vitest/jsdom environment, window is defined
    expect(isServer()).toBe(false);
  });

  test('should return true when window is undefined', () => {
    removeWindow();
    expect(isServer()).toBe(true);
  });
});

describe('isBrowser', () => {
  test('should return true when window is defined', () => {
    // In vitest/jsdom environment, window is defined
    expect(isBrowser()).toBe(true);
  });

  test('should return false when window is undefined', () => {
    removeWindow();
    expect(isBrowser()).toBe(false);
  });
});
