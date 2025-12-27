import BackButton from './back-button';

type Props = {
  title: string;
  children: React.ReactNode;
};

export function PageWithBackButtonLayout({ title, children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <BackButton />
            <h1 className="text-lg font-medium">{title}</h1>
          </div>
        </div>
      </header>
      <main className="pb-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
