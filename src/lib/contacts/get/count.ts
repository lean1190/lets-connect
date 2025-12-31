import { createPrivilegedClient } from '@/lib/database/client/server';

export async function getContactsCount() {
  const supabase = await createPrivilegedClient();

  const { count } = await supabase.from('contacts').select('*', { count: 'exact', head: true });

  return count || 0;
}
