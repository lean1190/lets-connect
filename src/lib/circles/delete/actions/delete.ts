'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSupabaseClient } from '@/lib/database/client/isomorphic';
import { actionClient } from '@/lib/server-actions/client';

const deleteCircleSchema = z.object({
  id: z.uuid()
});

export const deleteCircle = actionClient
  .inputSchema(deleteCircleSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await getSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase
      .from('circles')
      .delete()
      .eq('id', parsedInput.id)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Failed to delete circle: ${error.message}`);
    }

    revalidatePath('/circles');
    return { success: true };
  });
