import { ImportResultEmail } from '@/emails/import-result-email';
import type { Tables } from '@/lib/database/types';
import { createResendClient } from '@/lib/email/client';
import { cronImportNotifyTo, emailFrom, subjects } from '@/lib/email/config';

type EventImportRow = Tables<'event_imports'>;

export async function sendImportResultEmail({
  success,
  row,
  errorMessage
}: {
  success: boolean;
  row?: EventImportRow | null;
  errorMessage?: string | null;
}) {
  const resend = createResendClient();
  const { error } = await resend.emails.send({
    from: emailFrom,
    to: cronImportNotifyTo,
    subject: subjects.import,
    react: ImportResultEmail({
      success,
      row: row ?? null,
      errorMessage: errorMessage ?? null
    })
  });
  if (error) throw new Error(`Failed to send import result email: ${error.message}`);
}
