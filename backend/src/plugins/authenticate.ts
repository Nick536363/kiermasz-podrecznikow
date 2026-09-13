/**
 * module name:
 *  + authenticate.ts
 *
 * description:
 *  + Authenticates users trying to modify the database/access the API.
 */

import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

type UserPayload = { id: number; role: 'USER' | 'ADMIN' };

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: UserPayload;
        user: UserPayload;
    }
}

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

export default fp(
    /**
     * @description Fastify plugin, that requiers users to be authenticated.
     */
    async function authenticate(fastify: FastifyInstance) {
        fastify.register(jwt, { secret: process.env.JWT_SECRET! });

        fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                await request.jwtVerify();
            } catch {
                reply.unauthorized('Invalid or missing token');
            }
        });
    },
);
