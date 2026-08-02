import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import app from './app';
import { env } from './config/env';

const isExternalDb = env.DATABASE_URL.includes('supabase') || env.DATABASE_URL.includes('sslmode=require') || env.DATABASE_URL.includes('pooler.supabase.com');
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ...(isExternalDb && { ssl: { rejectUnauthorized: false } }),
});
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅ Database Connected');
    
    const port = Number(env.PORT) || 5005;
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://0.0.0.0:${port} and http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
