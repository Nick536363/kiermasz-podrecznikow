/**
 * module name:
 *  + users.service.ts
 *
 * description:
 *  + Defines users CRUD operations.
 */

import argon2 from 'argon2';
import type { z } from 'zod';

import { omitUndefined } from '@/lib/omit-undefined.js';
import { prisma } from '@/db/client.js';
import type { Prisma } from '@/db/generated/client.js';
import { CreateUserSchema, UpdateUserSchema } from './users.schemas.js';

const PUBLIC_SELECT = { id: true, name: true, role: true, createdAt: true } as const;

export async function createUser(data: z.infer<typeof CreateUserSchema>) {
    const existing = await prisma.user.findUnique({ where: { name: data.name } });

    if (existing) {
        throw new Error('USER_EXISTS');
    }

    const passwordHash = await argon2.hash(data.password, { type: argon2.argon2id });

    return prisma.user.create({
        data: { name: data.name, role: data.role, passwordHash },
        select: PUBLIC_SELECT,
    });
}

export async function listUsers(page: number, limit: number) {
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            select: PUBLIC_SELECT,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.user.count(),
    ]);

    return { users, total, page, limit };
}

export async function getUser(id: number) {
    return prisma.user.findUnique({ where: { id }, select: PUBLIC_SELECT });
}

export async function updateUser(id: number, input: z.infer<typeof UpdateUserSchema>) {
    const { password, ...other } = input;

    const data = omitUndefined(other) as Prisma.UserUpdateInput;

    if (password !== undefined) {
        data.passwordHash = await argon2.hash(password, {
            type: argon2.argon2id,
        });
    }

    return prisma.user.update({ where: { id }, data, select: PUBLIC_SELECT });
}

export async function deleteUser(id: number) {
    return prisma.user.delete({ where: { id } });
}
