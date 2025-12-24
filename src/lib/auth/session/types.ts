import type { JwtPayload, Session, User } from '@supabase/supabase-js';

export type NullableSession = Session | null;
export type NullableUser = User | null;
export type NullableClaims = JwtPayload | null;

export type CurrentUserSession = {
  session: NullableSession;
  user: NullableUser;
  claims: NullableClaims;
};
