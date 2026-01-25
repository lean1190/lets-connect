'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createDatabaseServerClient } from '@/lib/database/client/server';
import { actionClient } from '@/lib/server-actions/client';

const updateCircleSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(1000).optional().nullable(),
  color: z.string().optional().nullable(),
  icon: z.string().optional().nullable()
});

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

    const updateData: {
      name?: string;
      color?: string | null;
      description?: string | null;
      icon?: string | null;
      updated_at: string;
    } = {
      updated_at: new Date().toISOString()
    };

    if (parsedInput.name !== undefined) {
      updateData.name = parsedInput.name;
    }
    if (parsedInput.color !== undefined) {
      updateData.color = parsedInput.color;
    }
    if (parsedInput.description !== undefined) {
      updateData.description = parsedInput.description;
    }
    if (parsedInput.icon !== undefined) {
      updateData.icon = parsedInput.icon;
    }

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
