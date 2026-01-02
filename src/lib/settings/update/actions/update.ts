'use server';

import { revalidatePath } from 'next/cache';
import { actionClient } from '../../../server-actions/client';
import { updateSettingsSchema } from '../schema';
import { updateSettings } from '../update';

export const updateSettingsAction = actionClient
  .inputSchema(updateSettingsSchema)
  .action(async ({ parsedInput }) => {
    await updateSettings(parsedInput);

    revalidatePath('/settings');
    revalidatePath('/my-qr');
    revalidatePath('/contacts');
    revalidatePath('/circles');
  });
