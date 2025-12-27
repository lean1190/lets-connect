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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { deleteGroup, updateGroup } from '@/lib/server-actions/groups';

export function EditGroupButton({ groupId, groupName }: { groupId: string; groupName: string }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [name, setName] = useState(groupName);
  const router = useRouter();
  const {
    execute: updateGroupAction,
    status: updateStatus,
    result: updateResult
  } = useAction(updateGroup);
  const {
    execute: deleteGroupAction,
    status: deleteStatus,
    result: deleteResult
  } = useAction(deleteGroup);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a group name');
      return;
    }

    updateGroupAction({ id: groupId, name: name.trim() });
  };

  const handleDelete = () => {
    deleteGroupAction({ id: groupId });
  };

  useEffect(() => {
    if (updateResult?.serverError) {
      alert(`Error: ${updateResult.serverError}`);
    } else if (updateResult?.data) {
      setEditOpen(false);
      router.refresh();
    }
  }, [updateResult, router]);

  useEffect(() => {
    if (deleteResult?.serverError) {
      alert(`Error: ${deleteResult.serverError}`);
    } else if (deleteResult?.data) {
      router.push('/groups');
    }
  }, [deleteResult, router]);

  return (
    <>
      <Button variant="outline" onClick={() => setEditOpen(true)}>
        Edit
      </Button>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateStatus === 'executing'}
                className="bg-[#0A66C2]"
              >
                {updateStatus === 'executing' ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
          <div className="mt-4 pt-4 border-t">
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setEditOpen(false);
                setDeleteOpen(true);
              }}
              className="w-full"
            >
              Delete Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{groupName}&quot;? Contacts in this group will
              not be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteStatus === 'executing'}
            >
              {deleteStatus === 'executing' ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
