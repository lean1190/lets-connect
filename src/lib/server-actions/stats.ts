'use server';

import { createPrivilegedClient } from '@/lib/database/client/server';

export async function getStats() {
  const supabase = await createPrivilegedClient();

  const {
    data: { users }
  } = await supabase.auth.admin.listUsers();

  const { count: contactsCount } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true });

  const { count: circlesCount } = await supabase
    .from('circles')
    .select('*', { count: 'exact', head: true });

  return {
    usersCount: users.length || 0,
    contactsCount: contactsCount || 0,
    circlesCount: circlesCount || 0
  };
}
