'use server';

import { createClient } from '@/lib/database/client/server';

export async function getStats() {
  const supabase = await createClient();

  // Get unique user count by counting distinct user_ids from contacts and circles
  const [contactsData, circlesData] = await Promise.all([
    supabase.from('contacts').select('user_id').not('user_id', 'is', null),
    supabase.from('circles').select('user_id').not('user_id', 'is', null)
  ]);

  const allUserIds = new Set<string>();
  contactsData.data?.forEach((c) => {
    if (c.user_id) allUserIds.add(c.user_id);
  });
  circlesData.data?.forEach((c) => {
    if (c.user_id) allUserIds.add(c.user_id);
  });

  // Get contacts count
  const { count: contactsCount } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true });

  // Get circles count
  const { count: circlesCount } = await supabase
    .from('circles')
    .select('*', { count: 'exact', head: true });

  return {
    usersCount: allUserIds.size,
    contactsCount: contactsCount || 0,
    circlesCount: circlesCount || 0
  };
}
