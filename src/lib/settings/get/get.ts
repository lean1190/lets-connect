'use server';

import { createDatabaseServerClient } from '@/lib/database/client/server';
import { ContactsListMode, type Settings, Theme } from '@/lib/settings/types';

const defaultSettings: Settings = {
  id: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_id: null,
  profile_image_url: null,
  theme: Theme.Light,
  qr_link: null,
  contacts_list_mode: ContactsListMode.Card,
  is_admin: false
};

export async function getSettings() {
  const supabase = await createDatabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return defaultSettings;
  }

  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!settings) {
    return defaultSettings;
  }

  return {
    ...defaultSettings,
    ...settings,
    theme: (settings.theme as Theme) ?? defaultSettings.theme,
    qr_link: settings.qr_link ?? defaultSettings.qr_link,
    contacts_list_mode:
      (settings.contacts_list_mode as ContactsListMode) ?? defaultSettings.contacts_list_mode
  } as Settings;
}

export async function getTheme() {
  const supabase = await createDatabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return defaultSettings;
  }

  const { data: settings } = await supabase
    .from('settings')
    .select('theme')
    .eq('user_id', user.id)
    .single();

  if (!settings) {
    return defaultSettings;
  }

  return {
    theme: (settings.theme as Theme) ?? defaultSettings.theme
  } as Settings;
}

export async function getContactsListMode() {
  const supabase = await createDatabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return defaultSettings;
  }

  const { data: settings } = await supabase
    .from('settings')
    .select('contacts_list_mode')
    .eq('user_id', user.id)
    .single();

  if (!settings) {
    return defaultSettings;
  }

  return {
    contacts_list_mode:
      (settings.contacts_list_mode as ContactsListMode) ?? defaultSettings.contacts_list_mode
  } as Settings;
}

export async function isAdmin() {
  const supabase = await createDatabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: settings } = await supabase
    .from('settings')
    .select('is_admin')
    .eq('user_id', user.id)
    .single();

  return !!settings?.is_admin;
}
