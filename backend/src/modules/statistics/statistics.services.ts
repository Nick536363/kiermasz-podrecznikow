/**
 * module name:
 *  + statistics.routes.ts
 *
 * description:
 *  + Defines API statistic operations.
 */

import { prisma } from '@/db/client.js';

/**
 * @returns API version and name
 */
export function apiVersion() {
    return {
        name: 'listing-manager-api',
        version: process.env.npm_package_version ?? '1.0.0',
    };
}

/**
 * @description Checks current database connection and if it's not connected it returns false.
 * @returns Database connection
 */
export async function isApiHealthy() {
    try {
        await prisma.$queryRaw`SELEC 1`;
    } catch {
        return false;
    }

    return true;
}

/**
 * @returns Current API status
 */
export function apiReady() {
    return { status: 'ready' };
}
