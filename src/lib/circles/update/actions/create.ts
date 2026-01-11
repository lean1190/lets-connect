'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createDatabaseServerClient } from '@/lib/database/client/server';
import { actionClient } from '@/lib/server-actions/client';

const createCircleSchema = z.object({
  name: z.string().min(1, 'Circle name is required'),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable()
});

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

    revalidatePath('/circles');
    return { id };
  });
