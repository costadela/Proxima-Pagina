import express from 'express'
import cors from 'cors'
import { env } from './config/env'
import { errorHandler } from './middlewares/errorHandler'
import bibliotecaRoutes from './routes/biblioteca'
import livrosRoutes from './routes/livros'
import autenticacaoRoutes from './routes/autenticacao'

export const app = express()

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))
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
