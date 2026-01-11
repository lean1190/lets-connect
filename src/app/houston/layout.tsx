import Image from 'next/image';
import Link from 'next/link';
import AuthGuard from './components/auth-guard';
import Navigation from './components/navigation';

export default function HoustonLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-dvh bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href={'/'}>
                <Image src="/logo/light.png" alt="Logo" width={50} height={50} priority={false} />
              </Link>
              <div className="flex items-center gap-6">
                <Navigation />
                <div className="text-sm text-gray-500">Admin Dashboard</div>
              </div>
            </div>
          </div>
        </div>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
