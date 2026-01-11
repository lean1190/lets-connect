import { checkAuthenticatedOrThrow } from '@/lib/auth/errors/authentication';
import { createDatabaseServerClient } from '@/lib/database/client/server';
import { extractLinkedInProfileImage } from '@/lib/linkedin/user/extract';
import type { UpdateSettingsSchema } from './schema';

export async function updateSettings(update: UpdateSettingsSchema) {
  const supabase = await createDatabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!checkAuthenticatedOrThrow(user)) {
    return;
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
    profile_image_url?: string | null;
    updated_at: string;
  } = {
    updated_at: now
  };

  if (update.theme !== undefined) {
    updateData.theme = update.theme;
  }
  if (update.qrLink !== undefined) {
    updateData.qr_link = update.qrLink;
  }
  if (update.contactsListMode !== undefined) {
    updateData.contacts_list_mode = update.contactsListMode;
  }
  if (update.profileImageUrl !== undefined) {
    updateData.profile_image_url = update.profileImageUrl;
  }

  if (existingSettings) {
    const { error } = await supabase.from('settings').update(updateData).eq('user_id', user.id);

    if (error) {
      throw new Error(`Failed to update settings: ${error.message}`);
    }
  } else {
    const { error } = await supabase.from('settings').insert({
      user_id: user.id,
      created_at: now,
      ...updateData
    });

    if (error) {
      throw new Error(`Failed to create settings: ${error.message}`);
    }
  }
}

export async function updateProfilePictureUrl() {
  const supabase = await createDatabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const profileImageUrl = extractLinkedInProfileImage(user);

  if (!user || !profileImageUrl) {
    return;
  }

  try {
    await updateSettings({ profileImageUrl });
  } catch (error) {
    console.error('Failed to save profile image:', error);
  }
}
