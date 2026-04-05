import type { ParseStrategy, WebsiteEventInput } from '../types';
import { parseDreamPostContentParagraph } from './dream-post-content-paragraph';
import { parseLegacyFormat } from './legacy-format';
import { mergeUniqueEvents } from './merge-unique-events';
import { parseNewFormat } from './new-format';

const PARSE_STRATEGIES: readonly ParseStrategy[] = [
  parseLegacyFormat,
  parseNewFormat,
  parseDreamPostContentParagraph
];

export function parseHtmlToEvents(html: string): WebsiteEventInput[] {
  return PARSE_STRATEGIES.reduce(
    (accumulated, strategy) => mergeUniqueEvents(accumulated, strategy(html)),
    [] as WebsiteEventInput[]
  );
}
