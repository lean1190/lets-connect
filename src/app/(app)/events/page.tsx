import { getEvents } from '@/lib/events/get';
import PageWithNavigationLayout from '../components/page-with-navigation-layout';
import { categorizeEvents } from './categorize';
import { EventSection } from './components/event-section';
import { EventsEmptyState } from './components/events-empty-state';
import { EventsHero } from './components/events-hero';

export default async function EventsPage() {
  const events = await getEvents();
  const { thisWeek, thisMonth, nextMonth, upcoming } = categorizeEvents(events);

  const hasAnyEvents =
    thisWeek.length > 0 || thisMonth.length > 0 || nextMonth.length > 0 || upcoming.length > 0;

  return (
    <PageWithNavigationLayout title="Events">
      <EventsHero />

      <div className="space-y-8">
        {!hasAnyEvents ? (
          <EventsEmptyState />
        ) : (
          <>
            <EventSection title="This week" events={thisWeek} />
            <EventSection title="This month" events={thisMonth} />
            <EventSection title="Next month" events={nextMonth} />
            <EventSection title="Upcoming" events={upcoming} />
          </>
        )}
      </div>
    </PageWithNavigationLayout>
  );
}
