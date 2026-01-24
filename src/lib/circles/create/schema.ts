import { z } from 'zod';

export const createCircleSchema = z.object({
  name: z.string().min(1, 'Circle name is required').max(120, 'Name can be 120 characters long'),
  description: z
    .string()
    .max(1000, 'Description can be 1000 characters long')
    .optional()
    .nullable(),
  color: z.string().optional().nullable(),
  icon: z.string().optional().nullable()
});
