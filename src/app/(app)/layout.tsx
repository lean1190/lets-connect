import { redirect } from 'next/navigation';
import { isSignedIn } from '@/lib/auth/session/server';
import { AppRoute } from '@/lib/constants/navigation';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (await !isSignedIn()) {
    return redirect(AppRoute.Signin);
  }

  return children;
}
