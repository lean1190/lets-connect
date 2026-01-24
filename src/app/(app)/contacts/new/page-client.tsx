'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useHookFormAction,
  useHookFormOptimisticAction
} from '@next-safe-action/adapter-react-hook-form/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import { createCircleSchema } from '@/lib/circles/create/schema';
import type { Circle } from '@/lib/circles/types';
import { AppRoute } from '@/lib/constants/navigation';
import { createContact } from '@/lib/contacts/create/actions/create';
import { createContactSchema } from '@/lib/contacts/create/schema';
import { isExecuting } from '@/lib/server-actions/status';
import { CircleButton } from '../components/circle-button';

type Props = {
  profileLink: string;
  initialCircles: Circle[];
};

export function NewContactPageClient({ profileLink, initialCircles }: Props) {
  const router = useRouter();
  const [showAddCircle, setShowAddCircle] = useState(false);

  const { form, action, handleSubmitWithAction } = useHookFormAction(
    createContact,
    zodResolver(createContactSchema),
    {
      formProps: {
        defaultValues: {
          profileLink,
          name: '',
          reason: '',
          circleIds: []
        }
      }
    }
  );

  const {
    form: circleForm,
    action: circleAction,
    handleSubmitWithAction: handleCreateCircleSubmit
  } = useHookFormOptimisticAction(createCircle, zodResolver(createCircleSchema), {
    actionProps: {
      currentState: { circles: initialCircles },
      updateFn: (state, input) => {
        const optimisticCircle: Circle = {
          ...input,
          id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString()
        };

        return { circles: [...state.circles, optimisticCircle] };
      },
      onSuccess: () => hideAddCircleForm()
    },
    formProps: {
      defaultValues: {
        name: '',
        description: null,
        color: null,
        icon: null
      }
    }
  });

  const selectedCircles = form.watch('circleIds') ?? [];

  const toggleCircle = (circleId: string) => {
    const selectedCircleIds = selectedCircles;
    const updatedSelectedCircles = selectedCircleIds.includes(circleId)
      ? selectedCircleIds.filter((id) => id !== circleId)
      : [...selectedCircleIds, circleId];

    form.setValue('circleIds', updatedSelectedCircles);
  };

  const hideAddCircleForm = () => {
    setShowAddCircle(false);
    circleForm.reset();
  };

  const saveNewCircle = (e?: React.BaseSyntheticEvent) => {
    setShowAddCircle(false);
    handleCreateCircleSubmit(e);
  };

  useEffect(() => {
    if (circleAction.result?.serverError) {
      alert(`Error: ${circleAction.result.serverError}`);
    }
  }, [circleAction.result]);

  useEffect(() => {
    if (action.result?.serverError) {
      return alert(`Error: ${action.result.serverError}`);
    }

    if (action.result?.data) {
      router.replace(AppRoute.Contacts);
    }
  }, [action.result, router]);

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={handleSubmitWithAction} className="space-y-6">
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
                      disabled={!!profileLink}
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
                {circleAction.optimisticState.circles.map((circle) => (
                  <CircleButton
                    key={circle.id}
                    circle={circle}
                    isSelected={selectedCircles.includes(circle.id)}
                    onClick={() => toggleCircle(circle.id)}
                  />
                ))}
                {showAddCircle ? (
                  <Form {...circleForm}>
                    <div className="flex items-center gap-2">
                      <FormField
                        control={circleForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="mb-0">
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Circle name"
                                className="h-9 w-32 text-sm"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    saveNewCircle();
                                  } else if (e.key === 'Escape') {
                                    e.preventDefault();
                                    hideAddCircleForm();
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={saveNewCircle}
                        disabled={
                          isExecuting(circleAction.status) || !circleForm.watch('name')?.trim()
                        }
                      >
                        {isExecuting(circleAction.status) ? '...' : 'Add'}
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={hideAddCircleForm}>
                        Cancel
                      </Button>
                    </div>
                  </Form>
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
              <Button type="submit" disabled={isExecuting(action.status)}>
                {isExecuting(action.status) ? 'Saving...' : 'Save Contact'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
