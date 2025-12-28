import type { AppRoute } from '../constants/navigation';

export const getTitle = ({
  pathname,
  titles,
  partialRoute,
  defaultTitle = ''
}: {
  pathname: string;
  titles: Record<string, string>;
  partialRoute?: AppRoute;
  defaultTitle?: string;
}): string => {
  const title = titles[pathname];
  if (title) {
    return title;
  }

  if (!partialRoute) {
    return defaultTitle;
  }

  const matchesStart = pathname.startsWith(partialRoute);
  const partial = partialRoute && matchesStart ? titles[partialRoute] : defaultTitle;

  return partial ?? defaultTitle;
};
