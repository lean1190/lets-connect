import { z } from 'zod';

export const updateContactSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(120).trim(),
  profileLink: z.url().max(500),
  reason: z.string().min(1).max(2000).optional(),
  circleIds: z.array(z.uuid()).optional()
});
