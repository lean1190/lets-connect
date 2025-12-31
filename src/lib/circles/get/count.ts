import { createPrivilegedClient } from '@/lib/database/client/server';

export async function getCirclesCount() {
  const supabase = await createPrivilegedClient();

  const { count } = await supabase.from('circles').select('*', { count: 'exact', head: true });

  return count || 0;
}
