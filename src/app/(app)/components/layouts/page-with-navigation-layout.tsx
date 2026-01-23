import AppHeader from '../app-header';
import AppNavigation from '../app-navigation';

type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function PageWithNavigationLayout({ title, children }: Props) {
  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-background">
      <AppHeader title={title} />
      <main className="pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <AppNavigation />
    </div>
  );
}
