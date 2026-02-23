export enum EventsFilter {
  Upcoming = 'upcoming',
  Past = 'past'
}

export type WebsiteEventInput = {
  dateRange: string;
  name: string;
  description: string;
  url?: string;
};

export type ParsedEvent = {
  name: string;
  description: string;
  url?: string;
  starts_at: string;
  ends_at: string;
};
