import { foundHamburgEventsUrl } from '@/lib/constants/links';
import { ImportEventsPageClient } from './page-client';

export default function ImportEventsPage() {
  return <ImportEventsPageClient initialUrl={foundHamburgEventsUrl} />;
}
