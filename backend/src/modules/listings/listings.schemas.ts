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
    price: z.coerce.number().positive().multipleOf(0.01),
    originalPrice: z.coerce.number().positive().multipleOf(0.01),
});

export const UpdateListingSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(2).max(200).optional(),
    seller: z.string().min(2).max(100).optional(),
    price: z.coerce.number().positive().multipleOf(0.01).optional(),
    originalPrice: z.coerce.number().positive().multipleOf(0.01).optional(),
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
    price: z.number(),
    originalPrice: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    authorId: z.number(),
});
