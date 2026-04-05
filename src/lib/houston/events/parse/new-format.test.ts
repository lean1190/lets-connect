import { describe, expect, it } from 'vitest';
import { parseNewFormat } from './new-format';

describe('parseNewFormat', () => {
  it('parses inline month-day anchor and language tail', () => {
    const html = `<p>March 10 <a href="https://luma.com/ev">New Event</a>(English) — New description.</p>`;

    const events = parseNewFormat(html);

    expect(events).toHaveLength(1);
    expect(events[0].name).toBe('New Event');
    expect(events[0].dateRange).toBe('March 10');
    expect(events[0].description).toBe('New description.');
    expect(events[0].url).toBe('https://luma.com/ev');
  });

  it('parses when date is wrapped in strong before the anchor', () => {
    const html = `<p><strong>March 10</strong> <a href="https://luma.com/ev">New Event</a>(English) — New description.</p>`;

    const events = parseNewFormat(html);

    expect(events).toHaveLength(1);
    expect(events[0].name).toBe('New Event');
    expect(events[0].dateRange).toBe('March 10');
  });

  it('parses b tag date and plain br before link', () => {
    const html = `<p style="color:#000000;"><b>March 10</b><br><a class="link" href="https://www.eventbrite.de/e/impact-academy-tickets-1981849348752" target="_blank">Impact Academy: Understanding the Startup Funding Landscape</a> (German) — Navigate Hamburg's full funding landscape.</p>`;

    const events = parseNewFormat(html);

    expect(events).toHaveLength(1);
    expect(events[0].name).toBe('Impact Academy: Understanding the Startup Funding Landscape');
    expect(events[0].dateRange).toBe('March 10');
  });

  it('returns empty array when plain text appears between date and anchor', () => {
    const html = `<p class="dream-post-content-paragraph"><strong>March 22</strong> pick this: <a href="https://luma.com/x">Agentic Conf</a> (English) — Desc.</p>`;

    const events = parseNewFormat(html);

    expect(events).toHaveLength(0);
  });
});
