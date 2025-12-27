'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useEffect } from 'react';
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
                {isExecuting(updateStatus) ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
