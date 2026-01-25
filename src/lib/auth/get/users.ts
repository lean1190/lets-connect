import { createPrivilegedClient } from '@/lib/database/client/server';

export async function getAllUsers() {
  const supabase = await createPrivilegedClient();

  const {
    data: { users }
  } = await supabase.auth.admin.listUsers();

  return users;
}

export async function getAllUsersCount() {
  return (await getAllUsers()).length ?? 0;
}
