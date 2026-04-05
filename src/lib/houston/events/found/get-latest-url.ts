const FOUND_ARCHIVE_URL = 'https://www.foundhamburg.com/archive';

export const getLatestArchiveUrl = async () => {
  const response = await fetch(FOUND_ARCHIVE_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch foundhamburg.com archive: ${response.status} ${response.statusText}`
    );
  }

  const html = await response.text();
  const linkMatch = html.match(/<a[^>]+href=["']([^"']*\/p\/[^"']+)["'][^>]*>/i);
  if (!linkMatch?.[1]) {
    throw new Error('No archive entry URL found');
  }

  const href = linkMatch[1];
  return href.startsWith('http')
    ? href
    : href.startsWith('/')
      ? `https://www.foundhamburg.com${href}`
      : `https://www.foundhamburg.com/${href}`;
};
