import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default(5005),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32).default('super_secret_jwt_key_that_needs_to_be_long_in_prod'),
  REFRESH_TOKEN_SECRET: z.string().min(32).default('super_secret_refresh_key_that_needs_to_be_long'),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
