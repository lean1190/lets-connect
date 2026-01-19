'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createDatabaseServerClient } from '@/lib/database/client/server';
import { actionClient } from '@/lib/server-actions/client';

const toggleFavoriteSchema = z.object({
  id: z.uuid(),
  type: z.enum(['contact', 'circle']),
  favorite: z.boolean()
});

export const toggleFavorite = actionClient
  .inputSchema(toggleFavoriteSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createDatabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const table = parsedInput.type === 'contact' ? 'contacts' : 'circles';

    const { error } = await supabase
      .from(table)
      .update({ favorite: parsedInput.favorite })
      .eq('id', parsedInput.id)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Failed to update favorite: ${error.message}`);
    }

    revalidatePath('/favorites');
    revalidatePath(`/${table}`);
    revalidatePath(`/${table}/${parsedInput.id}`);

    return { success: true, favorite: parsedInput.favorite };
  });
