import { redirect } from 'next/navigation';
import { AppRoute } from '@/lib/constants/navigation';

export default function NotFound() {
  redirect(AppRoute.Landing);
}
