import type { ParseStrategy, WebsiteEventInput } from '../types';
import { cleanHtmlTags, DATE_DAYS, DATE_MONTHS, isValidDatePattern } from './shared';

const DREAM_POST_CONTENT_PARAGRAPH =
  /<p\b[^>]*\bdream-post-content-paragraph\b[^>]*>([\s\S]*?)<\/p>/gi;

const STRONG_LEAD_DATE = new RegExp(
  `<strong>\\s*((?:${DATE_MONTHS})\\s+\\d+(?:-\\d+)?|Every\\s+(?:${DATE_DAYS}))\\s*<\\/strong>`,
  'i'
);

export const parseDreamPostContentParagraph: ParseStrategy = (html: string) => {
  const events: WebsiteEventInput[] = [];
  let block: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: Required for regex exec loop
  while ((block = DREAM_POST_CONTENT_PARAGRAPH.exec(html)) !== null) {
    const inner = block[1] ?? '';
    const dateMatch = inner.match(STRONG_LEAD_DATE);
    if (!dateMatch?.[1]) continue;

    const dateRange = cleanHtmlTags(dateMatch[1]).trim().replace(/:$/, '');
    if (!isValidDatePattern(dateRange)) continue;

    const linkMatch = inner.match(/<a[^>]+\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
    if (!linkMatch?.[2]) continue;

    const rawHref = linkMatch[1] ?? '';
    const url = rawHref.includes('foundhamburg.com') ? undefined : rawHref;
    const name = cleanHtmlTags(linkMatch[2]).trim();
    if (!name) continue;

    const afterAnchor = inner.slice((linkMatch.index ?? 0) + (linkMatch[0]?.length ?? 0));
    const descMatch = afterAnchor.match(/\([^)]+\)\s*[—–-]\s*([^<]+)/);
    const description = descMatch?.[1] ? cleanHtmlTags(descMatch[1]).trim() : '';
    if (!description) continue;

    events.push({ dateRange, name, description, url });
  }
  return events;
};
