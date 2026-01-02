import z from 'zod';
import { ContactsListMode, Theme } from '../types';

export const updateSettingsSchema = z.object({
  theme: z.enum(Theme).optional(),
  qrLink: z.url().optional().nullable(),
  contactsListMode: z.enum(ContactsListMode).optional(),
  profileImageUrl: z.url().optional().nullable()
});

export type UpdateSettingsSchema = z.infer<typeof updateSettingsSchema>;
