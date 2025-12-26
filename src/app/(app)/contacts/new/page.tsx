'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createContact } from '@/lib/server-actions/contacts';
import { getGroups } from '@/lib/server-actions/groups';

export default function NewContactPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileLink = searchParams.get('profileLink') || '';

  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [allGroups, setAllGroups] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const { execute: createContactAction, status, result } = useAction(createContact);

  useEffect(() => {
    async function loadGroups() {
      const groups = await getGroups();
      setAllGroups(groups);
    }
    loadGroups();
  }, []);

  const toggleGroup = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a name');
      return;
    }

    if (!reason.trim()) {
      alert('Please enter a reason to contact');
      return;
    }

    createContactAction({
      name: name.trim(),
      profileLink: profileLink || '',
      reason: reason.trim(),
      groupIds: selectedGroups.length > 0 ? selectedGroups : undefined
    });
  };

  useEffect(() => {
    if (result?.serverError) {
      alert(`Error: ${result.serverError}`);
    } else if (result?.data) {
      router.push('/contacts');
    }
  }, [result, router]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="profileLink">LinkedIn Profile</Label>
              <Input
                id="profileLink"
                type="text"
                value={profileLink || 'No profile link'}
                disabled
                className="mt-1 bg-gray-50"
              />
            </div>

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
              <Label htmlFor="reason">
                Reason to Contact <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="reason"
                placeholder="Why do you want to contact this person?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            {allGroups.length > 0 && (
              <div>
                <Label>Add to Groups (optional)</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {allGroups.map((group) => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedGroups.includes(group.id)
                          ? 'bg-[#0A66C2] text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
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
                disabled={status === 'executing'}
                className="flex-1 bg-[#0A66C2]"
              >
                {status === 'executing' ? 'Saving...' : 'Save Contact'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
