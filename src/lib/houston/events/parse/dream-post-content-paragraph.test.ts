import { describe, expect, it } from 'vitest';
import { parseDreamPostContentParagraph } from './dream-post-content-paragraph';

describe('parseDreamPostContentParagraph', () => {
  it('parses beehiiv dream-post-content-paragraph block with br and strong date', () => {
    const html = `<div class="j6zgbu0"><p class="dream-post-content-paragraph j6zgbu1"><span class="hxnnnr0"><strong>March 22</strong></span><br><span class="hxnnnr0"><a href="https://luma.com/45lfeyeh" target="_blank" rel="" class="_3k8pkd0">Agentic Conf</a></span><span class="hxnnnr0"> (English) — Hamburg's first full-day conference on agentic software engineering, featuring talks, wild prototypes, and hardware shenanigans.</span><br></p></div>`;

    const events = parseDreamPostContentParagraph(html);

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({
      dateRange: 'March 22',
      name: 'Agentic Conf',
      description:
        "Hamburg's first full-day conference on agentic software engineering, featuring talks, wild prototypes, and hardware shenanigans.",
      url: 'https://luma.com/45lfeyeh'
    });
  });

  it('parses weekday-prefixed dates inside strong tag', () => {
    const html = `<div class="j6zgbu0"><p class="dream-post-content-paragraph j6zgbu1"><span class="hxnnnr0"><strong>Wednesday, April 22</strong></span><br><span class="hxnnnr0"><a href="https://startupport.de/en/events/co-founder-meet-match/" target="_blank" rel="" class="_3k8pkd0">Co-Founder Meet&amp;Match</a></span><span class="hxnnnr0"> (German/English) — Find your co-founder at this matchmaking event designed for aspiring and current startup founders looking for the right team.</span></p></div>`;

    const events = parseDreamPostContentParagraph(html);

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({
      dateRange: 'April 22',
      name: 'Co-Founder Meet&Match',
      description:
        'Find your co-founder at this matchmaking event designed for aspiring and current startup founders looking for the right team.',
      url: 'https://startupport.de/en/events/co-founder-meet-match/'
    });
  });

  it('strips foundhamburg.com registration links from url', () => {
    const html = `<p class="dream-post-content-paragraph"><strong>March 1</strong><br><a href="https://www.foundhamburg.com/p/x">Title</a><span> (English) — Description here.</span></p>`;

    const events = parseDreamPostContentParagraph(html);

    expect(events).toHaveLength(1);
    expect(events[0].url).toBeUndefined();
  });

  it('returns no events without dream-post-content-paragraph class', () => {
    const html = `<p><strong>March 22</strong><a href="https://luma.com/x">X</a> (English) — Y.</p>`;

    const events = parseDreamPostContentParagraph(html);

    expect(events).toHaveLength(0);
  });
});
