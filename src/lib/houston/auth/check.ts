'use server';

import { cookies } from 'next/headers';
import { actionClient } from '@/lib/server-actions/client';
import { createServerActionError } from '@/lib/server-actions/errors';
import { authenticatedValue, cookieName } from './constants';

export const checkHoustonAuth = actionClient.action(async () => {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(cookieName);

    const authenticated = authCookie && authCookie.value === authenticatedValue;
    return { authenticated };
  } catch {
    throw createServerActionError({
      type: 'AuthCheckError',
      message: 'Failed to check authentication status'
    });
  }
});
