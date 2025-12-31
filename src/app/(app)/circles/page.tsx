import { IconCircles } from '@tabler/icons-react';
import Link from 'next/link';
import { CtaButton } from '@/components/ui/cta-button';
import { getCircles } from '@/lib/circles/get/get';
import { AppRoute } from '@/lib/constants/navigation';
import { CirclesList } from './components/circles-list';

export default async function CirclesPage() {
  const circles = await getCircles();

  if (circles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <IconCircles
          className="w-16 h-16 text-gray-400 dark:text-muted-foreground mb-4"
          stroke={1.5}
        />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-2">
          No circles yet
        </h2>
        <p className="text-gray-600 dark:text-muted-foreground mb-8">
          Create circles to organize your contacts
        </p>
        <Link href={AppRoute.NewCircle}>
          <CtaButton size="sm">New Circle</CtaButton>
        </Link>
      </div>
    );
  }

  return <CirclesList circles={circles} />;
}
