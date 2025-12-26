import type { SupabaseClient } from '@supabase/supabase-js';
import { isServer } from '@/lib/environments/server';
import type { Database } from '../types';
import { supabaseClient } from './browser';
import { createClient } from './server';

export async function getSupabaseClient(): Promise<SupabaseClient<Database>> {
  return isServer() ? await createClient() : supabaseClient;
}
