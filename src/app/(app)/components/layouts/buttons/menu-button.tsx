import { IconMenu2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

type Props = {
  onClick?: () => void;
};

export default function MenuButton(props: Props) {
  return (
    <Button variant="ghost" size="icon" {...props}>
      <IconMenu2 size={20} className="h-5 w-5" />
      <span className="sr-only">Open menu</span>
    </Button>
  );
}
