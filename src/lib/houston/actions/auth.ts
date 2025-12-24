'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';
import { actionClient } from '@/lib/server-actions/client';
import { createServerActionError } from '@/lib/server-actions/errors';
import { getHoustonCredentials } from '../credentials';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

export const loginHouston = actionClient
  .inputSchema(loginSchema)
  .action(async ({ parsedInput: { username, password } }) => {
    try {
      const { username: expectedUsername, password: expectedPassword } = getHoustonCredentials();

      if (username === expectedUsername && password === expectedPassword) {
        const cookieStore = await cookies();
        cookieStore.set('houston-auth', 'authenticated', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 // 24 hours
        });

        return { success: true };
      } else {
        throw createServerActionError({
          type: 'InvalidCredentialsError',
          message: 'Invalid credentials'
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'ServerActionError') {
        throw error;
      }
      throw createServerActionError({
        type: 'AuthenticationError',
        message: 'Authentication failed'
      });
    }
  });

export const checkHoustonAuth = actionClient.action(async () => {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('houston-auth');

    if (authCookie && authCookie.value === 'authenticated') {
      return { authenticated: true };
    } else {
      return { authenticated: false };
    }
  } catch {
    throw createServerActionError({
      type: 'AuthCheckError',
      message: 'Failed to check authentication status'
    });
  }
});
