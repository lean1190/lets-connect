'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
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
import { AppRoute } from '@/lib/constants/navigation';

export function DeleteCircleButton({
  circleId,
  circleName
}: {
  circleId: string;
  circleName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { execute, status } = useAction(deleteCircle, {
    onSuccess: () => router.push(AppRoute.Circles),
    onError: ({ error }) =>
      alert(`Error: ${error.serverError ?? error.thrownError?.message ?? 'Something went wrong'}`)
  });

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
            <Button
              variant="destructive"
              onClick={() => execute({ id: circleId })}
              disabled={status === 'executing'}
            >
              {status === 'executing' ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
