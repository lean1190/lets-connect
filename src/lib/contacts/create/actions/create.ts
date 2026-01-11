'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createDatabaseServerClient } from '@/lib/database/client/server';
import { actionClient } from '@/lib/server-actions/client';

const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120, 'Name can be 120 characters long'),
  profileLink: z.url('Invalid URL').max(500, 'Url can be 500 characters long'),
  reason: z.string().min(1, 'Reason is required').max(2000, 'Reason can be 2000 characters long'),
  circleIds: z.array(z.uuid()).optional()
});

export const createContact = actionClient
  .inputSchema(createContactSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createDatabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const { error: contactError } = await supabase.from('contacts').insert({
      id,
      created_at: createdAt,
      user_id: user.id,
      url: parsedInput.profileLink,
      reason: parsedInput.reason,
      name: parsedInput.name
    });

    if (contactError) {
      throw new Error(`Failed to create contact: ${contactError.message}`);
    }

    if (parsedInput.circleIds && parsedInput.circleIds.length > 0) {
      const contactCircles = parsedInput.circleIds.map((circleId) => ({
        id: crypto.randomUUID(),
        created_at: createdAt,
        contact_id: id,
        circle_id: circleId,
        user_id: user.id
      }));

      const { error: circlesError } = await supabase
        .from('contacts_circles')
        .insert(contactCircles);

      if (circlesError) {
        throw new Error(`Failed to add contact to circles: ${circlesError.message}`);
      }
    }

    revalidatePath('/');
    return { id };
  });
