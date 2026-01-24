import { getCircles } from '@/lib/circles/get/get';
import { NewContactPageClient } from './page-client';

export default async function NewContactPage({
  searchParams
}: {
  searchParams: Promise<{ profileLink?: string }>;
}) {
  const { profileLink = '' } = await searchParams;
  const circles = await getCircles();

  return <NewContactPageClient profileLink={profileLink} initialCircles={circles} />;
}
