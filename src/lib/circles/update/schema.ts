import { z } from 'zod';

export const updateCircleSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Circle name is required').max(120).trim(),
  description: z.string().max(1000).optional().nullable(),
  color: z.string().optional().nullable(),
  icon: z.string().optional().nullable()
});
