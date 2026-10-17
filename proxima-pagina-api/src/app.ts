import express from 'express'
import cors from 'cors'
import { env } from './config/env'
import { errorHandler } from './middlewares/errorHandler'
import bibliotecaRoutes from './routes/biblioteca'
import livrosRoutes from './routes/livros'
import autenticacaoRoutes from './routes/autenticacao'

export const app = express()

const isLocalDevelopmentOrigin = (origin: string) => {
  try {
    const url = new URL(origin)
    return url.origin === origin &&
      url.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  } catch {
    return false
  }
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, env.FRONTEND_URL)
      return
    }

    const isAllowed = origin === env.FRONTEND_URL ||
      (env.NODE_ENV !== 'production' && isLocalDevelopmentOrigin(origin))
    callback(null, isAllowed ? origin : false)
  },
  credentials: true,
}))
app.use(express.json())

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/auth', autenticacaoRoutes)
app.use('/api/livros', livrosRoutes)
app.use('/api/biblioteca', bibliotecaRoutes)

app.use((_request, response) => {
  response.status(404).json({ erro: 'Rota não encontrada' })
})

app.use(errorHandler)
