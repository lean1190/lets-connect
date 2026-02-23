import { UTCDate } from '@date-fns/utc';
import { addDays } from 'date-fns';
import { parseDateRange } from '@/lib/dates/parse';
import type { WebsiteEventInput } from './types';

function isValidDatePattern(dateRange: string): boolean {
  const trimmed = dateRange.trim();
  const isDatePattern =
    /^[A-Z][a-z]+\s+\d+/.test(trimmed) || /^[A-Z][a-z]+\s+\d+[–-]/.test(trimmed);
  const isRecurringPattern = /^Every\s+[A-Z][a-z]+/i.test(trimmed);
  return isDatePattern || isRecurringPattern;
}

function cleanHtmlTags(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseRecurringEvent(dateRange: string): { starts_at: string; ends_at: string } {
  const dayMap: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
  };

  const match = dateRange.match(/^Every\s+([A-Z][a-z]+)/i);
  if (!match) {
    throw new Error(`Invalid recurring event pattern: ${dateRange}`);
  }

  const dayName = match[1]?.toLowerCase() ?? '';
  const targetDay = dayMap[dayName];

  if (targetDay === undefined) {
    throw new Error(`Unknown day: ${dayName}`);
  }

  const now = new Date();
  const todayUTC = new UTCDate(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const currentDay = todayUTC.getUTCDay();
  let daysUntilNext = (targetDay - currentDay + 7) % 7;
  if (daysUntilNext === 0) {
    daysUntilNext = 7;
  }

  const nextOccurrence = addDays(todayUTC, daysUntilNext);

  return {
    starts_at: nextOccurrence.toISOString(),
    ends_at: nextOccurrence.toISOString()
  };
}

export function parseEventDate(
  dateRange: string,
  baseYear: number = new Date().getFullYear()
): { starts_at: string; ends_at: string } {
  if (/^Every\s+[A-Z][a-z]+/i.test(dateRange)) {
    return parseRecurringEvent(dateRange);
  }
  return parseDateRange(dateRange, baseYear);
}

const DATE_MONTHS =
  'January|February|March|April|May|June|July|August|September|October|November|December';
const DATE_DAYS = 'Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday';
const NEW_FORMAT_EVENT_REGEX = new RegExp(
  `((${DATE_MONTHS})\\s+\\d+(?:-\\d+)?:?|Every\\s+(?:${DATE_DAYS}):?)(?:\\s|</[^>]+>|<br\\s*/?>)*<a[^>]+href=["']([^"']+)["'][^>]*>([\\s\\S]*?)<\\/a>\\s*\\([^)]+\\)\\s*[—–-]\\s*([^<]+)`,
  'gi'
);

function parseLegacyFormat(html: string): WebsiteEventInput[] {
  const events: WebsiteEventInput[] = [];
  const eventDivPattern =
    /<div[^>]*style="[^"]*padding-bottom:\s*\d+px[^"]*padding-left:\s*\d+px[^"]*padding-right:\s*\d+px[^"]*padding-top:\s*\d+px[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
  let divMatch: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: Required for regex exec loop
  while ((divMatch = eventDivPattern.exec(html)) !== null) {
    const divContent = divMatch[1] ?? '';

    const dateMatch = divContent.match(/<span[^>]*>\s*<b[^>]*>([^<]+?):?\s*<\/b>\s*<\/span>/i);
    if (!dateMatch?.[1]) continue;

    const dateRange = cleanHtmlTags(dateMatch[1]).trim();
    if (!isValidDatePattern(dateRange)) continue;

    const linkMatch = divContent.match(
      /<span[^>]*>\s*<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>\s*<\/span>/i
    );
    if (!linkMatch?.[2]) continue;

    const name = cleanHtmlTags(linkMatch[2]).trim();
    const url = linkMatch[1]?.includes('foundhamburg.com') ? undefined : linkMatch[1];

    const spans = divContent.match(/<span[^>]*>([\s\S]*?)<\/span>/gi);
    if (!spans) continue;

    let description = '';
    for (const span of spans) {
      const spanText = cleanHtmlTags(span);
      if (!spanText || spanText.trim() === '' || spanText.trim() === '&nbsp;') continue;
      const descMatch = spanText.match(/\s*\([^)]+\)\s*[—–-]\s*(.+)/);
      if (descMatch?.[1]) {
        description = descMatch[1].trim();
        break;
      }
    }

    if (!description) {
      const paragraphMatch = divContent.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      if (paragraphMatch?.[1]) {
        const pText = cleanHtmlTags(paragraphMatch[1]);
        const remaining = pText
          .replace(`${dateRange}:`, '')
          .replace(`${dateRange}`, '')
          .replace(name, '')
          .trim();
        const descMatch = remaining.match(/[—–-]\s*(.+)/);
        if (descMatch?.[1]) {
          description = descMatch[1].trim();
        } else {
          description = remaining.replace(/^\s*\([^)]+\)\s*/, '').trim();
        }
      }
    }

    if (name && description) {
      events.push({ dateRange, name, description, url });
    }
  }
  return events;
}

function parseNewFormat(html: string): WebsiteEventInput[] {
  const events: WebsiteEventInput[] = [];
  let match: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: Required for regex exec loop
  while ((match = NEW_FORMAT_EVENT_REGEX.exec(html)) !== null) {
    const dateRange = cleanHtmlTags(match[1]).trim().replace(/:$/, '');
    if (!isValidDatePattern(dateRange)) continue;

    const url = match[3]?.includes('foundhamburg.com') ? undefined : match[3];
    const name = cleanHtmlTags(match[4] ?? '').trim();
    const description = (match[5] ?? '').trim();

    if (name && description) {
      events.push({ dateRange, name, description, url });
    }
  }
  return events;
}

function mergeEvents(
  legacy: WebsiteEventInput[],
  fromNew: WebsiteEventInput[]
): WebsiteEventInput[] {
  const key = (e: WebsiteEventInput) => `${e.dateRange}|${e.name}`;
  const seen = new Set(legacy.map(key));
  const merged = [...legacy];
  for (const e of fromNew) {
    if (!seen.has(key(e))) {
      seen.add(key(e));
      merged.push(e);
    }
  }
  return merged;
}

export function parseHtmlToEvents(html: string): WebsiteEventInput[] {
  const legacy = parseLegacyFormat(html);
  const fromNew = parseNewFormat(html);
  return mergeEvents(legacy, fromNew);
}
