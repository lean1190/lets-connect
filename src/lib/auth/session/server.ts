'use server';

import { createClient } from '@/lib/supabase/server';
import type { CurrentUserSession } from './types';

export async function getServerSession() {
  return (await (await createClient()).auth.getSession()).data.session;
}

export async function getServerUser() {
  return (await (await createClient()).auth.getUser()).data.user;
}

export async function getServerCurrentUserSession() {
  return {
    session: await getServerSession(),
    user: await getServerUser()
  } as CurrentUserSession;
}
