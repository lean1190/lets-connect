'use server';

import { revalidatePath } from 'next/cache';
import { createDatabaseServerClient } from '@/lib/database/client/server';
import { actionClient } from '@/lib/server-actions/client';
import { updateCircleSchema } from '../schema';

export const updateCircle = actionClient
  .inputSchema(updateCircleSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createDatabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const updateData = {
      name: parsedInput.name,
      updated_at: new Date().toISOString(),
      ...(parsedInput.color !== undefined ? { color: parsedInput.color } : {}),
      ...(parsedInput.description !== undefined ? { description: parsedInput.description } : {}),
      ...(parsedInput.icon !== undefined ? { icon: parsedInput.icon } : {})
    };

    const { error } = await supabase
      .from('circles')
      .update(updateData)
      .eq('id', parsedInput.id)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Failed to update circle: ${error.message}`);
    }

    revalidatePath('/circles');
    revalidatePath(`/circles/${parsedInput.id}`);
  });
