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
  const partial =
    partialRoute && pathname?.startsWith(partialRoute) ? titles[partialRoute] : defaultTitle;
  return (title ? title : partial) ?? defaultTitle;
};
