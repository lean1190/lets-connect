import { getAllUsersCount } from '@/lib/auth/get/users';
import { SendNotificationsPageClient } from './page-client';

export default async function SendNotificationsPage() {
  const usersCount = await getAllUsersCount();

  return <SendNotificationsPageClient usersCount={usersCount} />;
}
