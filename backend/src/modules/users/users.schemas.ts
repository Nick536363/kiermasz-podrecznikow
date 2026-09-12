/**
 * module name:
 *  + users.response.ts
 *
 * description:
 *  + Defines user schemas.
 */

import z from 'zod';

export const CreateUserSchema = z.object({
    name: z.string().min(1).max(100),
    password: z.string().min(8).max(100),
    role: z.enum(['USER', 'ADMIN']).default('USER'),
});

export const UpdateUserSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(8).max(100).optional(),
});

export const UserParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const ListUsersQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export const UserResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    role: z.enum(['USER', 'ADMIN']),
    createdAt: z.date(),
});
