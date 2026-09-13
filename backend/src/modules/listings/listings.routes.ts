/**
 * module name:
 *  + listings.routes.ts
 *
 * description:
 *  + Defines listing routes.
 */

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

/**
 * @description Encapsulates statistic routes
 * @param {FastifyInstance} fastify Encapsulated Fastify Instance
 */
export const listingRoutes: FastifyPluginAsyncZod = async (fastify) => {
    // ME
    fastify.get(
        '/me',
        {
            preHandler: [fastify.authenticate],
            schema: { querystring: ListListingsQuerySchema },
        },
        async (request) => {
            const { page, limit } = request.query;

            return listingService.listListings(page, limit, request.user.id);
        },
    );

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
            const { page, limit } = request.query;

            return listingService.listListings(page, limit);
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
            schema: {
                params: ListingParamSchema,
                body: UpdateListingSchema,
                response: { 200: ListingResponseSchema },
            },
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
            schema: {
                params: ListingParamSchema,
            },
        },
        async (request, reply) => {
            await listingService.deleteListing(request.params.id);

            reply.code(204);
        },
    );
};
