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
