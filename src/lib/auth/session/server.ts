import { createDatabaseServerClient } from '@/lib/database/client/server';
import type { CurrentUserSession } from './types';

export async function getSession() {
  return (await (await createDatabaseServerClient()).auth.getSession()).data?.session ?? null;
}

export async function getUser() {
  return (await (await createDatabaseServerClient()).auth.getUser()).data?.user ?? null;
}

export async function getClaims() {
  return (await (await createDatabaseServerClient()).auth.getClaims()).data?.claims ?? null;
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
