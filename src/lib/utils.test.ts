import { describe, expect, test } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  test('should merge class names correctly', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4');
  });

  test('should handle conditional classes', () => {
    expect(cn('base', true && 'active', false && 'inactive')).toBe('base active');
  });

  test('should merge conflicting Tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  test('should handle arrays of classes', () => {
    expect(cn(['px-2', 'py-4'], 'text-center')).toBe('px-2 py-4 text-center');
  });

  test('should handle empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
    expect(cn(null, undefined)).toBe('');
  });

  test('should handle objects with boolean values', () => {
    expect(
      cn({
        active: true,
        inactive: false,
        visible: true
      })
    ).toBe('active visible');
  });
});
