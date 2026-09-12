/**
 * module name:
 *  + db.ts
 *
 * description:
 *  + Defines Prisma's client connection to the database.
 */

import 'dotenv/config';
import { PrismaClient } from './generated/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * @description Creates a PrismaClient and sets it's log options depending on the `NODE_ENV`.
 * @returns {PrismaClient} Client connected to Prisma.
 */
function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

  return new PrismaClient({
    adapter,
    log: isProduction ? ['error', 'warn'] : ['query', 'error', 'warn'],
  });
}

// THIS IS USED FOR DEBBUGING
//      (tsx watch) reloads the server and we dont want to create the client each time.
//      Each connected client takes server's resources.
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create OR get client
export const prisma: PrismaClient = globalThis.__prisma ?? createPrismaClient();

// FOR DEV ENV
if (!isProduction) {
  globalThis.__prisma = prisma;
}

/**
 * @description disconnects current Prisma client.
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
