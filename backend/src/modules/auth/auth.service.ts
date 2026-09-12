/**
 * module name:
 *  + auth.service.ts
 *
 * description:
 *  + Defines authorization schemas.
 */

import argon2 from 'argon2';
import type { FastifyInstance } from 'fastify';

import { prisma } from '@/db/client.js';

type UserPayload = { id: number; role: 'USER' | 'ADMIN' };

export async function verifyCredentials(name: string, password: string) {
    const user = await prisma.user.findUnique({ where: { name } });

    if (!user) {
        return null;
    }

    const valid = await argon2.verify(user.passwordHash, password);

    return valid ? user : null;
}

export function issueTokens(app: FastifyInstance, user: UserPayload & { tokenVersion: number }) {
    const accessToken = app.jwt.sign({ id: user.id, role: user.role }, { expiresIn: '15m' });

    const refreshToken = app.jwt.sign(
        { id: user.id, tokenVersion: user.tokenVersion },
        { expiresIn: '30d', key: process.env.JWT_REFRESH_SECRET },
    );

    return { accessToken, refreshToken };
}
