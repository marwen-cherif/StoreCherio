import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    pool: Pool | undefined;
};

const DATABASE_URL = process.env.DATABASE_URL ||
    "postgresql://eva:eva_secret_2026@localhost:5432/eva_accessories?schema=public";

// Create pool only once
const pool = globalForPrisma.pool ?? new Pool({ connectionString: DATABASE_URL });
if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool;

const adapter = new PrismaPg(pool);

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
