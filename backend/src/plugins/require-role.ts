/**
 * module name:
 *  + require-role.ts
 *
 * description:
 *  + Requires users to have a specific role to make changes/request data.
 */

import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

type Role = 'USER' | 'ADMIN';

declare module 'fastify' {
    interface FastifyInstance {
        requireRole: (
            ...roles: Role[]
        ) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

export default fp(
    /**
     * @description Fastify plugin, that requires the requesting user to have a certain role.
     */
    async function requireRole(fastify: FastifyInstance) {
        fastify.decorate(
            'requireRole',
            (...roles: Role[]) =>
                async (request: FastifyRequest, reply: FastifyReply) => {
                    if (!roles.includes(request.user.role)) {
                        reply.forbidden('Insufficient permissions');
                    }
                },
        );
    },
);
