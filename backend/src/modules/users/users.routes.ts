/**
 * module name:
 *  + users.routes.ts
 *
 * description:
 *  + Defines users CRUD routes.
 */

import type { FastifyInstance } from 'fastify';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import {
    CreateUserSchema,
    UpdateUserSchema,
    UserParamsSchema,
    ListUsersQuerySchema,
    UserResponseSchema,
} from './users.schemas.js';
import * as usersService from './users.service.js';

export const userRoutes: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
    // ME
    fastify.get(
        '/me',
        {
            preHandler: [fastify.authenticate],
            schema: { response: { 200: UserResponseSchema } },
        },
        async (request, reply) => {
            const user = await usersService.getUser(request.user.id);

            if (!user) {
                return reply.notFound();
            }

            return user;
        },
    );

    fastify.patch(
        '/me',
        {
            preHandler: [fastify.authenticate],
            schema: { body: UpdateUserSchema, response: { 200: UserResponseSchema } },
        },
        async (request) => usersService.updateUser(request.user.id, request.body),
    );

    //
    // ONLY ADMIN!
    //

    // CREATE
    fastify.post(
        '/',
        {
            preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')],
            schema: { body: CreateUserSchema, response: { 201: UserResponseSchema } },
        },
        async (request, reply) => {
            const user = await usersService.createUser(request.body);

            reply.code(201);
            return user;
        },
    );

    // READ
    fastify.get(
        '/',
        {
            preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')],
            schema: { querystring: ListUsersQuerySchema },
        },
        async (request) => {
            const { page, limit } = request.query;

            return usersService.listUsers(page, limit);
        },
    );

    fastify.get(
        '/:id',
        {
            preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')],
            schema: { params: UserParamsSchema, response: { 200: UserResponseSchema } },
        },
        async (request, reply) => {
            const user = await usersService.getUser(request.params.id);

            if (!user) {
                return reply.notFound();
            }

            return user;
        },
    );

    // UPDATE
    fastify.patch(
        '/:id',
        {
            preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')],
            schema: { body: UpdateUserSchema, response: { 200: UserResponseSchema } },
        },
        async (request) => usersService.updateUser(request.user.id, request.body),
    );

    // DELERE
    fastify.delete(
        '/:id',
        {
            preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')],
            schema: { params: UserParamsSchema },
        },
        async (request, reply) => {
            await usersService.deleteUser(request.params.id);

            reply.code(204);
        },
    );
};
