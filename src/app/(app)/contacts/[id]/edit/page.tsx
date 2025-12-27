'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getContactById, updateContact } from '@/lib/server-actions/contacts';
import { createGroup, getGroups } from '@/lib/server-actions/groups';
import { isExecuting } from '@/lib/server-actions/status';

const formSchema = z.object({
  profileLink: z.string().optional(),
  name: z.string().min(1, 'Name is required').trim(),
  reason: z.string().trim().optional(),
  groupIds: z.array(z.string()).optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function EditContactPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [allGroups, setAllGroups] = useState<Array<{ id: string; name: string }>>([]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const {
    execute: updateContactAction,
    status: updateStatus,
    result: updateResult
  } = useAction(updateContact);
  const {
    execute: createGroupAction,
    status: createGroupStatus,
    result: createGroupResult
  } = useAction(createGroup);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileLink: '',
      name: '',
      reason: '',
      groupIds: []
    }
  });

  const selectedGroups = form.watch('groupIds') || [];

  useEffect(() => {
    async function loadData() {
      try {
        const [contact, groups] = await Promise.all([getContactById(id), getGroups()]);

        if (contact) {
          form.reset({
            profileLink: contact.url || '',
            name: contact.name,
            reason: contact.reason || '',
            groupIds: contact.groups?.map((g) => g.id) || []
          });
        }
        setAllGroups(groups);
      } catch (error) {
        console.error('Error loading contact:', error);
        alert('Failed to load contact');
      }
    }
    loadData();
  }, [id, form]);

  const toggleGroup = (groupId: string) => {
    const currentGroups = form.getValues('groupIds') || [];
    const newGroups = currentGroups.includes(groupId)
      ? currentGroups.filter((gid: string) => gid !== groupId)
      : [...currentGroups, groupId];
    form.setValue('groupIds', newGroups);
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      return;
    }

    createGroupAction({ name: newGroupName.trim() });
  };

  useEffect(() => {
    if (createGroupResult?.serverError) {
      alert(`Error: ${createGroupResult.serverError}`);
    } else if (createGroupResult?.data?.id) {
      // Reload groups and select the newly created one
      async function reloadGroups() {
        const groups = await getGroups();
        setAllGroups(groups);
        const newGroup = groups.find((g) => g.id === createGroupResult.data?.id);
        if (newGroup) {
          const currentGroups = form.getValues('groupIds') || [];
          form.setValue('groupIds', [...currentGroups, newGroup.id]);
        }
      }
      reloadGroups();
      setNewGroupName('');
      setShowAddGroup(false);
    }
  }, [createGroupResult, form]);

  const onSubmit = (values: FormValues) => {
    updateContactAction({
      id,
      name: values.name,
      profileLink: values.profileLink || '',
      reason: values.reason || '',
      groupIds: values.groupIds && values.groupIds.length > 0 ? values.groupIds : undefined
    });
  };

  useEffect(() => {
    if (updateResult?.serverError) {
      alert(`Error: ${updateResult.serverError}`);
    } else if (updateResult?.data) {
      router.push(`/contacts/${id}`);
    }
  }, [updateResult, router, id]);

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter name"
                      className="mt-1 text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="LinkedIn or WhatsApp URL"
                      className="mt-1 text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason to Connect</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Why do you want to connect?"
                      className="mt-1 flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Groups</FormLabel>
              <div className="mt-2 flex flex-wrap gap-2 items-center">
                {allGroups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedGroups.includes(group.id)
                        ? 'bg-[#0A66C2] border border-transparent text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {group.name}
                  </button>
                ))}
                {showAddGroup ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Group name"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCreateGroup();
                        } else if (e.key === 'Escape') {
                          setShowAddGroup(false);
                          setNewGroupName('');
                        }
                      }}
                      className="h-9 w-32 text-sm"
                      autoFocus
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCreateGroup}
                      disabled={isExecuting(createGroupStatus) || !newGroupName.trim()}
                    >
                      {isExecuting(createGroupStatus) ? '...' : 'Add'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddGroup(false);
                        setNewGroupName('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddGroup(true)}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                  >
                    + Add
                  </Button>
                )}
              </div>
            </div>

            <div className="flex gap-6 items-center justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isExecuting(updateStatus)}>
                {isExecuting(updateStatus) ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
