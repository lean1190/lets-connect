'use client';

import { useRouter } from 'next/navigation';
import { EventsFilter } from '@/lib/houston/events/types';

type Props = {
  filter: EventsFilter;
};

const filterOptions: { value: EventsFilter; label: string }[] = [
  { value: EventsFilter.Upcoming, label: 'Upcoming events' },
  { value: EventsFilter.Past, label: 'Past events' }
];

export function EventsFilterDropdown({ filter }: Props) {
  const router = useRouter();

  const handleFilterChange = (newFilter: EventsFilter) => {
    const params = new URLSearchParams();
    params.set('filter', newFilter);
    router.replace(`/houston/events?${params.toString()}`);
  };

  return (
    <select
      value={filter}
      onChange={(e) => handleFilterChange(e.target.value as EventsFilter)}
      className="px-4 py-2 border border-input rounded-md text-sm font-medium text-foreground bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring hover:border-input/80 transition-colors"
    >
      {filterOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
