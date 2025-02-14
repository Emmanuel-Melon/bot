import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = userSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateUserSchema = createUserSchema.partial();

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
