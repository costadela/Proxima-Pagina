import './config/env'
import { app } from './app'
import { env } from './config/env'
import { prisma } from './config/prisma'

const server = app.listen(env.PORT, () => {
  console.log(`API do Próxima Página disponível em http://localhost:${env.PORT}`)
})

const shutdown = () => {
  server.close(() => {
    void prisma.$disconnect().then(() => process.exit(0))
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
