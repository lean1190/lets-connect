import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120, 'Name can be 120 characters long'),
  profileLink: z.url('Invalid URL').max(500, 'Url can be 500 characters long'),
  reason: z.string().min(1, 'Reason is required').max(2000, 'Reason can be 2000 characters long'),
  circleIds: z.array(z.uuid()).optional()
});
