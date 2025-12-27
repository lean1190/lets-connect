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
import { getGroupById, updateGroup } from '@/lib/server-actions/groups';
import { isExecuting } from '@/lib/server-actions/status';

const formSchema = z.object({
  name: z.string().min(1, 'Group name is required').trim()
});

type FormValues = z.infer<typeof formSchema>;

export default function EditGroupPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);

  const {
    execute: updateGroupAction,
    status: updateStatus,
    result: updateResult
  } = useAction(updateGroup);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  });

  useEffect(() => {
    async function loadData() {
      try {
        const group = await getGroupById(id);

        if (group) {
          form.reset({
            name: group.name
          });
        }
      } catch (error) {
        console.error('Error loading group:', error);
        alert('Failed to load group');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, form]);

  const onSubmit = (values: FormValues) => {
    updateGroupAction({
      id,
      name: values.name
    });
  };

  useEffect(() => {
    if (updateResult?.serverError) {
      alert(`Error: ${updateResult.serverError}`);
    } else if (updateResult?.data) {
      router.push(`/groups/${id}`);
    }
  }, [updateResult, router, id]);

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
                    Group Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter group name"
                      className="mt-1 text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
