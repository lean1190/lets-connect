'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSupabaseClient } from '@/lib/database/client/isomorphic';
import { actionClient } from './client';

const updateSettingsSchema = z.object({
  theme: z.enum(['light', 'dark']).optional(),
  qrLink: z.string().url().optional().nullable()
});

export const updateSettings = actionClient
  .schema(updateSettingsSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await getSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from('settings')
      .select('id')
      .eq('user_id', user.id)
      .single();

    const now = new Date().toISOString();
    const updateData: {
      theme?: string | null;
      qr_link?: string | null;
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
    return { success: true };
  });

export async function getSettings() {
  const supabase = await getSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { theme: 'light' as const, qrLink: null };
  }

  const { data: settings } = await supabase
    .from('settings')
    .select('theme, qr_link')
    .eq('user_id', user.id)
    .single();

  return {
    theme: (settings?.theme as 'light' | 'dark') || 'light',
    qrLink: settings?.qr_link || null
  };
}
