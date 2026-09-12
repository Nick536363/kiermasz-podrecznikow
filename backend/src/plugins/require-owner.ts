/**
 * module name:
 *  + require-owner.ts
 *
 * description:
 *  + Requires users to be the owner of the post/listing to make changes to it.
 */

import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

type GetOwnerId = (resourceId: number) => Promise<number | null>;

declare module 'fastify' {
    interface FastifyInstance {
        requireOwner: (
            getOwnerId: GetOwnerId,
        ) => (
            request: FastifyRequest<{ Params: { id: number } }>,
            reply: FastifyReply,
        ) => Promise<void>;
    }
}

export default fp(async function requireOwner(fastify: FastifyInstance) {
    fastify.decorate(
        'requireOwner',
        (getOwnerId: GetOwnerId) =>
            async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
                if (request.user.role === 'ADMIN') {
                    return;
                }

                const ownerId = await getOwnerId(request.params.id);

                if (ownerId === null) {
                    reply.notFound();
                    return;
                }
                if (ownerId !== request.user.id) {
                    reply.forbidden('You do not own this resource');
                }
            },
    );
});
