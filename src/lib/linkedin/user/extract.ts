import type { NullableSession, NullableUser } from '@/lib/auth/session/types';

export function extractLinkedInAccessToken(session: NullableSession) {
  return session?.provider_token;
}

export function extractLinkedInId(user: NullableUser) {
  return user?.identities?.[0]?.id;
}

export function extractLinkedInProfileImage(user: NullableUser) {
  return user?.user_metadata?.picture as string;
}
