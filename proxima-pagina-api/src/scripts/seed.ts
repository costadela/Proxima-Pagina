import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import { env } from '../config/env'
import { capaDoCatalogo } from '../data/capasCatalogo'
import { LIVROS_MOCK } from '../data/catalogoInicial'

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  for (const registro of LIVROS_MOCK) {
    const livro = {
      ...registro,
      capaUrl: capaDoCatalogo(registro.id),
      ehMeuLivro: false,
    }
    await prisma.livro.upsert({
      where: { id: livro.id },
      update: livro,
      create: livro,
    })
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error)
    await prisma.$disconnect()
    process.exitCode = 1
  })
