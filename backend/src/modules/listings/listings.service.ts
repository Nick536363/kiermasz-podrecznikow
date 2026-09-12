/**
 * module name:
 *  + listings.service.ts
 *
 * description:
 *  + Defines listing services.
 */

import { z } from 'zod/v4';

import { omitUndefined } from '@/lib/omit-undefined.js';
import { prisma } from '@/db/client.js';
import type { Prisma } from '@/db/generated/client.js';
import { CreateListingSchema, UpdateListingSchema } from './listings.schemas.js';

export async function createListing(id: number, data: z.infer<typeof CreateListingSchema>) {
    return prisma.listing.create({
        data: {
            name: data.name,
            description: data.description,
            seller: data.seller,
            updatedAt: new Date(),
            authorId: id,
        },
    });
}

export async function listListings(pages: number, limit: number) {
    const [listings, total] = await Promise.all([
        prisma.listing.findMany({
            orderBy: { createdAt: 'desc' },
            skip: (pages - 1) * limit,
            take: limit,
        }),
        prisma.listing.count(),
    ]);

    return { listings, total, pages, limit };
}

export async function getListing(id: number) {
    return prisma.listing.findUnique({ where: { id } });
}

export async function updateListing(id: number, input: z.infer<typeof UpdateListingSchema>) {
    const data = omitUndefined(input) as Prisma.ListingUpdateInput;

    const listing = await prisma.listing.update({
        where: { id },
        data,
    });

    return listing;
}

export async function deleteListing(id: number) {
    return prisma.listing.delete({ where: { id } });
}
