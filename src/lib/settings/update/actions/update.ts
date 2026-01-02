'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSupabaseClient } from '@/lib/database/client/isomorphic';
import { ContactsListMode, Theme } from '@/lib/settings/types';
import { actionClient } from '../../../server-actions/client';

const updateSettingsSchema = z.object({
  theme: z.enum(Theme).optional(),
  qrLink: z.url().optional().nullable(),
  contactsListMode: z.enum(ContactsListMode).optional()
});

export const updateSettings = actionClient
  .inputSchema(updateSettingsSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await getSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const { data: existingSettings } = await supabase
      .from('settings')
      .select('id')
      .eq('user_id', user.id)
      .single();

    const now = new Date().toISOString();
    const updateData: {
      theme?: string | null;
      qr_link?: string | null;
      contacts_list_mode?: string | null;
      updated_at: string;
    } = {
      updated_at: now
    };

    if (parsedInput.theme !== undefined) {
      updateData.theme = parsedInput.theme;
    }
    if (parsedInput.qrLink !== undefined) {
      updateData.qr_link = parsedInput.qrLink;
    }
    if (parsedInput.contactsListMode !== undefined) {
      updateData.contacts_list_mode = parsedInput.contactsListMode;
    }

    if (existingSettings) {
      // Update existing settings
      const { error } = await supabase.from('settings').update(updateData).eq('user_id', user.id);

      if (error) {
        throw new Error(`Failed to update settings: ${error.message}`);
      }
    } else {
      // Create new settings
      const { error } = await supabase.from('settings').insert({
        user_id: user.id,
        created_at: now,
        ...updateData
      });

      if (error) {
        throw new Error(`Failed to create settings: ${error.message}`);
      }
    }

    revalidatePath('/settings');
    revalidatePath('/my-qr');
    revalidatePath('/contacts');
    revalidatePath('/circles');
  });
