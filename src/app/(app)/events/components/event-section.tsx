import type { Event } from '@/lib/events/types';
import { EventCard } from './event-card';

type Props = {
  title: string;
  events: Event[];
};

export function EventSection({ title, events }: Props) {
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
