'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { AppRoute } from '@/lib/constants/navigation';
import { isExecuting } from '@/lib/server-actions/status';

const formSchema = z.object({
  name: z.string().min(1, 'Circle name is required').trim(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable()
});

type FormValues = z.infer<typeof formSchema>;

export default function NewCirclePageClient() {
  const router = useRouter();
  const { execute: createCircleAction, status, result } = useAction(createCircle);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      color: null,
      description: null,
      icon: null
    }
  });

  const onSubmit = (values: FormValues) => {
    createCircleAction({
      name: values.name,
      color: values.color || null,
      description: values.description || null,
      icon: values.icon || null
    });
  };

  useEffect(() => {
    if (result?.serverError) {
      alert(`Error: ${result.serverError}`);
    } else if (result?.data) {
      router.replace(AppRoute.Circles);
    }
  }, [result, router]);

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
              <Button type="submit" disabled={isExecuting(status)}>
                {isExecuting(status) ? 'Creating...' : 'Create Circle'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
