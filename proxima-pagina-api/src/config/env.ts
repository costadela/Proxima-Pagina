import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
  GOOGLE_BOOKS_API_KEY: z.string().optional(),
  PORT: z.coerce.number().int().positive().default(3333),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
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
