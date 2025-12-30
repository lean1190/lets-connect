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
import type { CircleOutput } from '@/lib/circles/types';
import { createCircle, getCircles } from '@/lib/server-actions/circles';
import { getContactById, updateContact } from '@/lib/server-actions/contacts';
import { isExecuting } from '@/lib/server-actions/status';
import { CircleButton } from '../components/circle-button';
import { DeleteContactButton } from '../components/delete-contact-button';

const formSchema = z.object({
  profileLink: z.string().optional(),
  name: z.string().min(1, 'Name is required').trim(),
  reason: z.string().trim().optional(),
  circleIds: z.array(z.string()).optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function EditContactPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [allCircles, setAllCircles] = useState<CircleOutput[]>([]);
  const [showAddCircle, setShowAddCircle] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');

  const {
    execute: updateContactAction,
    status: updateStatus,
    result: updateResult
  } = useAction(updateContact);
  const {
    execute: createCircleAction,
    status: createCircleStatus,
    result: createCircleResult
  } = useAction(createCircle);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileLink: '',
      name: '',
      reason: '',
      circleIds: []
    }
  });

  const selectedCircles = form.watch('circleIds') || [];

  useEffect(() => {
    async function loadData() {
      try {
        const [contact, circles] = await Promise.all([getContactById(id), getCircles()]);

        if (contact) {
          form.reset({
            profileLink: contact.url || '',
            name: contact.name,
            reason: contact.reason || '',
            circleIds: contact.circles?.map((c) => c.id) || []
          });
        }
        setAllCircles(circles);
      } catch (error) {
        console.error('Error loading contact:', error);
        alert('Failed to load contact');
      }
    }
    loadData();
  }, [id, form]);

  const toggleCircle = (circleId: string) => {
    const currentCircles = form.getValues('circleIds') || [];
    const newCircles = currentCircles.includes(circleId)
      ? currentCircles.filter((cid: string) => cid !== circleId)
      : [...currentCircles, circleId];
    form.setValue('circleIds', newCircles);
  };

  const handleCreateCircle = async () => {
    if (!newCircleName.trim()) {
      return;
    }

    createCircleAction({ name: newCircleName.trim() });
  };

  useEffect(() => {
    if (createCircleResult?.serverError) {
      alert(`Error: ${createCircleResult.serverError}`);
    } else if (createCircleResult?.data?.id) {
      // Reload circles and select the newly created one
      async function reloadCircles() {
        const circles = await getCircles();
        setAllCircles(circles);
        const newCircle = circles.find((c) => c.id === createCircleResult.data?.id);
        if (newCircle) {
          const currentCircles = form.getValues('circleIds') || [];
          form.setValue('circleIds', [...currentCircles, newCircle.id]);
        }
      }
      reloadCircles();
      setNewCircleName('');
      setShowAddCircle(false);
    }
  }, [createCircleResult, form]);

  const onSubmit = (values: FormValues) => {
    updateContactAction({
      id,
      name: values.name,
      profileLink: values.profileLink || '',
      reason: values.reason || '',
      circleIds: values.circleIds && values.circleIds.length > 0 ? values.circleIds : undefined
    });
  };

  useEffect(() => {
    if (updateResult?.serverError) {
      alert(`Error: ${updateResult.serverError}`);
    } else if (updateResult?.data) {
      router.push('/contacts');
    }
  }, [updateResult, router]);

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
              <FormLabel>Circles</FormLabel>
              <div className="mt-2 flex flex-wrap gap-2 items-center">
                {allCircles.map((circle) => (
                  <CircleButton
                    key={circle.id}
                    circle={circle}
                    isSelected={selectedCircles.includes(circle.id)}
                    onClick={() => toggleCircle(circle.id)}
                  />
                ))}
                {showAddCircle ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Circle name"
                      value={newCircleName}
                      onChange={(e) => setNewCircleName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCreateCircle();
                        } else if (e.key === 'Escape') {
                          setShowAddCircle(false);
                          setNewCircleName('');
                        }
                      }}
                      className="h-9 w-32 text-sm"
                      autoFocus
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCreateCircle}
                      disabled={isExecuting(createCircleStatus) || !newCircleName.trim()}
                    >
                      {isExecuting(createCircleStatus) ? '...' : 'Add'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddCircle(false);
                        setNewCircleName('');
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
                    onClick={() => setShowAddCircle(true)}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                  >
                    + Add
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <DeleteContactButton contactId={id} contactName={form.watch('name')} />
              <div className="flex gap-4 items-center">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isExecuting(updateStatus)}>
                  {isExecuting(updateStatus) ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
