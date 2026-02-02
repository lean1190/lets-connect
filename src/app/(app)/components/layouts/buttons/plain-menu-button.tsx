import { IconMenu2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

export default function PlainMenuButton() {
  return (
    <Button variant="ghost" size="icon">
      <IconMenu2 size={20} className="h-5 w-5" />
      <span className="sr-only">Open menu</span>
    </Button>
  );
}
