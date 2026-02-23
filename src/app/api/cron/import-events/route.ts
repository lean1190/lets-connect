import type { NextRequest } from 'next/server';
import { sendImportResultEmail } from '@/lib/email/send-import-result';
import { runScheduledImport } from '@/lib/houston/events/found/run-scheduled-import';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { success, row } = await runScheduledImport();
    await sendImportResultEmail({ success, row });
    return Response.json({ success, row }, { status: success ? 200 : 500 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    await sendImportResultEmail({ success: false, errorMessage: message });
    return Response.json({ success: false, row: null }, { status: 500 });
  }
}
