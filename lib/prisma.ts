import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const pool = new pg.Pool({ 
  connectionString: 'postgresql://postgres:Saha080807@localhost:5432/mlm_shop?schema=public' 
})
const adapter = new PrismaPg(pool)

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma