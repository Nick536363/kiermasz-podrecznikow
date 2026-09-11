//
// app.ts
//   Defines Fastify's routes.
//

import type { FastifyInstance } from "fastify";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify Encapsulated Fastify Instance
 */
async function routes(fastify: FastifyInstance) {
	fastify.get("/", async (request, reply) => {
		return { hello: "world" };
	});
}

export default routes;
