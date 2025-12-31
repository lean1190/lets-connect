'use server';

import { getAllUsers } from '@/lib/auth/get/users';
import { getCirclesCount } from '@/lib/circles/get/count';
import { getContactsCount } from '@/lib/contacts/get/count';

export async function getStats() {
  return {
    usersCount: (await getAllUsers()).length || 0,
    contactsCount: await getContactsCount(),
    circlesCount: await getCirclesCount()
  };
}
