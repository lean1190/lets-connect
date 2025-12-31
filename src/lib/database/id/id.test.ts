import { describe, expect, it } from 'vitest';
import { variabilityTest } from '@/lib/testing/variability';
import { hasId, newId, validateUuid } from './id';

describe('hasId', () => {
  const testCases = variabilityTest<unknown, boolean>({
    'should return true for an object with an id string': {
      input: { id: '123' },
      expected: true
    },
    'should return false for an object without an id': {
      input: { name: 'test' },
      expected: false
    },
    'should return false for an object with id as a number': {
      input: { id: 123 },
      expected: false
    },
    'should return false for an object with id as null': {
      input: { id: null },
      expected: false
    },
    'should return false for an object with id as undefined': {
      input: { id: undefined },
      expected: false
    },
    'should return false for an object with id as an object': {
      input: { id: {} },
      expected: false
    },
    'should return false for an object with id as an array': {
      input: { id: [] },
      expected: false
    },
    'should return false for null': {
      input: null,
      expected: false
    },
    'should return false for undefined': {
      input: undefined,
      expected: false
    },
    'should return false for a number': {
      input: 123,
      expected: false
    },
    'should return false for a string': {
      input: 'string',
      expected: false
    },
    'should return false for a boolean': {
      input: true,
      expected: false
    },
    'should return false for an array': {
      input: [],
      expected: false
    },
    'should return false for a function': {
      input: () => {},
      expected: false
    },
    'should return true for an object with additional properties and a valid id': {
      input: { id: 'abc', name: 'test', age: 30 },
      expected: true
    }
  });

  it.each(testCases)('$caseName', ({ input, expected }) => {
    expect(hasId(input)).toBe(expected);
  });
});

describe('newId', () => {
  it('should generate a valid UUID', () => {
    const id = newId();
    expect(validateUuid(id)).toBe(true);
  });

  it('should generate unique IDs on multiple calls', () => {
    const id1 = newId();
    const id2 = newId();
    expect(id1).not.toBe(id2);
  });

  it('should return a string', () => {
    expect(typeof newId()).toBe('string');
  });
});
