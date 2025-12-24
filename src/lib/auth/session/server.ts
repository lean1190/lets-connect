'use server';

import { createClient } from '@/lib/supabase/server';
import type { CurrentUserSession } from './types';

export async function getServerSession() {
  return (await (await createClient()).auth.getSession()).data?.session ?? null;
}

export async function getServerUser() {
  return (await (await createClient()).auth.getUser()).data?.user ?? null;
}

export async function getClaims() {
  return (await (await createClient()).auth.getClaims()).data?.claims ?? null;
}

export async function getServerCurrentUserSession() {
  return {
    session: await getServerSession(),
    user: await getServerUser(),
    claims: await getClaims()
  } as CurrentUserSession;
}
