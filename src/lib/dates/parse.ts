import { createUTCDate } from './create';

const monthMap: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11
};

export function parseDateRange(
  dateRange: string,
  baseYear: number = new Date().getFullYear()
): { starts_at: string; ends_at: string } {
  const trimmed = dateRange.trim();
  const rangeMatch = trimmed.match(/^(.+?)(?<!\s)[–-](?!\s)(.+)$/);
  const startPart = rangeMatch ? rangeMatch[1].trim() : trimmed;
  const endPart = rangeMatch ? rangeMatch[2].trim() : undefined;

  const startMatch = startPart.match(/^([a-z]+)\s+(-?\d+)$/i);
  if (!startMatch) {
    throw new Error(`Unable to parse start date: ${dateRange}`);
  }

  const startMonthName = startMatch[1]?.toLowerCase() ?? '';
  const startDay = Number.parseInt(startMatch[2] ?? '0', 10);
  const startMonth = monthMap[startMonthName];

  if (startMonth === undefined) {
    throw new Error(`Unknown month: ${startMonthName}`);
  }

  if (Number.isNaN(startDay) || startDay < 1 || startDay > 31) {
    throw new Error(`Invalid day: ${startDay}`);
  }

  const startDate = createUTCDate(baseYear, startMonth, startDay);

  let endDate: Date;
  if (endPart) {
    const endMatch = endPart.match(/^([a-z]+)\s+(-?\d+)$/i);
    if (endMatch) {
      const endMonthName = endMatch[1]?.toLowerCase() ?? '';
      const endDay = Number.parseInt(endMatch[2] ?? '0', 10);
      const endMonth = monthMap[endMonthName];

      if (endMonth === undefined) {
        throw new Error(`Unknown month: ${endMonthName}`);
      }

      if (Number.isNaN(endDay) || endDay < 1 || endDay > 31) {
        throw new Error(`Invalid day: ${endDay}`);
      }

      endDate = createUTCDate(baseYear, endMonth, endDay);
    } else {
      const endDay = Number.parseInt(endPart, 10);
      if (Number.isNaN(endDay) || endDay < 1 || endDay > 31) {
        throw new Error(`Invalid end day: ${endPart}`);
      }
      endDate = createUTCDate(baseYear, startMonth, endDay);
    }
  } else {
    endDate = new Date(startDate);
  }

  return {
    starts_at: startDate.toISOString(),
    ends_at: endDate.toISOString()
  };
}
