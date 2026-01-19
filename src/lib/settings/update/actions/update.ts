'use server';

import { revalidatePath } from 'next/cache';
import { AppRoute } from '@/lib/constants/navigation';
import { actionClient } from '@/lib/server-actions/client';
import { updateSettingsSchema } from '../schema';
import { updateSettings } from '../update';

export const updateSettingsAction = actionClient
  .inputSchema(updateSettingsSchema)
  .action(async ({ parsedInput }) => {
    await updateSettings(parsedInput);

    revalidatePath(AppRoute.Settings);
    revalidatePath(AppRoute.MyQr);
    revalidatePath(AppRoute.Contacts);
    revalidatePath(AppRoute.Circles);
  });
