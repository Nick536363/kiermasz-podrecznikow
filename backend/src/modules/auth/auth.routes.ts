/**
 * module name:
 *  + auth.routes.ts
 *
 * description:
 *  + Defines authorization operations.
 */

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '@/db/client.js';

import * as authService from './auth.service.js';
import { LoginSchema, AuthResponseSchema } from './auth.schemas.js';

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
    app.post(
        '/login',
        {
            schema: { body: LoginSchema, response: { 200: AuthResponseSchema } },
        },
        async (request, reply) => {
            const user = await authService.verifyCredentials(
                request.body.name,
                request.body.password,
            );

            if (!user) {
                return reply.unauthorized('Invalid credentials');
            }

            const { accessToken, refreshToken } = authService.issueTokens(app, user);
            reply.setCookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/api/v1/auth',
            });

            return { accessToken };
        },
    );

    app.post(
        '/refresh',
        {
            schema: { response: { 200: AuthResponseSchema } },
        },
        async (request, reply) => {
            const token = request.cookies.refreshToken;

            if (!token) {
                return reply.unauthorized('No refresh token');
            }

            try {
                const payload = app.jwt.verify(token, { key: process.env.JWT_REFRESH_SECRET });
                const user = await prisma.user.findUnique({ where: { id: payload.id } });

                if (!user || user.tokenVersion !== payload.tokenVersion) {
                    return reply.unauthorized('Token revoked');
                }

                const { accessToken, refreshToken } = authService.issueTokens(app, user);
                reply.setCookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    path: '/api/v1/auth',
                });

                return { accessToken };
            } catch {
                return reply.unauthorized('Invalid refresh token');
            }
        },
    );

    app.post(
        '/logout',
        {
            preHandler: [app.authenticate],
        },
        async (request, reply) => {
            await prisma.user.update({
                where: { id: request.user.id },
                data: { tokenVersion: { increment: 1 } },
            });

            reply.clearCookie('refreshToken', { path: '/api/v1/auth' });
            reply.code(204);
        },
    );
};
