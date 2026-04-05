import type { ParseStrategy, WebsiteEventInput } from '../types';
import { cleanHtmlTags, DATE_DAYS, DATE_MONTHS, isValidDatePattern } from './shared';

const NEW_FORMAT_DATE_TO_LINK_GAP =
  '(?:\\s|</[^>]+>|<br\\b[^>]*>|<(?:span|strong|div|p|em|b)\\b[^>]*>)+';

const NEW_FORMAT_EVENT_REGEX = new RegExp(
  `((${DATE_MONTHS})\\s+\\d+(?:-\\d+)?:?|Every\\s+(?:${DATE_DAYS}):?)${NEW_FORMAT_DATE_TO_LINK_GAP}<a[^>]+href=["']([^"']+)["'][^>]*>([\\s\\S]*?)<\\/a>\\s*\\([^)]+\\)\\s*[—–-]\\s*([^<]+)`,
  'gi'
);

export const parseNewFormat: ParseStrategy = (html: string) => {
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
};
