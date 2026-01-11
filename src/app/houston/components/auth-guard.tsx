import { redirect } from 'next/navigation';
import { isSignedIn } from '@/lib/auth/session/server';
import { AppRoute } from '@/lib/constants/navigation';
import { getSettings } from '@/lib/settings/get/get';

type Props = {
  children: React.ReactNode;
};

export default async function AuthGuard({ children }: Props) {
  const signedIn = await isSignedIn();

  if (!signedIn) {
    redirect(AppRoute.Signin);
  }

  const settings = await getSettings();

  if (!settings.is_admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
}
