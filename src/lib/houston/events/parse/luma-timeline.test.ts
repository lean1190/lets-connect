import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parseLumaTimeline } from './luma-timeline';

const LUMA_JSON_LD = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"ItemList","itemListElement":[{"@type":"ListItem","item":{"@type":"Event","url":"https://luma.com/41wqrn3d","startDate":"2026-06-11T18:00:00.000+02:00"}},{"@type":"ListItem","item":{"@type":"Event","url":"https://luma.com/lrsyw2lc","startDate":"2026-06-11T19:00:00.000+02:00"}}]}</script>`;

describe('parseLumaTimeline', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-10T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('parses timeline cards with section dates and event metadata', () => {
    const html = `${LUMA_JSON_LD}<div class="timeline"><div><div class="timeline-section is-first"><div class="timeline-title date-title"><div class="date">Tomorrow</div><div class="weekday">Thursday</div></div><div class="flex-1"><div class="card-wrapper"><div class="content-card"><a class="event-link content-link" href="/41wqrn3d" aria-label="Wunder Mobility Meetup"></a><div class="event-content"><div class="event-time"><span>6:00 PM</span></div><h3>Wunder Mobility Meetup "The Future of Bikesharing"</h3><div class="attr"><div class="nowrap">By Gunnar Froh</div></div><div class="attr"><svg><path d="M2 6.854"></path></svg></div><div class="text-ellipses">Wunder Mobility</div><div class="pill-label">get inspired</div></div></div></div><div class="card-wrapper"><div class="content-card"><a class="event-link content-link" href="/lrsyw2lc"></a><div class="event-content"><div class="event-time"><span>7:00 PM</span></div><h3>12MIN.ME I HAMBURG I IGNITE #119</h3><div class="attr"><div class="nowrap">By 12MIN.ME Hamburg</div></div><div class="attr"><svg><path d="M2 6.854"></path></svg></div><div class="text-ellipses">Reos GmbH</div></div></div></div></div></div><div><div class="timeline-section"><div class="date-title"><div class="date">Jun 12</div></div><div class="flex-1"><div class="card-wrapper"><div class="content-card"><a class="event-link content-link" href="/iobre59b"></a><div class="event-content"><div class="event-time"><span>4:00 PM</span></div><h3>build fridays</h3><div class="attr"><div class="nowrap">By AI BEAVERS</div></div><div class="attr"><svg><path d="M2 6.854"></path></svg></div><div class="text-ellipses">House of AI Hamburg</div><div class="pill-label">tech bite</div></div></div></div></div></div></div>`;

    const events = parseLumaTimeline(html);

    expect(events).toHaveLength(3);
    expect(events[0]).toEqual({
      dateRange: 'June 11',
      name: 'Wunder Mobility Meetup "The Future of Bikesharing"',
      description: '6:00 PM at Wunder Mobility — By Gunnar Froh. get inspired',
      url: 'https://luma.com/41wqrn3d'
    });
    expect(events[1].dateRange).toBe('June 11');
    expect(events[2].dateRange).toBe('June 12');
    expect(events[2].url).toBe('https://luma.com/iobre59b');
  });

  it('falls back to JSON-LD dates when section dates are shimmer placeholders', () => {
    const html = `${LUMA_JSON_LD}<div class="timeline"><div><div class="timeline-section"><div class="date"><div class="shimmer"></div></div><div class="card-wrapper"><a class="event-link content-link" href="/41wqrn3d"></a><div class="event-content"><div class="event-time shimmer-wrapper"><div class="shimmer"></div></div><h3>Wunder Mobility Meetup</h3><div class="nowrap">By Gunnar Froh</div><svg><path d="M2 6.854"></path></svg><div class="text-ellipses">Wunder Mobility</div></div></div></div></div>`;

    const events = parseLumaTimeline(html);

    expect(events).toHaveLength(1);
    expect(events[0].dateRange).toBe('June 11');
    expect(events[0].description).toBe('Wunder Mobility — By Gunnar Froh');
  });

  it('returns empty array when timeline markup is absent', () => {
    const html = '<p>March 10 <a href="https://luma.com/ev">Event</a>(English) — Description.</p>';

    const events = parseLumaTimeline(html);

    expect(events).toHaveLength(0);
  });
});
