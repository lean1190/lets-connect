'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconLink } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
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
import { updateSettings } from '@/lib/server-actions/settings';

const QRCodeSVG = dynamic(() => import('qrcode.react').then((mod) => mod.QRCodeSVG), {
  ssr: false
}) as React.ComponentType<{ value: string; size?: number }>;

const formSchema = z.object({
  qrLink: z
    .string()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message: 'Please enter a valid URL'
    })
    .optional()
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  initialQrLink: string | null;
};

export function MyQRPageClient({ initialQrLink }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qrLink: initialQrLink || ''
    }
  });

  // useEffect(() => {
  //   form.reset({ qrLink: initialQrLink || '' });
  // }, [initialQrLink, form]);

  const onSubmit = async (values: FormValues) => {
    await updateSettings({ qrLink: values.qrLink || null });
    setIsEditing(false);
  };

  const startEditing = () => {
    form.reset({ qrLink: initialQrLink || '' });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    form.reset({ qrLink: initialQrLink || '' });
    setIsEditing(false);
  };

  if (!initialQrLink && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <IconLink
          className="w-16 h-16 text-gray-400 dark:text-muted-foreground mb-4"
          stroke={1.5}
        />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-3">
          Set up your QR code
        </h2>
        <p className="text-gray-600 dark:text-muted-foreground mb-8 max-w-md">
          Add your LinkedIn or Wsp URL
        </p>
        <Button onClick={startEditing}>Add URL</Button>
      </div>
    );
  }

  return (
    <div>
      {isEditing ? (
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="qrLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL (e.g. LinkedIn or Wsp)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="mt-1"
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end items-center gap-4">
                  <Button type="button" variant="outline" onClick={cancelEditing}>
                    Cancel
                  </Button>
                  <Button type="submit">Save link</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center">
          <Card className="p-6 mb-4">
            <QRCodeSVG value={initialQrLink || ''} size={200} />
          </Card>
          <p className="text-gray-500 dark:text-muted-foreground text-sm text-center mb-6 max-w-md">
            Let others scan this QR code to connect with you
          </p>
          <Link
            href={initialQrLink || ''}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-sm mb-4 text-center"
          >
            {initialQrLink}
          </Link>
          <Button onClick={startEditing}>Change URL</Button>
        </div>
      )}
    </div>
  );
}
