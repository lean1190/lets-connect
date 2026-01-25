'use server';

import { getAllUsersCount } from '@/lib/auth/get/users';
import { getCirclesCount } from '@/lib/circles/get/count';
import { getContactsCount } from '@/lib/contacts/get/count';

export async function getStats() {
  return {
    usersCount: await getAllUsersCount(),
    contactsCount: await getContactsCount(),
    circlesCount: await getCirclesCount()
  };
}
