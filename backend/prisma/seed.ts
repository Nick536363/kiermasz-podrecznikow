/**
 * module name:
 *  + seed.ts
 *
 * description:
 *  + Defines default admin user.
 */

import { defineConfig, env } from 'prisma/config';
import { prisma } from '../src/db/client';
import argon2 from 'argon2';

async function main() {
    const passwordHash = await argon2.hash(env('ROOT_PASSWORD'), { type: argon2.argon2id });
    await prisma.user.upsert({
        where: { name: 'root' },
        update: {},
        create: { name: 'root', passwordHash, role: 'ADMIN' },
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
