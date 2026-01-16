import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import BetterSQLite3 from 'better-sqlite3';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const initializePrisma = () => {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        throw new Error("DATABASE_URL is not set");
    }
    const client = new BetterSQLite3(dbUrl.replace("file:", ""));
    const adapter = new PrismaBetterSqlite3(client as any); // Use 'as any' to bypass the type check
    return new PrismaClient({
        adapter,
        log: ['query'],
    });
}

export const prisma = globalForPrisma.prisma ?? initializePrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
