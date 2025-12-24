import type { SupabaseClient } from '@supabase/supabase-js';
import { isServer } from '../environments/server';
import { supabaseClient } from './client';
import { createClient } from './server';

export async function getSupabaseClient(): Promise<SupabaseClient> {
  return isServer() ? await createClient() : supabaseClient;
}
