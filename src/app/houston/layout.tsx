import Image from 'next/image';
import Link from 'next/link';
import AuthGuard from './components/auth-guard';
import Navigation from './components/navigation';

export default function HoustonLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-dvh bg-background">
        <div className="bg-card border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-1">
                <Link href={'/'}>
                  <Image src="/logo.png" alt="Logo" width={40} height={40} priority={false} />
                </Link>
                <div className="text-sm text-muted-foreground">Admin Dashboard</div>
              </div>
              <div className="flex items-center gap-6">
                <Navigation />
              </div>
            </div>
          </div>
        </div>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
