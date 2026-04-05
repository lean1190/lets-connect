import type { WebsiteEventInput } from '../types';

export function mergeUniqueEvents(
  accumulated: WebsiteEventInput[],
  next: WebsiteEventInput[]
): WebsiteEventInput[] {
  const eventKey = (e: WebsiteEventInput) => `${e.dateRange}|${e.name}`;
  const seen = new Set(accumulated.map(eventKey));
  const merged = [...accumulated];
  for (const e of next) {
    const k = eventKey(e);
    if (!seen.has(k)) {
      seen.add(k);
      merged.push(e);
    }
  }
  return merged;
}
