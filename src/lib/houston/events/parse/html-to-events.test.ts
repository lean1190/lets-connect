import { describe, expect, it } from 'vitest';
import { parseHtmlToEvents } from './html-to-events';

describe('parseHtmlToEvents', () => {
  it('runs legacy strategy and new-format strategy together', () => {
    const html = `
      <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
        <p>
          <span><b>January 15:</b></span>
          <span>&nbsp;</span>
          <span><a href="https://example.com/event">Legacy Event</a></span>
          <span> (English) — Legacy description</span>
        </p>
      </div>
      <p>March 10 <a href="https://luma.com/new">New Format Event</a>(English) — Only in new format.</p>
    `;

    const events = parseHtmlToEvents(html);

    expect(events).toHaveLength(2);
    const names = events.map((e) => e.name).sort();
    expect(names).toEqual(['Legacy Event', 'New Format Event']);
  });

  it('deduplicates when multiple strategies match the same logical event', () => {
    const html = `<p class="dream-post-content-paragraph"><span><strong>March 22</strong></span><br><span><a href="https://luma.com/45lfeyeh">Agentic Conf</a></span><span> (English) — Same blurb.</span></p>`;

    const events = parseHtmlToEvents(html);

    expect(events).toHaveLength(1);
    expect(events[0].name).toBe('Agentic Conf');
    expect(events[0].dateRange).toBe('March 22');
  });
});
