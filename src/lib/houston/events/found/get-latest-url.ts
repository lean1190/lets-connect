export const getLatestArchiveUrl = async () => {
  const response = await fetch('https://www.foundhamburg.com/');
  if (!response.ok) {
    throw new Error(`Failed to fetch foundhamburg.com: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();

  // Find the first archive entry link in the Archive section
  // The archive entries appear to be in links with href="/p/..."
  // We need to find the first one in the Archive section
  const archiveSectionMatch = html.match(/<h[^>]*>Archive<\/h[^>]*>([\s\S]*?)(?=<h[^>]*>|$)/i);
  if (!archiveSectionMatch?.[1]) {
    throw new Error('Archive section not found');
  }

  const archiveSection = archiveSectionMatch[1];

  // Find the first link that matches the pattern /p/...
  // These links are typically in anchor tags
  const linkMatch = archiveSection.match(/<a[^>]+href=["']([^"']*\/p\/[^"']+)["'][^>]*>/i);
  if (!linkMatch?.[1]) {
    throw new Error('No archive entry URL found');
  }

  let url = linkMatch[1];

  // If the URL is relative, make it absolute
  if (url.startsWith('/')) {
    url = `https://www.foundhamburg.com${url}`;
  } else if (!url.startsWith('http')) {
    url = `https://www.foundhamburg.com/${url}`;
  }

  return url ?? '';
};
