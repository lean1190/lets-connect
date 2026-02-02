import BackButton from './buttons/back-button';
import PlainMenuButton from './buttons/plain-menu-button';
import QrButton from './buttons/qr-button';
import ScanButton from './buttons/scan-button';

type Props = {
  title?: string;
  showBackButton?: boolean;
  children?: React.ReactNode;
};

export default function LoadingPageLayout({ title, showBackButton = false, children }: Props) {
  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-background">
      <div
        className="bg-white dark:bg-card border-b dark:border-border sticky top-0 z-10"
        aria-hidden
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              {showBackButton ? <BackButton /> : <PlainMenuButton />}
              {title ? (
                <h1 className="text-lg font-medium text-foreground">{title}</h1>
              ) : (
                <div className="h-5 w-32 rounded bg-muted animate-pulse" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <QrButton />
              <ScanButton />
            </div>
          </div>
        </div>
      </div>
      <main className="pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe" aria-hidden>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="h-14 rounded-2xl bg-muted/80 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
