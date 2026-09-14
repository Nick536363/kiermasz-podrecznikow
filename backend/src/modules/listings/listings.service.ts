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
import { Prisma } from '@/db/generated/client.js';
import { CreateListingSchema, UpdateListingSchema } from './listings.schemas.js';

/**
 * @description Serializes listings from database (Decimal -> number).
 * @param listing Listing JSON
 * @returns Serialized listing
 */
function serializeListing<T extends { price: unknown; originalPrice?: unknown }>(listing: T) {
    return {
        ...listing,
        price: Number(listing.price),
        ...(listing.originalPrice !== undefined && {
            originalPrice: Number(listing.originalPrice),
        }),
    };
}

/**
 * @param {number} id Author id
 * @param {CreateListingSchema} data Listing data
 * @returns Created listing data
 */
export async function createListing(id: number, data: z.infer<typeof CreateListingSchema>) {
    const listing = await prisma.listing.create({
        data: {
            name: data.name,
            description: data.description,
            seller: data.seller,
            price: data.price,
            originalPrice: data.originalPrice,
            updatedAt: new Date(),
            authorId: id,
        },
    });

    return serializeListing(listing);
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

    return { listings: listings.map(serializeListing), total, page, limit };
}

/**
 * @description Finds listing by id and returns all data.
 * @param {number} id Listing id
 * @returns Listing data
 */
export async function getListing(id: number) {
    const listing = await prisma.listing.findUnique({ where: { id } });

    return listing ? serializeListing(listing) : null;
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

    return serializeListing(listing);
}

/**
 * @param {number} id Listing id
 * @returns Deleted listing data
 */
export async function deleteListing(id: number) {
    const listing = await prisma.listing.delete({ where: { id } });

    return serializeListing(listing);
}
