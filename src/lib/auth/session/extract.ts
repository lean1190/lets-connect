import type { NullableUser } from './types';

export function extractUserEmail(user: NullableUser) {
  return user?.email;
}

export function extractUserId(user: NullableUser) {
  return user?.id;
}
