import { createPrivilegedClient } from '@/lib/database/client/server';

export async function getAllUsers() {
  const supabase = await createPrivilegedClient();

  const {
    data: { users }
  } = await supabase.auth.admin.listUsers();

  return users;
}
