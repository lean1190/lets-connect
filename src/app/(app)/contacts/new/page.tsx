'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { createContact } from '@/lib/server-actions/contacts';
import { getGroups } from '@/lib/server-actions/groups';
import { isExecuting } from '@/lib/server-actions/status';

const formSchema = z.object({
  profileLink: z.string().min(1, 'Profile link is required'),
  name: z.string().min(1, 'Name is required').trim(),
  reason: z.string().min(1, 'Reason to contact is required').trim(),
  groupIds: z.array(z.string()).optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function NewContactPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileLinkFromQr = searchParams.get('profileLink') || '';

  const [allGroups, setAllGroups] = useState<Array<{ id: string; name: string }>>([]);

  const { execute: createContactAction, status, result } = useAction(createContact);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileLink: profileLinkFromQr,
      name: '',
      reason: '',
      groupIds: []
    }
  });

  const selectedGroups = form.watch('groupIds') || [];

  useEffect(() => {
    async function loadGroups() {
      const groups = await getGroups();
      setAllGroups(groups);
    }
    loadGroups();
  }, []);

  // Update form when profileLink from QR changes
  useEffect(() => {
    if (profileLinkFromQr) {
      form.setValue('profileLink', profileLinkFromQr);
    }
  }, [profileLinkFromQr, form]);

  const toggleGroup = (groupId: string) => {
    const currentGroups = form.getValues('groupIds') || [];
    const newGroups = currentGroups.includes(groupId)
      ? currentGroups.filter((id) => id !== groupId)
      : [...currentGroups, groupId];
    form.setValue('groupIds', newGroups);
  };

  const onSubmit = (values: FormValues) => {
    createContactAction({
      name: values.name,
      profileLink: values.profileLink || '',
      reason: values.reason,
      groupIds: values.groupIds && values.groupIds.length > 0 ? values.groupIds : undefined
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
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="profileLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile link</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="https://www.linkedin.com/in/leanvilas/"
                        disabled={!!profileLinkFromQr}
                        className="mt-1 text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        placeholder="Lean Vilas"
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
                    <FormLabel>
                      Reason to contact <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="Why do you want to contact this person?"
                        className="mt-1 flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {allGroups.length > 0 && (
                <div>
                  <FormLabel>Groups</FormLabel>
                  <div className="mt-2 flex flex-wrap gap-2">
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
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isExecuting(status)} className="flex-1">
                  {isExecuting(status) ? 'Saving...' : 'Save Contact'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
