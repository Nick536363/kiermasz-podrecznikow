/**
 * module name:
 *  + statistics.routes.ts
 *
 * description:
 *  + Defines API statistic routes.
 */

import type { FastifyInstance } from 'fastify';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

/**
 * @description Encapsulates statistic routes
 * @param {FastifyInstance} fastify Encapsulated Fastify Instance
 */
export const statisticRoutes: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
    // API NAME + VERSION
    fastify.get('/', async () => {
        return {
            name: 'listing-manager-api',
            status: 'ok',
            version: process.env.npm_package_version ?? '1.0.0',
        };
    });
};
