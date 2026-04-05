export const DATE_MONTHS =
  'January|February|March|April|May|June|July|August|September|October|November|December';

export const DATE_DAYS = 'Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday';

export function isValidDatePattern(dateRange: string): boolean {
  const trimmed = dateRange.trim();
  const isDatePattern =
    /^[A-Z][a-z]+\s+\d+/.test(trimmed) || /^[A-Z][a-z]+\s+\d+[–-]/.test(trimmed);
  const isRecurringPattern = /^Every\s+[A-Z][a-z]+/i.test(trimmed);
  return isDatePattern || isRecurringPattern;
}

export function cleanHtmlTags(text: string): string {
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
