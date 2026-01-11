'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { Suspense, useEffect, useState } from 'react';
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
import { createCircle } from '@/lib/circles/create/actions/create';
import { getCircles } from '@/lib/circles/get/get';
import type { CircleOutput } from '@/lib/circles/types';
import { createContact } from '@/lib/contacts/create/actions/create';
import { isExecuting } from '@/lib/server-actions/status';
import { CircleButton } from '../components/circle-button';

const formSchema = z.object({
  profileLink: z.string().min(1, 'Profile link is required'),
  name: z.string().min(1, 'Name is required').trim(),
  reason: z.string().min(1, 'Reason to contact is required').trim(),
  circleIds: z.array(z.string()).optional()
});

type FormValues = z.infer<typeof formSchema>;

function NewContactForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileLinkFromQr = searchParams.get('profileLink') || '';

  const [allCircles, setAllCircles] = useState<CircleOutput[]>([]);
  const [showAddCircle, setShowAddCircle] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');

  const { execute: createContactAction, status, result } = useAction(createContact);
  const {
    execute: createCircleAction,
    status: createCircleStatus,
    result: createCircleResult
  } = useAction(createCircle);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileLink: profileLinkFromQr,
      name: '',
      reason: '',
      circleIds: []
    }
  });

  const selectedCircles = form.watch('circleIds') || [];

  useEffect(() => {
    async function loadCircles() {
      const circles = await getCircles();
      setAllCircles(circles);
    }
    loadCircles();
  }, []);

  // Update form when profileLink from QR changes
  useEffect(() => {
    if (profileLinkFromQr) {
      form.setValue('profileLink', profileLinkFromQr);
    }
  }, [profileLinkFromQr, form]);

  const toggleCircle = (circleId: string) => {
    const currentCircles = form.getValues('circleIds') || [];
    const newCircles = currentCircles.includes(circleId)
      ? currentCircles.filter((id) => id !== circleId)
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
    createContactAction({
      name: values.name,
      profileLink: values.profileLink || '',
      reason: values.reason,
      circleIds: values.circleIds && values.circleIds.length > 0 ? values.circleIds : undefined
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
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="profileLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Profile link <span className="text-red-500">*</span>
                  </FormLabel>
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

            <div className="flex gap-4 items-center justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isExecuting(status)}>
                {isExecuting(status) ? 'Saving...' : 'Save Contact'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function NewContactPage() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="h-10 w-full bg-gray-200 dark:bg-muted rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 dark:bg-muted rounded animate-pulse" />
              <div className="h-24 w-full bg-gray-200 dark:bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      }
    >
      <NewContactForm />
    </Suspense>
  );
}
