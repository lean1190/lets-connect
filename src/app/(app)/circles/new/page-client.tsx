'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { useRouter } from 'next/navigation';
import { IconPicker } from '@/components/icon-picker';
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
import { AppRoute } from '@/lib/constants/navigation';
import { isExecuting } from '@/lib/server-actions/status';

export default function NewCirclePageClient() {
  const router = useRouter();

  const { form, action, handleSubmitWithAction } = useHookFormAction(
    createCircle,
    zodResolver(createCircleSchema),
    {
      formProps: {
        defaultValues: {
          name: '',
          color: null,
          description: null,
          icon: null
        }
      },
      actionProps: {
        onSuccess: () => router.replace(AppRoute.Circles),
        onError: ({ error }) => alert(`Error: ${error}`)
      }
    }
  );

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
                    Circle Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter circle name"
                      className="mt-1"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter circle description"
                      className="mt-1"
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="color"
                        className="mt-1 h-10 w-full"
                        value={field.value || '#000000'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <div className="mt-1">
                        <IconPicker
                          value={field.value || null}
                          onChange={(iconName) => field.onChange(iconName)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 items-center justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isExecuting(action.status)}>
                {isExecuting(action.status) ? 'Creating...' : 'Create Circle'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
