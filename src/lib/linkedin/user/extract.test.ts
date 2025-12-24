import type { UserIdentity } from '@supabase/supabase-js';
import { describe, expect, it } from 'vitest';
import type { NullableSession, NullableUser } from '@/lib/auth/session/types';
import {
  extractLinkedInAccessToken,
  extractLinkedInId,
  extractLinkedInProfileImage
} from './extract';

describe('extractLinkedInAccessToken', () => {
  it('should return the provider token when session is valid', () => {
    const token = extractLinkedInAccessToken({ provider_token: 'abc123' } as NullableSession);
    expect(token).toBe('abc123');
  });

  it('should return undefined when session is null', () => {
    const token = extractLinkedInAccessToken(null);
    expect(token).toBeUndefined();
  });

  it('should return undefined when session does not have a provider token', () => {
    const token = extractLinkedInAccessToken({} as NullableSession);
    expect(token).toBeUndefined();
  });
});

describe('extractLinkedInId', () => {
  it('should return the LinkedIn ID when user has identities', () => {
    const id = extractLinkedInId({ identities: [{ id: '12345' } as UserIdentity] } as NullableUser);
    expect(id).toBe('12345');
  });

  it('should return undefined when user is null', () => {
    const id = extractLinkedInId(null);
    expect(id).toBeUndefined();
  });

  it('should return undefined when user does not have identities', () => {
    const id = extractLinkedInId({} as NullableUser);
    expect(id).toBeUndefined();
  });

  it('should return undefined when identities array is empty', () => {
    const id = extractLinkedInId({ identities: [] } as unknown as NullableUser);
    expect(id).toBeUndefined();
  });
});

describe('extractLinkedInProfileImage', () => {
  it('should return the profile image URL when user metadata contains a picture', () => {
    const image = extractLinkedInProfileImage({
      user_metadata: { picture: 'https://example.com/image.jpg' }
    } as unknown as NullableUser);
    expect(image).toBe('https://example.com/image.jpg');
  });

  it('should return undefined when user is null', () => {
    const image = extractLinkedInProfileImage(null);
    expect(image).toBeUndefined();
  });

  it('should return undefined when user metadata is not defined', () => {
    const image = extractLinkedInProfileImage({} as NullableUser);
    expect(image).toBeUndefined();
  });

  it('should return undefined when user metadata does not have a picture', () => {
    const image = extractLinkedInProfileImage({ user_metadata: {} } as NullableUser);
    expect(image).toBeUndefined();
  });
});
