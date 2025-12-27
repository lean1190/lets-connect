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
import { deleteContact } from '@/lib/server-actions/contacts';

export function DeleteContactButton({
  contactId,
  contactName
}: {
  contactId: string;
  contactName: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { execute, status, result } = useAction(deleteContact);

  const handleDelete = () => {
    execute({ id: contactId });
  };

  useEffect(() => {
    if (result?.serverError) {
      alert(`Error: ${result.serverError}`);
    } else if (result?.data) {
      router.push('/contacts');
    }
  }, [result, router]);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
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
            <Button variant="destructive" onClick={handleDelete} disabled={status === 'executing'}>
              {status === 'executing' ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
