import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL deve ser uma URL PostgreSQL válida'),
  DIRECT_URL: z.string().url('DIRECT_URL deve ser uma URL PostgreSQL válida'),
  GOOGLE_BOOKS_API_KEY: z.string().optional(),
  PORT: z.coerce.number().int().positive().default(3333),
  FRONTEND_URL: z.string().url().default(
    process.env.NODE_ENV === 'production'
      ? 'https://proximapagina.vitorcostadela.com'
      : 'http://localhost:5173',
  ),
  NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
  COOKIE_SECURE: z.enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
}).superRefine((config, context) => {
  if (config.NODE_ENV === 'production' && !config.COOKIE_SECURE) {
    context.addIssue({
      code: 'custom',
      path: ['COOKIE_SECURE'],
      message: 'COOKIE_SECURE não pode ser false em produção',
    })
  }
})

export const env = envSchema.parse(process.env)
