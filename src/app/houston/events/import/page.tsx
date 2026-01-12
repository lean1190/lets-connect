import { getLatestArchiveUrl } from '@/lib/houston/events/found/get-latest-url';
import { ImportEventsPageClient } from './page-client';

export default async function ImportEventsPage() {
  const initialUrl: string | null = (await getLatestArchiveUrl()) ?? null;

  return <ImportEventsPageClient initialUrl={initialUrl} />;
}
