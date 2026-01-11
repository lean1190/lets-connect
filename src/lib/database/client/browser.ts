'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types';

export function createDatabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''
  );
}

export const databaseBrowserClient = createDatabaseBrowserClient();
