import { redirect } from 'next/navigation';
import { isSignedIn } from '@/lib/auth/session/server';
import { AppRoute } from '@/lib/constants/navigation';
import { isAdmin } from '@/lib/settings/get/get';

type Props = {
  children: React.ReactNode;
};

export default async function AuthGuard({ children }: Props) {
  if (!(await isSignedIn()) || !(await isAdmin())) {
    redirect(AppRoute.Signin);
  }

  return children;
}
