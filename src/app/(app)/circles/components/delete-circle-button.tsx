'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { deleteCircle } from '@/lib/circles/delete/actions/delete';

export function DeleteCircleButton({
  circleId,
  circleName
}: {
  circleId: string;
  circleName: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { execute, status, result } = useAction(deleteCircle);

  const handleDelete = () => {
    execute({ id: circleId });
  };

  useEffect(() => {
    if (result?.serverError) {
      alert(`Error: ${result.serverError}`);
    } else if (result?.data) {
      router.push('/circles');
    }
  }, [result, router]);

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label="Delete circle"
      >
        Delete
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {circleName}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the circle <strong>&quot;{circleName}&quot;</strong>?
            </DialogDescription>
            <DialogDescription>Contacts in this circle will not be deleted</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={status === 'executing'}>
              {status === 'executing' ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
