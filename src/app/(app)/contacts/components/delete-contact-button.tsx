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
import { AppRoute } from '@/lib/constants/navigation';
import { deleteContact } from '@/lib/contacts/delete/actions/delete';

export function DeleteContactButton({
  contactId,
  contactName
}: {
  contactId: string;
  contactName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { execute, status } = useAction(deleteContact, {
    onSuccess: () => router.push(AppRoute.Contacts),
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
        aria-label="Delete contact"
      >
        Delete
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {contactName}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the contact <strong>&quot;{contactName}&quot;</strong>
              ?
            </DialogDescription>
            <DialogDescription>This action cannot be undone</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => execute({ id: contactId })}
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
