'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';
import { isProduction } from '@/lib/environments/is-env';
import { actionClient } from '@/lib/server-actions/client';
import { createServerActionError, isServerActionError } from '@/lib/server-actions/errors';
import { getHoustonCredentials } from '../credentials';
import { authenticatedValue, cookieName } from './constants';

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
        cookieStore.set(cookieName, authenticatedValue, {
          httpOnly: true,
          secure: isProduction(),
          sameSite: 'strict',
          maxAge: 60 * 60 * 3 // 3 hours
        });

        return { success: true };
      }

      throw createServerActionError({
        type: 'InvalidCredentialsError',
        message: 'Invalid credentials'
      });
    } catch (error) {
      if (isServerActionError(error)) {
        throw error;
      }

      throw createServerActionError({
        type: 'AuthenticationError',
        message: 'Authentication failed'
      });
    }
  });
