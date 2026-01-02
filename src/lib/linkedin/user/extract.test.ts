import type { UserIdentity } from '@supabase/supabase-js';
import { describe, expect, it } from 'vitest';
import type { NullableSession, NullableUser } from '@/lib/auth/session/types';
import {
  extractLinkedInAccessToken,
  extractLinkedInEmail,
  extractLinkedInId,
  extractLinkedInName,
  extractLinkedInProfileImage
} from './extract';

describe('extractLinkedInAccessToken', () => {
  it('should return the provider token when session is valid', () => {
    const token = extractLinkedInAccessToken({ provider_token: 'abc123' } as NullableSession);
    expect(token).toBe('abc123');
  });

  it('should return empty string when session is null', () => {
    const token = extractLinkedInAccessToken(null);
    expect(token).toBe('');
  });

  it('should return empty string when session does not have a provider token', () => {
    const token = extractLinkedInAccessToken({} as NullableSession);
    expect(token).toBe('');
  });
});

describe('extractLinkedInId', () => {
  it('should return the LinkedIn ID when user has identities', () => {
    const id = extractLinkedInId({ identities: [{ id: '12345' } as UserIdentity] } as NullableUser);
    expect(id).toBe('12345');
  });

  it('should return empty string when user is null', () => {
    const id = extractLinkedInId(null);
    expect(id).toBe('');
  });

  it('should return empty string when user does not have identities', () => {
    const id = extractLinkedInId({} as NullableUser);
    expect(id).toBe('');
  });

  it('should return empty string when identities array is empty', () => {
    const id = extractLinkedInId({ identities: [] } as unknown as NullableUser);
    expect(id).toBe('');
  });
});

describe('extractLinkedInProfileImage', () => {
  it('should return the profile image URL when user metadata contains a picture', () => {
    const image = extractLinkedInProfileImage({
      user_metadata: { picture: 'https://example.com/image.jpg' }
    } as unknown as NullableUser);
    expect(image).toBe('https://example.com/image.jpg');
  });

  it('should return empty string when user is null', () => {
    const image = extractLinkedInProfileImage(null);
    expect(image).toBe('');
  });

  it('should return empty string when user metadata is not defined', () => {
    const image = extractLinkedInProfileImage({} as NullableUser);
    expect(image).toBe('');
  });

  it('should return empty string when user metadata does not have a picture', () => {
    const image = extractLinkedInProfileImage({ user_metadata: {} } as NullableUser);
    expect(image).toBe('');
  });
});

describe('extractLinkedInEmail', () => {
  it('should return the email when user has an email', () => {
    const email = extractLinkedInEmail({ email: 'user@example.com' } as NullableUser);
    expect(email).toBe('user@example.com');
  });

  it('should return default message when user is null', () => {
    const email = extractLinkedInEmail(null);
    expect(email).toBe('No email?');
  });

  it('should return default message when user does not have an email', () => {
    const email = extractLinkedInEmail({} as NullableUser);
    expect(email).toBe('No email?');
  });

  it('should return default message when user email is null', () => {
    const email = extractLinkedInEmail({ email: null } as unknown as NullableUser);
    expect(email).toBe('No email?');
  });
});

describe('extractLinkedInName', () => {
  it('should return the name when user metadata contains a name', () => {
    const name = extractLinkedInName({
      user_metadata: { name: 'John Doe' }
    } as unknown as NullableUser);
    expect(name).toBe('John Doe');
  });

  it('should return default message when user is null', () => {
    const name = extractLinkedInName(null);
    expect(name).toBe('You');
  });

  it('should return default message when user metadata is not defined', () => {
    const name = extractLinkedInName({} as NullableUser);
    expect(name).toBe('You');
  });

  it('should return default message when user metadata does not have a name', () => {
    const name = extractLinkedInName({ user_metadata: {} } as NullableUser);
    expect(name).toBe('You');
  });
});
