import z from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  COOKIES_DOMAIN: z.string(),
  COOKIE_SECRET_KEY: z.string(),
  CORS_ORIGIN: z.string(),
  ALLOWED_ORIGIN_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),
  RESEND_API_KEY: z.string(),
  SENDER_EMAIL: z.string(),
  WEBSITE_DOMAIN_URL: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
