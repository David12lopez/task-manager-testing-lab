import { z } from 'zod';

export const RemoteTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1),
  status: z.enum(['pending', 'completed']),
  createdAt: z.string().datetime().optional(),
});

export const RemoteTaskListSchema = z.array(RemoteTaskSchema);

export type RemoteTaskContract = z.infer<typeof RemoteTaskSchema>;
