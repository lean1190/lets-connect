import * as TablerIcons from '@tabler/icons-react';
import { IconCircles } from '@tabler/icons-react';

export function getIconComponent(iconName: string | null | undefined) {
  if (!iconName) return IconCircles;
  const IconComponent = (
    TablerIcons as unknown as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>
  )[iconName];
  return IconComponent || IconCircles;
}
