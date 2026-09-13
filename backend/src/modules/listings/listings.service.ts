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

/**
 * @param {number} id Author id
 * @param {CreateListingSchema} data Listing data
 * @returns Created listing data
 */
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

/**
 * @description Returns all listings, only, or not only with specific author id (partial data).
 * @param {number} page
 * @param {number} limit Number of listed listings
 * @param {number} authorId Listings of author with id
 * @returns List of listings (partial data)
 */
export async function listListings(page: number, limit: number, authorId?: number) {
    const where: Prisma.ListingWhereInput = authorId !== undefined ? { authorId } : {};

    const [listings, total] = await Promise.all([
        prisma.listing.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.listing.count({ where }),
    ]);

    return { listings, total, page, limit };
}

/**
 * @description Finds listing by id and returns all data.
 * @param {number} id Listing id
 * @returns Listing data
 */
export async function getListing(id: number) {
    return prisma.listing.findUnique({ where: { id } });
}

/**
 * @description Updates listing based on passed data.
 * @param {number} id Listing id
 * @param {UpdateListingSchema} input New listing data
 * @returns Updated listing data
 */
export async function updateListing(id: number, input: z.infer<typeof UpdateListingSchema>) {
    const data = omitUndefined(input) as Prisma.ListingUpdateInput;

    const listing = await prisma.listing.update({
        where: { id },
        data,
    });

    return listing;
}

/**
 * @param {number} id Listing id
 * @returns Deleted listing data
 */
export async function deleteListing(id: number) {
    return prisma.listing.delete({ where: { id } });
}
