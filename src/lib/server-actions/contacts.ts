'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { CircleOutput, ContactOutput } from '@/lib/database/app-types';
import { getSupabaseClient } from '@/lib/database/client/isomorphic';
import { actionClient } from './client';

const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  profileLink: z.string().url('Invalid URL'),
  reason: z.string().min(1, 'Reason is required'),
  circleIds: z.array(z.uuid()).optional()
});

const updateContactSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).optional(),
  profileLink: z.string().url().optional(),
  reason: z.string().min(1).optional(),
  circleIds: z.array(z.uuid()).optional()
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

  const contactsWithCircles: ContactOutput[] = await Promise.all(
    contacts.map(async (contact) => {
      const { data: contactCircles } = await supabase
        .from('contacts_circles')
        .select('circle_id')
        .eq('contact_id', contact.id)
        .eq('user_id', user.id);

      const circleIds =
        contactCircles?.map((cc) => cc.circle_id).filter((id): id is string => id !== null) || [];
      let circles: CircleOutput[] = [];

      if (circleIds.length > 0) {
        const { data: circleData } = await supabase
          .from('circles')
          .select('id, name, created_at')
          .in('id', circleIds);

        circles =
          circleData?.map((c) => ({
            id: c.id,
            name: c.name,
            createdAt: c.created_at
          })) || [];
      }

      return {
        id: contact.id,
        name: contact.name,
        profileLink: contact.url || '',
        reason: contact.reason || '',
        dateAdded: contact.created_at,
        circles
      };
    })
  );

  return contactsWithCircles;
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

  const { data: contactCircles } = await supabase
    .from('contacts_circles')
    .select('circle_id')
    .eq('contact_id', id)
    .eq('user_id', user.id);

  const circleIds =
    contactCircles?.map((cc) => cc.circle_id).filter((id): id is string => id !== null) || [];
  let circles: CircleOutput[] = [];

  if (circleIds.length > 0) {
    const { data: circleData } = await supabase
      .from('circles')
      .select('id, name, created_at')
      .in('id', circleIds);

    circles =
      circleData?.map((c) => ({
        id: c.id,
        name: c.name,
        createdAt: c.created_at
      })) || [];
  }

  return {
    ...contact,
    circles
  };
}
