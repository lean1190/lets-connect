import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { IconCalendar, IconExternalLink } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { foundNewsletterUrl } from '@/lib/constants/links';
import { cn } from '@/lib/utils';
import PageWithNavigationLayout from '../components/page-with-navigation-layout';

interface Event {
  date: string;
  dateParsed: string | null;
  name: string;
  url: string;
  description: string;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function isUpcoming(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const eventDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
}

function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const eventDate = new Date(dateStr);
  eventDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate.getTime() === today.getTime();
}

function getEvents(): Event[] {
  try {
    const filePath = join(process.cwd(), 'scripts', 'events.json');
    const fileContents = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents) as Event[];
  } catch {
    return [];
  }
}

function categorizeEvents(events: Event[]): {
  thisWeek: Event[];
  thisMonth: Event[];
  nextMonth: Event[];
  upcoming: Event[];
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);

  const endOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  endOfThisMonth.setHours(23, 59, 59, 999);

  const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  startOfNextMonth.setHours(0, 0, 0, 0);

  const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
  endOfNextMonth.setHours(23, 59, 59, 999);

  const thisWeek: Event[] = [];
  const thisMonth: Event[] = [];
  const nextMonth: Event[] = [];
  const upcoming: Event[] = [];

  for (const event of events) {
    if (!event.dateParsed) continue;

    const eventDate = new Date(event.dateParsed);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate < today) continue;

    if (eventDate <= endOfWeek) {
      thisWeek.push(event);
    } else if (eventDate <= endOfThisMonth) {
      thisMonth.push(event);
    } else if (eventDate >= startOfNextMonth && eventDate <= endOfNextMonth) {
      nextMonth.push(event);
    } else {
      upcoming.push(event);
    }
  }

  // Sort each category by date
  const sortByDate = (a: Event, b: Event) => {
    if (!a.dateParsed || !b.dateParsed) return 0;
    return new Date(a.dateParsed).getTime() - new Date(b.dateParsed).getTime();
  };

  thisWeek.sort(sortByDate);
  thisMonth.sort(sortByDate);
  nextMonth.sort(sortByDate);
  upcoming.sort(sortByDate);

  return { thisWeek, thisMonth, nextMonth, upcoming };
}

function EventCard({ event, index }: { event: Event; index: number }) {
  const upcoming = isUpcoming(event.dateParsed);
  const today = isToday(event.dateParsed);
  return (
    <Card
      key={index}
      className={cn(
        'hover:shadow-lg transition-all duration-200 border-l-4',
        today
          ? 'border-l-primary border-2 border-primary'
          : upcoming
            ? 'border-l-primary hover:border-l-primary/80'
            : 'border-l-muted-foreground/30'
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-3">
              <CardTitle className="text-lg leading-tight flex-1">{event.name}</CardTitle>
              {today && (
                <span className="px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-md shrink-0">
                  Today!
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div
                className={cn(
                  'flex items-center gap-2 px-2 py-1 rounded-md',
                  upcoming ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                )}
              >
                <IconCalendar className="h-4 w-4" />
                <span className="font-medium">
                  {event.dateParsed ? formatDate(event.dateParsed) : event.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      {event.description && (
        <CardContent>
          <CardDescription className="text-sm leading-relaxed">{event.description}</CardDescription>
        </CardContent>
      )}
      <CardFooter className="pt-4">
        <Link
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline transition-colors"
        >
          Learn more
          <IconExternalLink className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}

function EventSection({ title, events }: { title: string; events: Event[] }) {
  if (events.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <div className="space-y-4">
        {events.map((event, index) => (
          <EventCard key={index} event={event} index={index} />
        ))}
      </div>
    </div>
  );
}

export default async function EventsPage() {
  const events = getEvents();
  const { thisWeek, thisMonth, nextMonth, upcoming } = categorizeEvents(events);

  const hasAnyEvents =
    thisWeek.length > 0 || thisMonth.length > 0 || nextMonth.length > 0 || upcoming.length > 0;

  return (
    <PageWithNavigationLayout title="Events">
      {/* Hero Image */}
      <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-6">
        <Link
          href="https://www.foundhamburg.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full hover:opacity-90 transition-opacity"
        >
          <Image
            src="/found.png"
            alt="found Hamburg"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </Link>
        <div className="absolute top-3 left-3 text-xs text-white/80 font-medium">Powered by</div>
        <Link
          href={foundNewsletterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3"
        >
          <Button size="xs" variant="secondary">
            Subscribe
          </Button>
        </Link>
      </div>

      {/* Events List */}
      <div className="space-y-8">
        {!hasAnyEvents ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <IconCalendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No events available</p>
              </div>
            </CardContent>
          </Card>
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
