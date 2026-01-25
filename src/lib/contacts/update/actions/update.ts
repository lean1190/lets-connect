'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createDatabaseServerClient } from '@/lib/database/client/server';
import { actionClient } from '@/lib/server-actions/client';

const updateContactSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(120).optional(),
  profileLink: z.url().max(500).optional(),
  reason: z.string().min(1).max(2000).optional(),
  circleIds: z.array(z.uuid()).optional()
});

export const updateContact = actionClient
  .inputSchema(updateContactSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createDatabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const updates: Record<string, string> = {};
    if (parsedInput.name !== undefined) updates.name = parsedInput.name;
    if (parsedInput.profileLink !== undefined) updates.url = parsedInput.profileLink;
    if (parsedInput.reason !== undefined) updates.reason = parsedInput.reason;

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', parsedInput.id)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(`Failed to update contact: ${error.message}`);
      }
    }

    if (parsedInput.circleIds !== undefined) {
      await supabase
        .from('contacts_circles')
        .delete()
        .eq('contact_id', parsedInput.id)
        .eq('user_id', user.id);

      if (parsedInput.circleIds.length > 0) {
        const contactCircles = parsedInput.circleIds.map((circleId) => ({
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          contact_id: parsedInput.id,
          circle_id: circleId,
          user_id: user.id
        }));

        const { error: circlesError } = await supabase
          .from('contacts_circles')
          .insert(contactCircles);

        if (circlesError) {
          throw new Error(`Failed to update contact circles: ${circlesError.message}`);
        }
      }
    }

    revalidatePath('/');
    revalidatePath(`/contacts/${parsedInput.id}`);
  });
