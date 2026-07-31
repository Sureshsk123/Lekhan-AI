import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: 'postgresql://root:password@127.0.0.1:5432/langsphere_db?schema=public' });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  console.log("Connecting...");
  await prisma.$connect();
  console.log("Connected. Querying...");
  const users = await prisma.user.findMany({ take: 1 });
  console.log("Users:", users);
}

run().catch(console.error).finally(() => pool.end());
