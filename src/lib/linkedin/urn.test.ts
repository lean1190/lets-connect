import { describe, expect, it } from 'vitest';
import { getLinkedInAuthorUrn, getLinkedInUrnLastPart } from './urn';

describe('getLinkedInAuthorUrn', () => {
  it('should return a valid LinkedIn URN for a given ID', () => {
    const urn = getLinkedInAuthorUrn('12345');
    expect(urn).toBe('urn:li:person:12345');
  });

  it('should return null when no ID is provided', () => {
    const urn = getLinkedInAuthorUrn();
    expect(urn).toBeNull();
  });
});

describe('getLinkedInUrnLastPart', () => {
  it('should extract the ID from a valid LinkedIn URN', () => {
    const id = getLinkedInUrnLastPart('urn:li:person:67890');
    expect(id).toBe('67890');
  });

  it('should return the last part of an incorrectly formatted URN', () => {
    const id = getLinkedInUrnLastPart('urn:li:wrong:format:abcdef');
    expect(id).toBe('abcdef');
  });

  it('should return the entire input if there are no colons', () => {
    const id = getLinkedInUrnLastPart('invalidURN');
    expect(id).toBe('invalidURN');
  });

  it('should return an empty string when given an empty URN', () => {
    const id = getLinkedInUrnLastPart('');
    expect(id).toBe('');
  });
});
