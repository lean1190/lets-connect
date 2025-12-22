"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteGroup } from "@/lib/server-actions/groups";

export function DeleteGroupButton({
  groupId,
  groupName,
}: {
  groupId: string;
  groupName: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { execute, status, result } = useAction(deleteGroup);

  const handleDelete = () => {
    execute({ id: groupId });
  };

  useEffect(() => {
    if (result?.serverError) {
      alert(`Error: ${result.serverError}`);
    } else if (result?.data) {
      router.refresh();
    }
  }, [result, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2"
        aria-label="Delete group"
      >
        ×
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{groupName}&quot;? Contacts
              in this group will not be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={status === "executing"}
            >
              {status === "executing" ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
