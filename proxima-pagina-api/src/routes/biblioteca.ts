import { Router } from 'express'
import { prisma } from '../config/prisma'
import { HttpError } from '../errors/HttpError'
import {
  adicionarBibliotecaSchema,
  atualizarBibliotecaSchema,
} from '../schemas/livroSchema'

const router = Router()

router.get('/', async (_request, response) => {
  const itens = await prisma.itemBiblioteca.findMany({
    include: { livro: true },
    orderBy: { atualizadoEm: 'desc' },
  })

  response.json(itens)
})

router.post('/', async (request, response) => {
  const dados = adicionarBibliotecaSchema.parse(request.body)
  const livro = await prisma.livro.findUnique({ where: { id: dados.livroId } })

  if (!livro) throw new HttpError(404, 'Livro não encontrado')

  if (!livro.ehMeuLivro) {
    const cadastroPessoal = await prisma.itemBiblioteca.findFirst({
      where: {
        livro: {
          ehMeuLivro: true,
          titulo: { equals: livro.titulo, mode: 'insensitive' },
          autor: { equals: livro.autor, mode: 'insensitive' },
        },
      },
      select: { id: true },
    })

    if (cadastroPessoal) {
      throw new HttpError(409, 'Você já tem este livro cadastrado na sua biblioteca')
    }
  }

  const item = await prisma.itemBiblioteca.create({
    data: {
      livroId: livro.id,
      status: dados.status,
      avaliacao: dados.avaliacao ?? null,
    },
    include: { livro: true },
  })

  response.status(201).json(item)
})

router.patch('/:livroId', async (request, response) => {
  const dados = atualizarBibliotecaSchema.parse(request.body)
  const item = await prisma.itemBiblioteca.update({
    where: { livroId: request.params.livroId },
    data: dados,
    include: { livro: true },
  })

  response.json(item)
})

router.delete('/:livroId', async (request, response) => {
  const item = await prisma.itemBiblioteca.findUnique({
    where: { livroId: request.params.livroId },
    include: { livro: true },
  })

  if (!item) throw new HttpError(404, 'Livro não encontrado na biblioteca')
  if (item.livro.ehMeuLivro) {
    throw new HttpError(403, 'Para remover um livro cadastrado por você, exclua-o na edição')
  }

  await prisma.itemBiblioteca.delete({ where: { id: item.id } })
  response.status(204).end()
})

export default router
