/**
 * module name:
 *  + app.ts
 *
 * description:
 *  + Defines Fastify's routes and installs plugins.
 */

import Fastify from 'fastify';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import type { FastifyInstance, FastifyServerOptions } from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import sensible from '@fastify/sensible';
import cookie from '@fastify/cookie';

import cors from '@fastify/cors';

import authenticate from './plugins/authenticate.js';
import requireOwner from './plugins/require-owner.js';
import requireRole from './plugins/require-role.js';

import { statisticRoutes } from './modules/statistics/statistics.routes.js';
import { userRoutes } from './modules/users/users.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { listingRoutes } from './modules/listings/listings.routes.js';

const CORS_ORIGIN = process.env.FRONTEND_URL;

/**
 * @description Encapsulates API routes
 * @param {FastifyInstance} fastify Encapsulated Fastify Instance
 */
const registerAPI: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
    await fastify.register(authRoutes, { prefix: '/auth' });
    await fastify.register(userRoutes, { prefix: '/users' });
    await fastify.register(listingRoutes, { prefix: '/listings' });
};

/**
 * @description Creates Fastify's server object.
 * @param {FastifyServerOptions} options Options for the server.
 * @returns {FastifyInstance} Instance of Fastify's server.
 */
export async function createServer(options: FastifyServerOptions = {}): Promise<FastifyInstance> {
    /**
     * @type {FastifyInstance} Instance of Fastify
     */
    const fastify = Fastify(options).withTypeProvider<ZodTypeProvider>();
    fastify.setValidatorCompiler(validatorCompiler);
    fastify.setSerializerCompiler(serializerCompiler);

    await fastify.register(sensible);
    await fastify.register(cookie);

    if (!CORS_ORIGIN) {
        fastify.log.error(
            '`FRONTEND_URL` is not set in `.env` file (will result in CORS not working correctly).',
        );
    }

    // CORS FOR FRONTEND
    await fastify.register(cors, {
        origin: CORS_ORIGIN ?? '',
        credentials: true,
    });

    await fastify.register(authenticate);
    await fastify.register(requireOwner);
    await fastify.register(requireRole);

    await fastify.register(statisticRoutes);
    await fastify.register(registerAPI, { prefix: '/api/v1' });

    return fastify;
}
