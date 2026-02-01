'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { useRouter } from 'next/navigation';
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
import type { Circle } from '@/lib/circles/types';
import { AppRoute } from '@/lib/constants/navigation';
import { updateContact } from '@/lib/contacts/update/actions/update';
import { updateContactSchema } from '@/lib/contacts/update/schema';
import { isExecuting } from '@/lib/server-actions/status';
import { CircleButton } from '../components/circle-button';
import { DeleteContactButton } from '../components/delete-contact-button';
import { useAddCircles } from '../hooks/use-add-circles';

type Props = {
  contactId: string;
  initialContact: {
    url: string | null;
    name: string;
    reason: string | null;
    circles?: Array<{ id: string }>;
  } | null;
  initialCircles: Circle[];
};

export function EditContactPageClient({ contactId, initialContact, initialCircles }: Props) {
  const router = useRouter();

  const { form, action, handleSubmitWithAction } = useHookFormAction(
    updateContact,
    zodResolver(updateContactSchema),
    {
      formProps: {
        defaultValues: {
          id: contactId,
          profileLink: initialContact?.url || undefined,
          name: initialContact?.name ?? '',
          reason: initialContact?.reason || undefined,
          circleIds: initialContact?.circles?.map((c) => c.id) ?? []
        }
      },
      actionProps: {
        onSuccess: () => router.replace(AppRoute.Contacts),
        onError: ({ error }) => alert(`Error: ${error}`)
      }
    }
  );

  const {
    circles,
    circleForm,
    circleAction,
    showAddCircle,
    setShowAddCircle,
    hideAddCircleForm,
    saveNewCircle,
    toggleCircle
  } = useAddCircles({
    initialCircles,
    getSelectedCircleIds: () => form.getValues('circleIds') ?? [],
    setSelectedCircleIds: (ids) => form.setValue('circleIds', ids)
  });

  const selectedCircles = form.watch('circleIds') ?? [];

  if (!initialContact) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500 dark:text-muted-foreground">
            Contact not found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={handleSubmitWithAction} className="space-y-6">
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
                {circles.map((circle) => (
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

            <div className="flex items-center justify-between">
              <DeleteContactButton
                contactId={contactId}
                contactName={form.watch('name') ?? initialContact.name ?? ''}
              />
              <div className="flex gap-4 items-center">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isExecuting(action.status)}>
                  {isExecuting(action.status) ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
