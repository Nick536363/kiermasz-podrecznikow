/**
 * module name:
 *  + listings.routes.ts
 *
 * description:
 *  + Defines listing routes.
 */

import { FastifyInstance } from 'fastify';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { prisma } from '@/db/client.js';
import * as listingService from './listings.service.js';
import {
    CreateListingSchema,
    ListingParamSchema,
    ListingResponseSchema,
    ListListingsQuerySchema,
    UpdateListingSchema,
} from './listings.schemas.js';

export const listingRoutes: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
    // CREATE
    fastify.post(
        '/',
        {
            preHandler: [fastify.authenticate],
            schema: { body: CreateListingSchema, response: { 201: ListingResponseSchema } },
        },
        async (request, reply) => {
            const listing = await listingService.createListing(request.user.id, request.body);

            reply.code(201);
            return listing;
        },
    );

    // READ
    fastify.get(
        '/',
        {
            preHandler: [fastify.authenticate],
            schema: { querystring: ListListingsQuerySchema },
        },
        async (request) => {
            const { pages, limit } = request.query;

            return listingService.listListings(pages, limit);
        },
    );

    fastify.get(
        '/:id',
        {
            preHandler: [fastify.authenticate],
            schema: { params: ListingParamSchema, response: { 200: ListingResponseSchema } },
        },
        async (request, reply) => {
            const listing = await listingService.getListing(request.params.id);

            if (!listing) {
                return reply.notFound();
            }

            return listing;
        },
    );

    // UPDATE
    fastify.patch(
        '/:id',
        {
            preHandler: [
                fastify.authenticate,
                fastify.requireOwner(async (id) => {
                    const post = await prisma.listing.findUnique({
                        where: { id },
                        select: { authorId: true },
                    });

                    return post?.authorId ?? null;
                }),
            ],
            schema: { body: UpdateListingSchema, response: { 200: ListingResponseSchema } },
        },
        async (request) => listingService.updateListing(request.params.id, request.body),
    );

    // DELETE
    fastify.delete(
        '/:id',
        {
            preHandler: [
                fastify.authenticate,
                fastify.requireOwner(async (id) => {
                    const post = await prisma.listing.findUnique({
                        where: { id },
                        select: { authorId: true },
                    });

                    return post?.authorId ?? null;
                }),
            ],
        },
        async (request, reply) => {
            await listingService.deleteListing(request.params.id);

            reply.code(204);
        },
    );
};
