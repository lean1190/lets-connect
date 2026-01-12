'use server';

import { z } from 'zod';
import { actionClient } from '@/lib/server-actions/client';

type WebsiteEventInput = {
  dateRange: string;
  name: string;
  description: string;
  url?: string;
};

const fetchEventsSchema = z.object({
  url: z.url('Invalid URL')
});

export const fetchEventsFromUrl = actionClient
  .inputSchema(fetchEventsSchema)
  .action(async ({ parsedInput }) => {
    const response = await fetch(parsedInput.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const events: WebsiteEventInput[] = [];

    // Parse DOM structure: Find all event divs with the pattern:
    // <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
    //   <p>
    //     <span><b>Date:</b></span>
    //     <span>&nbsp;</span>
    //     <span><a href="...">Event Name</a></span>
    //     <span> (Language) — Description</span>
    //   </p>
    // </div>

    // Pattern to match the event div structure (flexible padding values)
    const eventDivPattern =
      /<div[^>]*style="[^"]*padding-bottom:\s*\d+px[^"]*padding-left:\s*\d+px[^"]*padding-right:\s*\d+px[^"]*padding-top:\s*\d+px[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
    let divMatch: RegExpExecArray | null;
    // biome-ignore lint/suspicious/noAssignInExpressions: Required for regex exec loop
    while ((divMatch = eventDivPattern.exec(html)) !== null) {
      const divContent = divMatch[1] ?? '';

      // Extract date from <b> tag: <span><b>January 31–February 1:</b></span>
      const dateMatch = divContent.match(/<span[^>]*>\s*<b[^>]*>([^<]+?):\s*<\/b>\s*<\/span>/i);
      if (!dateMatch?.[1]) continue;

      const dateRange = cleanHtmlTags(dateMatch[1]).trim();
      if (!isValidDatePattern(dateRange)) continue;

      // Extract event name and URL from <a> tag: <span><a href="...">Event Name</a></span>
      const linkMatch = divContent.match(
        /<span[^>]*>\s*<a[^>]+href=["']([^"']+)["'][^>]*>([^<]+?)<\/a>\s*<\/span>/i
      );
      if (!linkMatch?.[2]) continue;

      const name = cleanHtmlTags(linkMatch[2]).trim();
      const url = linkMatch[1]?.includes('foundhamburg.com') ? undefined : linkMatch[1];

      // Extract description from spans - look for pattern: (Language) — Description
      // Find all spans and extract text from the one with description
      const spans = divContent.match(/<span[^>]*>([\s\S]*?)<\/span>/gi);
      if (!spans) continue;

      let description = '';
      for (const span of spans) {
        const spanText = cleanHtmlTags(span);
        // Skip empty spans or just &nbsp;
        if (!spanText || spanText.trim() === '' || spanText.trim() === '&nbsp;') continue;

        // Look for description pattern: (Language) — Description
        const descMatch = spanText.match(/\s*\([^)]+\)\s*[—–-]\s*(.+)/);
        if (descMatch?.[1]) {
          description = descMatch[1].trim();
          break;
        }
      }

      // Fallback: if no description found with pattern, get text from paragraph and clean it
      if (!description) {
        const paragraphMatch = divContent.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
        if (paragraphMatch?.[1]) {
          const pText = cleanHtmlTags(paragraphMatch[1]);
          // Remove date and name, get what's left
          const remaining = pText.replace(`${dateRange}:`, '').replace(name, '').trim();

          // Extract description after dash
          const descMatch = remaining.match(/[—–-]\s*(.+)/);
          if (descMatch?.[1]) {
            description = descMatch[1].trim();
          } else {
            // If no dash, use remaining text (might have language prefix)
            description = remaining.replace(/^\s*\([^)]+\)\s*/, '').trim();
          }
        }
      }

      if (name && description) {
        events.push({
          dateRange,
          name,
          description,
          url
        });
      }
    }

    return { events };
  });

function isValidDatePattern(dateRange: string): boolean {
  const trimmed = dateRange.trim();
  // Check if it starts with a month name and has a day number
  return /^[A-Z][a-z]+\s+\d+/.test(trimmed) || /^[A-Z][a-z]+\s+\d+[–-]/.test(trimmed);
}

function cleanHtmlTags(text: string): string {
  return text
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/&apos;/g, "'") // Replace &apos; with '
    .replace(/&#x27;/g, "'") // Replace &#x27; with '
    .replace(/&#x2F;/g, '/') // Replace &#x2F; with /
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}
