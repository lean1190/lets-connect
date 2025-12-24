import { redirect } from 'next/navigation';
import { supabaseClient } from '../supabase/client';

export async function signOut() {
  await supabaseClient.auth.signOut();
  redirect('/');
}
