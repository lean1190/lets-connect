"use client";

import { useParams, useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deleteContact,
  getContactById,
  updateContact,
} from "@/lib/server-actions/contacts";
import { getGroups } from "@/lib/server-actions/groups";

export default function EditContactPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [profileLink, setProfileLink] = useState("");
  const [reason, setReason] = useState("");
  const [allGroups, setAllGroups] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    execute: updateContactAction,
    status: updateStatus,
    result: updateResult,
  } = useAction(updateContact);
  const {
    execute: deleteContactAction,
    status: deleteStatus,
    result: deleteResult,
  } = useAction(deleteContact);

  useEffect(() => {
    async function loadData() {
      try {
        const [contact, groups] = await Promise.all([
          getContactById(id),
          getGroups(),
        ]);

        if (contact) {
          setName(contact.name);
          setProfileLink(contact.url || "");
          setReason(contact.reason || "");
          setSelectedGroups(contact.groups?.map((g) => g.id) || []);
        }
        setAllGroups(groups);
      } catch (error) {
        console.error("Error loading contact:", error);
        alert("Failed to load contact");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const toggleGroup = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((gid) => gid !== groupId)
        : [...prev, groupId],
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a name");
      return;
    }

    updateContactAction({
      id,
      name: name.trim(),
      profileLink: profileLink.trim(),
      reason: reason.trim(),
      groupIds: selectedGroups,
    });
  };

  const handleDelete = async () => {
    deleteContactAction({ id });
  };

  useEffect(() => {
    if (updateResult?.serverError) {
      alert(`Error: ${updateResult.serverError}`);
    } else if (updateResult?.data) {
      router.back();
    }
  }, [updateResult, router]);

  useEffect(() => {
    if (deleteResult?.serverError) {
      alert(`Error: ${deleteResult.serverError}`);
    } else if (deleteResult?.data) {
      router.push("/contacts");
    }
  }, [deleteResult, router]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A66C2]"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <Card>
          <CardHeader>
            <CardTitle>Edit Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="profileLink">Profile Link</Label>
                <Input
                  id="profileLink"
                  type="url"
                  placeholder="LinkedIn or WhatsApp URL"
                  value={profileLink}
                  onChange={(e) => setProfileLink(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="reason">Reason to Connect</Label>
                <textarea
                  id="reason"
                  placeholder="Why do you want to connect?"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {allGroups.length > 0 && (
                <div>
                  <Label>Groups</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {allGroups.map((group) => (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedGroups.includes(group.id)
                            ? "bg-[#0A66C2] text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {group.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={updateStatus === "executing"}
                  className="flex-1 bg-[#0A66C2]"
                >
                  {updateStatus === "executing" ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>

              <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                className="w-full"
              >
                Delete Contact
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {name}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteStatus === "executing"}
            >
              {deleteStatus === "executing" ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
