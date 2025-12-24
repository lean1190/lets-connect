import { getSupabaseClient } from '@/lib/supabase/isomorphic';
import type { CurrentUserSession } from './types';

export async function getSession() {
  return (await (await getSupabaseClient()).auth.getSession()).data?.session ?? null;
}

export async function getUser() {
  return (await (await getSupabaseClient()).auth.getUser()).data?.user ?? null;
}

export async function getClaims() {
  return (await (await getSupabaseClient()).auth.getClaims()).data?.claims ?? null;
}

export async function getCurrentUserSession() {
  return {
    session: await getSession(),
    user: await getUser(),
    claims: await getClaims()
  } as CurrentUserSession;
}

export async function isSignedIn() {
  return !!(await getUser());
}
