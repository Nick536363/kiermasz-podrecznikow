/**
 * module name:
 *  + listings.schemas.ts
 *
 * description:
 *  + Defines listing schemas.
 */

import { z } from 'zod/v4';

export const CreateListingSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(2).max(200),
    seller: z.string().min(2).max(100),
});

export const UpdateListingSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(2).max(200).optional(),
    seller: z.string().min(2).max(100).optional(),
});

export const ListingParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const ListListingsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export const ListingResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    seller: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    authorId: z.number(),
});
