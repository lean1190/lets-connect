import { IconCalendar, IconExternalLink } from '@tabler/icons-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import type { Event } from '@/lib/events/types';
import { cn } from '@/lib/utils';
import { isEventToday, isUpcomingEvent } from '../compare';
import { formatDateRange } from '../format';

type Props = {
  event: Event;
  index: number;
};

export function EventCard({ event, index }: Props) {
  const upcoming = isUpcomingEvent(event.starts_at);
  const today = isEventToday(event.starts_at);
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
                  {formatDateRange(event.starts_at, event.ends_at)}
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
