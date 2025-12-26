'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { GroupOutput } from '@/lib/database/app-types';
import { getSupabaseClient } from '@/lib/database/client/isomorphic';
import { actionClient } from './client';

const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required')
});

const updateGroupSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1)
});

const deleteGroupSchema = z.object({
  id: z.uuid()
});

export const createGroup = actionClient
  .schema(createGroupSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await getSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const { error } = await supabase.from('groups').insert({
      id,
      created_at: now,
      name: parsedInput.name,
      updated_at: now,
      user_id: user.id
    });

    if (error) {
      throw new Error(`Failed to create group: ${error.message}`);
    }

    revalidatePath('/groups');
    return { id };
  });

export const updateGroup = actionClient
  .schema(updateGroupSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await getSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase
      .from('groups')
      .update({
        name: parsedInput.name,
        updated_at: new Date().toISOString()
      })
      .eq('id', parsedInput.id)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Failed to update group: ${error.message}`);
    }

    revalidatePath('/groups');
    revalidatePath(`/groups/${parsedInput.id}`);
    return { success: true };
  });

export const deleteGroup = actionClient
  .schema(deleteGroupSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await getSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', parsedInput.id)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Failed to delete group: ${error.message}`);
    }

    revalidatePath('/groups');
    return { success: true };
  });

export async function getGroups(): Promise<GroupOutput[]> {
  const supabase = await getSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: groups, error } = await supabase
    .from('groups')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true });

  if (error || !groups) {
    return [];
  }

  const groupsWithCounts: GroupOutput[] = await Promise.all(
    groups.map(async (group) => {
      const { count } = await supabase
        .from('contacts_groups')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', group.id)
        .eq('user_id', user.id);

      return {
        id: group.id,
        name: group.name,
        createdAt: group.created_at,
        contactCount: count || 0
      };
    })
  );

  return groupsWithCounts;
}

export async function getGroupById(id: string): Promise<GroupOutput | null> {
  const supabase = await getSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: group, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !group) {
    return null;
  }

  const { count } = await supabase
    .from('contacts_groups')
    .select('*', { count: 'exact', head: true })
    .eq('group_id', id)
    .eq('user_id', user.id);

  return {
    id: group.id,
    name: group.name,
    createdAt: group.created_at,
    contactCount: count || 0
  };
}

export async function getContactsInGroup(groupId: string) {
  const supabase = await getSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: contactGroups } = await supabase
    .from('contacts_groups')
    .select('contact_id')
    .eq('group_id', groupId)
    .eq('user_id', user.id);

  if (!contactGroups || contactGroups.length === 0) {
    return [];
  }

  const contactIds = contactGroups
    .map((cg) => cg.contact_id)
    .filter((id): id is string => id !== null);

  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .in('id', contactIds)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !contacts) {
    return [];
  }

  return contacts.map((contact) => ({
    id: contact.id,
    name: contact.name,
    profileLink: contact.url,
    reason: contact.reason,
    dateAdded: contact.created_at
  }));
}
