'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { CircleOutput } from '@/lib/circles/types';
import { getSupabaseClient } from '@/lib/database/client/isomorphic';
import { actionClient } from './client';

const createCircleSchema = z.object({
  name: z.string().min(1, 'Circle name is required'),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable()
});

const updateCircleSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).optional(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable()
});

const deleteCircleSchema = z.object({
  id: z.uuid()
});

export const createCircle = actionClient
  .schema(createCircleSchema)
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

    const { error } = await supabase.from('circles').insert({
      id,
      created_at: now,
      name: parsedInput.name,
      color: parsedInput.color || null,
      description: parsedInput.description || null,
      icon: parsedInput.icon || null,
      updated_at: now,
      user_id: user.id
    });

    if (error) {
      throw new Error(`Failed to create circle: ${error.message}`);
    }

    revalidatePath('/circles');
    return { id };
  });

export const updateCircle = actionClient
  .schema(updateCircleSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await getSupabaseClient();
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
    return { success: true };
  });

export const deleteCircle = actionClient
  .schema(deleteCircleSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await getSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase
      .from('circles')
      .delete()
      .eq('id', parsedInput.id)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Failed to delete circle: ${error.message}`);
    }

    revalidatePath('/circles');
    return { success: true };
  });

export async function getCircles(): Promise<CircleOutput[]> {
  const supabase = await getSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: circles, error } = await supabase
    .from('circles')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !circles) {
    return [];
  }

  const circlesWithCounts: CircleOutput[] = await Promise.all(
    circles.map(async (circle) => {
      const { count } = await supabase
        .from('contacts_circles')
        .select('*', { count: 'exact', head: true })
        .eq('circle_id', circle.id)
        .eq('user_id', user.id);

      return {
        id: circle.id,
        name: circle.name,
        createdAt: circle.created_at,
        contactCount: count || 0,
        color: circle.color || null,
        description: circle.description || null,
        icon: circle.icon || null
      };
    })
  );

  return circlesWithCounts;
}

export async function getCircleById(id: string): Promise<CircleOutput | null> {
  const supabase = await getSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: circle, error } = await supabase
    .from('circles')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !circle) {
    return null;
  }

  const { count } = await supabase
    .from('contacts_circles')
    .select('*', { count: 'exact', head: true })
    .eq('circle_id', id)
    .eq('user_id', user.id);

  return {
    id: circle.id,
    name: circle.name,
    createdAt: circle.created_at,
    contactCount: count || 0,
    color: circle.color || null,
    description: circle.description || null,
    icon: circle.icon || null
  };
}

export async function getContactsInCircle(circleId: string) {
  const supabase = await getSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: contactCircles } = await supabase
    .from('contacts_circles')
    .select('contact_id')
    .eq('circle_id', circleId)
    .eq('user_id', user.id);

  if (!contactCircles || contactCircles.length === 0) {
    return [];
  }

  const contactIds = contactCircles
    .map((cc) => cc.contact_id)
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
