import { UTCDate } from '@date-fns/utc';
import { addDays, format } from 'date-fns';
import type { ParseStrategy, WebsiteEventInput } from '../types';
import { cleanHtmlTags } from './shared';

const LUMA_BASE_URL = 'https://luma.com';
const MONTH_ABBREVIATIONS: Record<string, string> = {
  jan: 'January',
  feb: 'February',
  mar: 'March',
  apr: 'April',
  may: 'May',
  jun: 'June',
  jul: 'July',
  aug: 'August',
  sep: 'September',
  oct: 'October',
  nov: 'November',
  dec: 'December'
};

const TIMELINE_MARKER = 'class="timeline">';
const SECTION_SPLIT = /(?=<div[^>]*timeline-section)/;
const CARD_SPLIT = /(?=<div[^>]*card-wrapper)/;

type LumaJsonLdEvent = {
  url?: string;
  startDate?: string;
};

const isShimmerContent = (value: string): boolean =>
  value.includes('shimmer') || value.length === 0;

const normalizeLumaDateLabel = (dateLabel: string): string => {
  const trimmed = cleanHtmlTags(dateLabel).trim();
  const today = new UTCDate();

  return trimmed === 'Today'
    ? format(today, 'MMMM d')
    : trimmed === 'Tomorrow'
      ? format(addDays(today, 1), 'MMMM d')
      : (() => {
          const abbrevMatch = trimmed.match(/^([A-Za-z]{3})\s+(\d{1,2})$/);
          return abbrevMatch
            ? `${MONTH_ABBREVIATIONS[abbrevMatch[1].toLowerCase()] ?? abbrevMatch[1]} ${abbrevMatch[2]}`
            : trimmed;
        })();
};

const buildLumaDateLookup = (html: string): Map<string, string> => {
  const lookup = new Map<string, string>();
  const scripts = html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g);

  for (const script of scripts) {
    try {
      const data = JSON.parse(script[1] ?? '') as {
        '@type'?: string;
        itemListElement?: { item?: LumaJsonLdEvent }[];
      };

      if (data['@type'] !== 'ItemList' || !data.itemListElement) continue;

      for (const listItem of data.itemListElement) {
        const event = listItem.item;
        const eventUrl = event?.url;
        const startDate = event?.startDate;
        if (!eventUrl || !startDate) continue;

        const slug = eventUrl.replace(`${LUMA_BASE_URL}/`, '');
        const parsedDate = new UTCDate(startDate);
        lookup.set(slug, format(parsedDate, 'MMMM d'));
      }
    } catch {}
  }

  return lookup;
};

const extractSectionDate = (sectionHtml: string): string | null => {
  const dateMatch = sectionHtml.match(/class="[^"]*\bdate\b[^"]*"[^>]*>([\s\S]*?)<\/div>/);
  if (!dateMatch?.[1] || isShimmerContent(dateMatch[1])) return null;
  return normalizeLumaDateLabel(dateMatch[1]);
};

const extractEventTime = (cardHtml: string): string | null => {
  const timeMatch = cardHtml.match(
    /class="event-time[^"]*"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/
  );
  const time = timeMatch?.[1]?.trim();
  return time && !isShimmerContent(time) ? time : null;
};

const extractEventName = (cardHtml: string): string | null => {
  const linkMatch = cardHtml.match(
    /class="event-link[^"]*"[^>]*href="\/[^"]+"[^>]*aria-label="([^"]*)"/
  );
  const h3Match = cardHtml.match(/<h3[^>]*>([^<]+)<\/h3>/);
  const name = cleanHtmlTags(h3Match?.[1] ?? linkMatch?.[1] ?? '').trim();
  return name.length > 0 ? name : null;
};

const extractEventSlug = (cardHtml: string): string | null => {
  const linkMatch = cardHtml.match(/class="event-link[^"]*"[^>]*href="\/([^"]+)"/);
  return linkMatch?.[1] ?? null;
};

const extractHost = (cardHtml: string): string | null => {
  const hostMatch = cardHtml.match(/nowrap">By\s+([^<]+)</);
  const host = hostMatch?.[1] ? cleanHtmlTags(hostMatch[1]).trim() : '';
  return host.length > 0 ? `By ${host}` : null;
};

const extractLocation = (cardHtml: string): string | null => {
  const locationMatch = cardHtml.match(
    /M2 6\.854[\s\S]*?<\/svg>[\s\S]*?<div[^>]*text-ellipses[^>]*>([^<]+)</
  );
  const location = locationMatch?.[1] ? cleanHtmlTags(locationMatch[1]).trim() : '';
  return location.length > 0 ? location : null;
};

const extractCategory = (cardHtml: string): string | null => {
  const pillMatch = cardHtml.match(/pill-label[^>]*>([^<]+)</);
  const category = pillMatch?.[1] ? cleanHtmlTags(pillMatch[1]).trim() : '';
  return category.length > 0 ? category : null;
};

const buildDescription = ({
  time,
  location,
  host,
  category
}: {
  time: string | null;
  location: string | null;
  host: string | null;
  category: string | null;
}): string => {
  const timePrefix = time ? `${time} at ` : '';
  const locationPart = location ? `${timePrefix}${location}` : time;
  const hostPart = host ?? '';
  const categorySuffix = category ? `. ${category}` : '';

  return locationPart && hostPart
    ? `${locationPart} — ${hostPart}${categorySuffix}`
    : locationPart
      ? `${locationPart}${categorySuffix}`
      : hostPart
        ? `${hostPart}${categorySuffix}`
        : (category ?? '');
};

const parseCard = (
  cardHtml: string,
  sectionDate: string | null,
  dateLookup: Map<string, string>
): WebsiteEventInput | null => {
  const slug = extractEventSlug(cardHtml);
  const name = extractEventName(cardHtml);
  if (!slug || !name) return null;

  const dateRange = sectionDate ?? dateLookup.get(slug) ?? null;
  if (!dateRange) return null;

  const description = buildDescription({
    time: extractEventTime(cardHtml),
    location: extractLocation(cardHtml),
    host: extractHost(cardHtml),
    category: extractCategory(cardHtml)
  });

  if (!description) return null;

  return {
    dateRange,
    name,
    description,
    url: `${LUMA_BASE_URL}/${slug}`
  };
};

export const parseLumaTimeline: ParseStrategy = (html: string) => {
  if (!html.includes(TIMELINE_MARKER)) return [];

  const timelineMatch = html.match(/class="timeline">([\s\S]*)/);
  if (!timelineMatch?.[1]) return [];

  const dateLookup = buildLumaDateLookup(html);
  const sections = timelineMatch[1]
    .split(SECTION_SPLIT)
    .filter((part) => part.includes('timeline-section'));
  const events: WebsiteEventInput[] = [];

  for (const sectionHtml of sections) {
    const sectionDate = extractSectionDate(sectionHtml);
    const cards = sectionHtml.split(CARD_SPLIT).filter((part) => part.includes('card-wrapper'));

    for (const cardHtml of cards) {
      const event = parseCard(cardHtml, sectionDate, dateLookup);
      if (event) events.push(event);
    }
  }

  return events;
};
