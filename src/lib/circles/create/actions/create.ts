'use server';

import { revalidatePath } from 'next/cache';
import { AppRoute } from '@/lib/constants/navigation';
import { createDatabaseServerClient } from '@/lib/database/client/server';
import { actionClient } from '@/lib/server-actions/client';
import { createCircleSchema } from '../schema';

export const createCircle = actionClient
  .inputSchema(createCircleSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createDatabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const { error } = await supabase.from('circles').insert({
      id,
      created_at: now,
      name: parsedInput.name,
      color: parsedInput.color || null,
      description: parsedInput.description || null,
      icon: parsedInput.icon || null,
      updated_at: now,
      user_id: user.id
    });

    if (error) {
      throw new Error(`Failed to create circle: ${error.message}`);
    }

    revalidatePath(AppRoute.Circles);
    return { id };
  });
