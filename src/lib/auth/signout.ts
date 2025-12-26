'use server';

import { redirect } from 'next/navigation';
import { getSupabaseClient } from '@/lib/database/client/isomorphic';

export async function signOut() {
  await (await getSupabaseClient()).auth.signOut();
  redirect('/');
}
