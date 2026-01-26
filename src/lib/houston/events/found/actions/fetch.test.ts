import { beforeEach, describe, expect, it, vi } from 'vitest';
import { replaceConsoleError } from '@/lib/testing/console';
import { fetchEventsFromUrl } from './fetch';

vi.unmock('@/lib/server-actions/client');

describe('fetchEventsFromUrl', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    replaceConsoleError();
    global.fetch = mockFetch;
  });

  const createMockResponse = (html: string, ok = true, status = 200) => ({
    ok,
    status,
    statusText: ok ? 'OK' : 'Not Found',
    text: async () => html
  });

  describe('successful parsing', () => {
    it('should parse a single event with all fields', async () => {
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

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events).toHaveLength(1);
      expect(result?.data?.events[0]).toEqual({
        dateRange: 'January 15',
        name: 'Tech Conference',
        description: 'Join us for an amazing tech conference',
        url: 'https://example.com/event'
      });
    });

    it('should parse multiple events', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>January 15:</b></span>
            <span>&nbsp;</span>
            <span><a href="https://example.com/event1">Event 1</a></span>
            <span> (English) — Description 1</span>
          </p>
        </div>
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>February 20:</b></span>
            <span>&nbsp;</span>
            <span><a href="https://example.com/event2">Event 2</a></span>
            <span> (German) — Description 2</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events).toHaveLength(2);
      expect(result?.data?.events[0].name).toBe('Event 1');
      expect(result?.data?.events[1].name).toBe('Event 2');
    });

    it('should parse date range with same month', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>January 15–20:</b></span>
            <span>&nbsp;</span>
            <span><a href="https://example.com/event">Multi-day Event</a></span>
            <span> (English) — A multi-day event</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events[0].dateRange).toBe('January 15–20');
    });

    it('should parse date range across months', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>January 31–February 1:</b></span>
            <span>&nbsp;</span>
            <span><a href="https://example.com/event">Cross-month Event</a></span>
            <span> (English) — Event spanning months</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events[0].dateRange).toBe('January 31–February 1');
    });

    it('should exclude foundhamburg.com URLs', async () => {
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

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events[0].url).toBeUndefined();
    });

    it('should parse description from fallback pattern', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>January 15:</b></span>
            <span>&nbsp;</span>
            <span><a href="https://example.com/event">Event Name</a></span>
            <span> — Description without language</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events[0].description).toBe('Description without language');
    });

    it('should handle different padding values', async () => {
      const html = `
        <div style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:20px;">
          <p>
            <span><b>January 15:</b></span>
            <span>&nbsp;</span>
            <span><a href="https://example.com/event">Event</a></span>
            <span> (English) — Description</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events).toHaveLength(1);
    });

    it('should parse event without colon after date', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p style="color:#000000;color:var(--wt-text-on-background-color) !important;font-family:'Work Sans','Lucida Grande',Verdana,sans-serif;font-size:16px;line-height:1.5;text-align:left;">
            <span style=""><b>January 15</b></span>
            <span style="">&nbsp;</span>
            <span style=""><a class="link" href="https://www.meetup.com/hamburg-vue-js-meetup/events/312211655/" target="_blank" style="-webkit-text-decoration:underline #2C6FE3;color:#2C6FE3;font-style:italic;font-weight:bold;text-decoration:underline #2C6FE3;word-break:break-word;;">Vue.js Meetup</a></span>
            <span style=""> (English) — Get on stage with your own Vue project or cool tool and walk away with practical insights and new connections in Hamburg's frontend community.</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events).toHaveLength(1);
      expect(result?.data?.events[0]).toEqual({
        dateRange: 'January 15',
        name: 'Vue.js Meetup',
        description:
          "Get on stage with your own Vue project or cool tool and walk away with practical insights and new connections in Hamburg's frontend community.",
        url: 'https://www.meetup.com/hamburg-vue-js-meetup/events/312211655/'
      });
    });

    it('should parse recurring event', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p style="color:#000000;color:var(--wt-text-on-background-color) !important;font-family:'Work Sans','Lucida Grande',Verdana,sans-serif;font-size:16px;line-height:1.5;text-align:left;">
            <span style=""><b>Every Saturday:</b></span>
            <span style="">&nbsp;</span>
            <span style=""><a class="link" href="https://luma.com/yd4u93kh" target="_blank" style="-webkit-text-decoration:underline #2C6FE3;color:#2C6FE3;font-style:italic;font-weight:bold;text-decoration:underline #2C6FE3;word-break:break-word;;">Founders Running Club</a></span>
            <span style=""> (English) — Energize your weekend with fellow entrepreneurs during a judgment-free 5K run followed by coffee and meaningful networking conversations.</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events).toHaveLength(1);
      expect(result?.data?.events[0]).toEqual({
        dateRange: 'Every Saturday',
        name: 'Founders Running Club',
        description:
          'Energize your weekend with fellow entrepreneurs during a judgment-free 5K run followed by coffee and meaningful networking conversations.',
        url: 'https://luma.com/yd4u93kh'
      });
    });
  });

  describe('filtering and skipping', () => {
    it('should skip events without date', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>Invalid Date:</b></span>
            <span>&nbsp;</span>
            <span><a href="https://example.com/event">Event</a></span>
            <span> (English) — Description</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events).toHaveLength(0);
    });

    it('should skip events without name', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>January 15:</b></span>
            <span>&nbsp;</span>
            <span>No link here</span>
            <span> (English) — Description</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events).toHaveLength(0);
    });

    it('should skip events without description', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>January 15:</b></span>
            <span>&nbsp;</span>
            <span><a href="https://example.com/event">Event Name</a></span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events).toHaveLength(0);
    });

    it('should skip events with invalid date pattern', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>NotADate 15:</b></span>
            <span>&nbsp;</span>
            <span><a href="https://example.com/event">Event</a></span>
            <span> (English) — Description</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events).toHaveLength(0);
    });
  });

  describe('HTML cleaning', () => {
    it('should clean HTML entities', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>January 15:</b></span>
            <span>&nbsp;</span>
            <span><a href="https://example.com/event">Event &amp; Conference</a></span>
            <span> (English) — Description with &quot;quotes&quot;</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events[0].name).toBe('Event & Conference');
      expect(result?.data?.events[0].description).toBe('Description with "quotes"');
    });

    it('should handle multiple spaces and normalize them', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>January    15:</b></span>
            <span>&nbsp;</span>
            <span><a href="https://example.com/event">Event    Name</a></span>
            <span> (English) — Description    with    spaces</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events[0].dateRange).toBe('January 15');
      expect(result?.data?.events[0].name).toBe('Event Name');
      expect(result?.data?.events[0].description).toBe('Description with spaces');
    });
  });

  describe('error handling', () => {
    it('should return server error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse('', false, 404));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.serverError).toBe('Failed to fetch URL: 404 Not Found');
      expect(result?.data).toBeUndefined();
    });

    it('should validate URL input', async () => {
      const result = await fetchEventsFromUrl({ url: 'not-a-url' });

      expect(result?.validationErrors).toBeDefined();
      expect(result?.validationErrors?.url).toBeDefined();
      expect(result?.data).toBeUndefined();
    });

    it('should return empty array for empty HTML', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(''));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events).toHaveLength(0);
    });

    it('should return empty array when no event divs found', async () => {
      const html = '<div>Some other content</div>';

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('should handle events with different dash types', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>January 15:</b></span>
            <span>&nbsp;</span>
            <span><a href="https://example.com/event">Event</a></span>
            <span> (English) – Description with en dash</span>
          </p>
        </div>
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>February 20:</b></span>
            <span>&nbsp;</span>
            <span><a href="https://example.com/event2">Event 2</a></span>
            <span> (English) — Description with em dash</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events).toHaveLength(2);
      expect(result?.data?.events[0].description).toBe('Description with en dash');
      expect(result?.data?.events[1].description).toBe('Description with em dash');
    });

    it('should handle description without language prefix', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>January 15:</b></span>
            <span>&nbsp;</span>
            <span><a href="https://example.com/event">Event</a></span>
            <span> Description without language prefix</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events[0].description).toBe('Description without language prefix');
    });

    it('should handle relative URLs', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>January 15:</b></span>
            <span>&nbsp;</span>
            <span><a href="/event">Event</a></span>
            <span> (English) — Description</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events[0].url).toBe('/event');
    });

    it('should parse event name wrapped in bold tag inside link', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>January 29:</b></span>
            <span>&nbsp;</span>
            <span><a href="https://www.factorial.io/en/events/ux-roundtable-hamburg"><b>UX Roundtable</b></a></span>
            <span> (German) — Explore how to unify UX across multi-touchpoint platforms</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events).toHaveLength(1);
      expect(result?.data?.events[0]).toEqual({
        dateRange: 'January 29',
        name: 'UX Roundtable',
        description: 'Explore how to unify UX across multi-touchpoint platforms',
        url: 'https://www.factorial.io/en/events/ux-roundtable-hamburg'
      });
    });

    it('should parse event name wrapped in strong tag inside link', async () => {
      const html = `
        <div style="padding-bottom:13px;padding-left:15px;padding-right:15px;padding-top:13px;">
          <p>
            <span><b>January 29:</b></span>
            <span>&nbsp;</span>
            <span><a href="https://example.com/event"><strong>Bold Event Name</strong></a></span>
            <span> (English) — Event with strong tag in name</span>
          </p>
        </div>
      `;

      mockFetch.mockResolvedValueOnce(createMockResponse(html));

      const result = await fetchEventsFromUrl({ url: 'https://example.com/newsletter' });

      expect(result?.data?.events).toHaveLength(1);
      expect(result?.data?.events[0].name).toBe('Bold Event Name');
    });
  });
});
