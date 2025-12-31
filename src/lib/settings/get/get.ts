'use server';

import { getSupabaseClient } from '@/lib/database/client/isomorphic';

export async function getSettings() {
  const supabase = await getSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { theme: 'light' as const, qrLink: null };
  }

  const { data: settings } = await supabase
    .from('settings')
    .select('theme, qr_link')
    .eq('user_id', user.id)
    .single();

  return {
    theme: (settings?.theme as 'light' | 'dark') || 'light',
    qrLink: settings?.qr_link || null
  };
}
