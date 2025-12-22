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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGroup } from "@/lib/server-actions/groups";

export function CreateGroupButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();
  const { execute, status, result } = useAction(createGroup);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a group name");
      return;
    }

    execute({ name: name.trim() });
  };

  useEffect(() => {
    if (result?.serverError) {
      alert(`Error: ${result.serverError}`);
    } else if (result?.data) {
      setName("");
      setOpen(false);
      router.refresh();
    }
  }, [result, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0A66C2] w-full sm:w-auto">+ New Group</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Group</DialogTitle>
          <DialogDescription>
            Create a new group to organize your contacts
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="groupName">Group name</Label>
              <Input
                id="groupName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name"
                autoFocus
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={status === "executing"}
              className="bg-[#0A66C2]"
            >
              {status === "executing" ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
