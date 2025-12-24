'use client';

import { supabaseClient } from '../../supabase/client';
import type { CurrentUserSession } from './types';

export async function getClientSession() {
  return (await supabaseClient.auth.getSession()).data?.session ?? null;
}

export async function getClientUser() {
  return (await supabaseClient.auth.getUser()).data?.user ?? null;
}

export async function getClientCurrentUserSession() {
  return {
    session: await getClientSession(),
    user: await getClientUser()
  } as CurrentUserSession;
}
