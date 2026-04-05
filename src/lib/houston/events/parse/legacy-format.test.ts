import { describe, expect, it } from 'vitest';
import { parseLegacyFormat } from './legacy-format';

describe('parseLegacyFormat', () => {
  it('extracts event from padded div newsletter layout', () => {
    const html = `
      <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
        <p>
          <span><b>January 15:</b></span>
          <span>&nbsp;</span>
          <span><a href="https://example.com/event">Tech Conference</a></span>
          <span> (English) — Join us for an amazing tech conference</span>
        </p>
      </div>
    `;

    const events = parseLegacyFormat(html);

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({
      dateRange: 'January 15',
      name: 'Tech Conference',
      description: 'Join us for an amazing tech conference',
      url: 'https://example.com/event'
    });
  });

  it('omits url when link points at foundhamburg.com', () => {
    const html = `
      <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
        <p>
          <span><b>January 15:</b></span>
          <span>&nbsp;</span>
          <span><a href="https://www.foundhamburg.com/p/something">Internal Event</a></span>
          <span> (English) — Event description</span>
        </p>
      </div>
    `;

    const events = parseLegacyFormat(html);

    expect(events).toHaveLength(1);
    expect(events[0].url).toBeUndefined();
  });

  it('returns no events when markup does not use legacy div pattern', () => {
    const html = `<p>March 10 <a href="https://luma.com/ev">Only new format</a>(English) — Desc.</p>`;

    const events = parseLegacyFormat(html);

    expect(events).toHaveLength(0);
  });
});
