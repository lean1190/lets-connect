import { isSameDay, isSameYear } from 'date-fns';
import { format } from 'date-fns/format';

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d, yyyy');
}

export function formatDateRange(startsAt: string, endsAt: string): string {
  const startDate = new Date(startsAt);
  const endDate = new Date(endsAt);

  if (isSameDay(startDate, endDate)) {
    return formatDate(startsAt);
  }

  const startFormatted = format(startDate, 'MMM d');
  const endFormatted = format(endDate, 'MMM d, yyyy');

  if (isSameYear(startDate, endDate)) {
    return `${startFormatted} - ${endFormatted}`;
  }

  const startWithYear = format(startDate, 'MMM d, yyyy');
  return `${startWithYear} - ${endFormatted}`;
}
