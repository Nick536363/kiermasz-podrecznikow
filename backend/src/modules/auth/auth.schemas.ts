/**
 * module name:
 *  + auth.schemas.ts
 *
 * description:
 *  + Defines authorization schemas.
 */

import { z } from 'zod';

export const LoginSchema = z.object({
    name: z.string().min(1),
    password: z.string().min(1),
});

export const AuthResponseSchema = z.object({
    accessToken: z.string(),
});
