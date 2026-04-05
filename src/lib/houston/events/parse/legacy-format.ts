import type { ParseStrategy, WebsiteEventInput } from '../types';
import { cleanHtmlTags, isValidDatePattern } from './shared';

export const parseLegacyFormat: ParseStrategy = (html: string) => {
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
};
