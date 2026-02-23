import type { NextRequest } from 'next/server';
import { runScheduledImport } from '@/lib/houston/events/found/actions/run-scheduled-import';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { ok, error } = await runScheduledImport();
  if (!ok) {
    return Response.json({ ok: false, error }, { status: 500 });
  }
  return Response.json({ ok: true });
}
