'use server';

import { redirect } from 'next/navigation';
import { createDatabaseServerClient } from '@/lib/database/client/server';

export async function signOut() {
  await (await createDatabaseServerClient()).auth.signOut();
  redirect('/');
}
