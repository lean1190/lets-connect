'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { ContactOutput, GroupOutput } from '@/lib/database/app-types';
import { getSupabaseClient } from '@/lib/database/client/isomorphic';
import { actionClient } from './client';

const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  profileLink: z.string().url('Invalid URL'),
  reason: z.string().min(1, 'Reason is required'),
  groupIds: z.array(z.uuid()).optional()
});

const updateContactSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).optional(),
  profileLink: z.string().url().optional(),
  reason: z.string().min(1).optional(),
  groupIds: z.array(z.uuid()).optional()
});

const deleteContactSchema = z.object({
  id: z.uuid()
});

export const createContact = actionClient
  .schema(createContactSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await getSupabaseClient();
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

    if (parsedInput.groupIds && parsedInput.groupIds.length > 0) {
      const contactGroups = parsedInput.groupIds.map((groupId) => ({
        id: crypto.randomUUID(),
        created_at: createdAt,
        contact_id: id,
        group_id: groupId,
        user_id: user.id
      }));

      const { error: groupsError } = await supabase.from('contacts_groups').insert(contactGroups);

      if (groupsError) {
        throw new Error(`Failed to add contact to groups: ${groupsError.message}`);
      }
    }

    revalidatePath('/');
    return { id };
  });

export const updateContact = actionClient
  .schema(updateContactSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await getSupabaseClient();
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

    if (parsedInput.groupIds !== undefined) {
      await supabase
        .from('contacts_groups')
        .delete()
        .eq('contact_id', parsedInput.id)
        .eq('user_id', user.id);

      if (parsedInput.groupIds.length > 0) {
        const contactGroups = parsedInput.groupIds.map((groupId) => ({
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          contact_id: parsedInput.id,
          group_id: groupId,
          user_id: user.id
        }));

        const { error: groupsError } = await supabase.from('contacts_groups').insert(contactGroups);

        if (groupsError) {
          throw new Error(`Failed to update contact groups: ${groupsError.message}`);
        }
      }
    }

    revalidatePath('/');
    revalidatePath(`/contacts/${parsedInput.id}`);
    return { success: true };
  });

export const deleteContact = actionClient
  .schema(deleteContactSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await getSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', parsedInput.id)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Failed to delete contact: ${error.message}`);
    }

    revalidatePath('/');
    return { success: true };
  });

export async function getContacts(): Promise<ContactOutput[]> {
  const supabase = await getSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !contacts) {
    return [];
  }

  const contactsWithGroups: ContactOutput[] = await Promise.all(
    contacts.map(async (contact) => {
      const { data: contactGroups } = await supabase
        .from('contacts_groups')
        .select('group_id')
        .eq('contact_id', contact.id)
        .eq('user_id', user.id);

      const groupIds =
        contactGroups?.map((cg) => cg.group_id).filter((id): id is string => id !== null) || [];
      let groups: GroupOutput[] = [];

      if (groupIds.length > 0) {
        const { data: groupData } = await supabase
          .from('groups')
          .select('id, name, created_at')
          .in('id', groupIds);

        groups =
          groupData?.map((g) => ({
            id: g.id,
            name: g.name,
            createdAt: g.created_at
          })) || [];
      }

      return {
        id: contact.id,
        name: contact.name,
        profileLink: contact.url || '',
        reason: contact.reason || '',
        dateAdded: contact.created_at,
        groups
      };
    })
  );

  return contactsWithGroups;
}

export async function getContactById(id: string) {
  const supabase = await getSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: contact, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !contact) {
    return null;
  }

  const { data: contactGroups } = await supabase
    .from('contacts_groups')
    .select('group_id')
    .eq('contact_id', id)
    .eq('user_id', user.id);

  const groupIds =
    contactGroups?.map((cg) => cg.group_id).filter((id): id is string => id !== null) || [];
  let groups: GroupOutput[] = [];

  if (groupIds.length > 0) {
    const { data: groupData } = await supabase
      .from('groups')
      .select('id, name, created_at')
      .in('id', groupIds);

    groups =
      groupData?.map((g) => ({
        id: g.id,
        name: g.name,
        createdAt: g.created_at
      })) || [];
  }

  return {
    ...contact,
    groups
  };
}
