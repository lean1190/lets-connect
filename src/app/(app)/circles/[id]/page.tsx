'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useState } from 'react';
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
import { getCircleById, updateCircle } from '@/lib/server-actions/circles';
import { isExecuting } from '@/lib/server-actions/status';
import { DeleteCircleButton } from '../components/delete-circle-button';

const formSchema = z.object({
  name: z.string().min(1, 'Circle name is required').trim(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable()
});

type FormValues = z.infer<typeof formSchema>;

export default function EditCirclePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [circleName, setCircleName] = useState('');

  const {
    execute: updateCircleAction,
    status: updateStatus,
    result: updateResult
  } = useAction(updateCircle);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      color: null,
      description: null,
      icon: null
    }
  });

  useEffect(() => {
    async function loadData() {
      try {
        const circle = await getCircleById(id);

        if (circle) {
          setCircleName(circle.name);
          form.reset({
            name: circle.name,
            color: circle.color || null,
            description: circle.description || null,
            icon: circle.icon || null
          });
        }
      } catch (error) {
        console.error('Error loading circle:', error);
        alert('Failed to load circle');
      }
    }
    loadData();
  }, [id, form]);

  const onSubmit = (values: FormValues) => {
    updateCircleAction({
      id,
      name: values.name,
      color: values.color || null,
      description: values.description || null,
      icon: values.icon || null
    });
  };

  useEffect(() => {
    if (updateResult?.serverError) {
      alert(`Error: ${updateResult.serverError}`);
    } else if (updateResult?.data) {
      router.push(`/circles`);
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
                    Circle Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter circle name"
                      className="mt-1 text-sm"
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
                      className="mt-1 text-sm"
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

            <div className="flex items-center justify-between">
              <DeleteCircleButton circleId={id} circleName={circleName || form.watch('name')} />
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
