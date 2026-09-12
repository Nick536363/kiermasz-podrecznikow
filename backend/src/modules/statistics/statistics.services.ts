/**
 * module name:
 *  + statistics.routes.ts
 *
 * description:
 *  + Defines API statistic operations.
 */

import { prisma } from '@/db/client.js';

export function apiVersion() {
    return {
        name: 'listing-manager-api',
        status: 'ok',
        version: process.env.npm_package_version ?? '1.0.0',
    };
}

export async function isApiHealthy() {
    try {
        await prisma.$queryRaw`SELEC 1`;
    } catch {
        return false;
    }

    return true;
}

export function apiReady() {
    return { status: 'ready' };
}
