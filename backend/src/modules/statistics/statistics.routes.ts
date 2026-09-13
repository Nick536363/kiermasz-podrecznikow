/**
 * module name:
 *  + statistics.routes.ts
 *
 * description:
 *  + Defines API statistic routes.
 */

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { apiReady, apiVersion, isApiHealthy } from './statistics.services.js';

/**
 * @description Encapsulates statistic routes
 * @param {FastifyInstance} fastify Encapsulated Fastify Instance
 */
export const statisticRoutes: FastifyPluginAsyncZod = async (fastify) => {
    // API VERSION
    fastify.get('/', async () => apiVersion());

    // API HEALTH
    fastify.get('/health', async (_, reply) => {
        if (!isApiHealthy()) {
            reply.code(500);
            return { status: 'error', db: 'disconnected' };
        }

        return { status: 'ok', db: 'connected' };
    });

    // API READY
    fastify.get('/ready', async () => apiReady());

    //
    // DEBUG!
    //
    if (process.env.NODE_ENV !== 'production') {
        fastify.get('/_debug/routes', async () => fastify.printRoutes());
    }
};
