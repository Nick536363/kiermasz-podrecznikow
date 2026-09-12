/**
 * !!ENTRYPOINT!!
 *
 * module name:
 *  + app.ts
 *
 * description:
 *  + Server's entrypoint.
 */

import { createServer } from './app.js';
import { disconnectPrisma } from './db/client.js';

const fastify = await createServer({
    logger: true,
});

// CTRL + C
process.on('SIGTERM', async () => {
    await disconnectPrisma();
    await fastify.close();

    process.exit(0);
});

// START SERVER
fastify.listen({ port: 3000 }, (err) => {
    if (err) {
        fastify.log.error(err);

        process.exit(1);
    }
});
