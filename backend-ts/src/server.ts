import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import app from './app';
import { env } from './config/env';

// Prepare database connection string
const dbUrl = (env.DATABASE_URL || env.DIRECT_URL || '').replace(/([?&])sslmode=[^&]*&?/, '$1').replace(/[?&]$/, '');
const isExternalDb = dbUrl.includes('supabase') || dbUrl.includes('pooler.supabase.com');

export const pool = new Pool({
  connectionString: dbUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
  ...(isExternalDb && { ssl: { rejectUnauthorized: false } }),
});

// Handle pool error event (non-fatal, auto-reconnects on next query)
pool.on('error', (err) => {
  console.warn('⚠️ PostgreSQL Pool Warning (idle client error):', err.message);
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

async function connectWithRetry(maxRetries = 5, delayMs = 3000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await prisma.$connect();
      console.log('✅ Database Connected (Supabase PostgreSQL)');
      return;
    } catch (error: any) {
      console.warn(`⚠️ Database connection attempt ${attempt}/${maxRetries} failed:`, error.message || error);
      if (attempt === maxRetries) {
        console.error('❌ Could not connect to Supabase PostgreSQL after max retries.');
        throw error;
      }
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
}

async function bootstrap() {
  try {
    await connectWithRetry();
    
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
