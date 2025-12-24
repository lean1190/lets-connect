import type { Session, User } from '@supabase/supabase-js';

export type NullableSession = Session | null;
export type NullableUser = User | null;

export interface CurrentUserSession {
  session: NullableSession;
  user: NullableUser;
}
