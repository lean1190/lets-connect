'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { AppRoute } from '@/lib/constants/navigation';
import { createDatabaseServerClient } from '@/lib/database/client/server';
import { actionClient } from '@/lib/server-actions/client';
import { FavoriteType } from '../types';

const FAVORITE_TYPE_ROUTE: Record<FavoriteType, string> = {
  [FavoriteType.Contact]: AppRoute.Contacts,
  [FavoriteType.Circle]: AppRoute.Circles
};

const toggleFavoriteSchema = z.object({
  id: z.uuid(),
  type: z.nativeEnum(FavoriteType),
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

    const { error } = await supabase
      .from(parsedInput.type)
      .update({ favorite: parsedInput.favorite })
      .eq('id', parsedInput.id)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Failed to update favorite: ${error.message}`);
    }

    revalidatePath(AppRoute.Favorites);
    revalidatePath(FAVORITE_TYPE_ROUTE[parsedInput.type]);
  });
