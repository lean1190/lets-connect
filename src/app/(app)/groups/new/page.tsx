'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createGroup } from '@/lib/server-actions/groups';

export default function NewGroupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const { execute: createGroupAction, status, result } = useAction(createGroup);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a group name');
      return;
    }

    createGroupAction({ name: name.trim() });
  };

  useEffect(() => {
    if (result?.serverError) {
      alert(`Error: ${result.serverError}`);
    } else if (result?.data) {
      router.push('/groups');
    }
  }, [result, router]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">
                Group Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter group name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                required
                autoFocus
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={status === 'executing'}
                className="flex-1 bg-[#0A66C2]"
              >
                {status === 'executing' ? 'Creating...' : 'Create Group'}
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
