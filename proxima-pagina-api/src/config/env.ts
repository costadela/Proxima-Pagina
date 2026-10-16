import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
  GOOGLE_BOOKS_API_KEY: z.string().optional(),
  PORT: z.coerce.number().int().positive().default(3333),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
})

export const env = envSchema.parse(process.env)
