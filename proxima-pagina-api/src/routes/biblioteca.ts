import { Router } from 'express'
import { prisma } from '../config/prisma'
import { HttpError } from '../errors/HttpError'
import {
  autenticacaoOpcional,
  exigirAutenticacao,
  usuarioIdAutenticado,
} from '../middlewares/autenticacao'
import {
  adicionarBibliotecaSchema,
  atualizarBibliotecaSchema,
} from '../schemas/livroSchema'

const router = Router()
router.use(autenticacaoOpcional, exigirAutenticacao)

router.get('/', async (request, response) => {
  const usuarioId = usuarioIdAutenticado(request)
  const itens = await prisma.itemBiblioteca.findMany({
    where: { usuarioId },
    include: { livro: true },
    orderBy: { atualizadoEm: 'desc' },
  })

  response.json(itens)
})

router.post('/', async (request, response) => {
  const usuarioId = usuarioIdAutenticado(request)
  const dados = adicionarBibliotecaSchema.parse(request.body)
  const livro = await prisma.livro.findUnique({ where: { id: dados.livroId } })

  if (!livro) throw new HttpError(404, 'Livro não encontrado')

  if (livro.ehMeuLivro) {
    if (livro.usuarioId !== usuarioId) {
      throw new HttpError(404, 'Livro não encontrado')
    }
    throw new HttpError(409, 'Este livro já está na sua biblioteca')
  }

  if (!livro.ehMeuLivro) {
    const cadastroPessoal = await prisma.itemBiblioteca.findFirst({
      where: {
        usuarioId,
        livro: {
          ehMeuLivro: true,
          usuarioId,
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
      usuarioId,
      livroId: livro.id,
      status: dados.status,
      avaliacao: dados.avaliacao ?? null,
    },
    include: { livro: true },
  })

  response.status(201).json(item)
})

router.patch('/:livroId', async (request, response) => {
  const usuarioId = usuarioIdAutenticado(request)
  const dados = atualizarBibliotecaSchema.parse(request.body)
  const existente = await prisma.itemBiblioteca.findFirst({
    where: { usuarioId, livroId: request.params.livroId },
    select: { id: true },
  })
  if (!existente) throw new HttpError(404, 'Livro não encontrado na biblioteca')

  const item = await prisma.itemBiblioteca.update({
    where: { id: existente.id },
    data: dados,
    include: { livro: true },
  })

  response.json(item)
})

router.delete('/:livroId', async (request, response) => {
  const usuarioId = usuarioIdAutenticado(request)
  const item = await prisma.itemBiblioteca.findUnique({
    where: {
      usuarioId_livroId: { usuarioId, livroId: request.params.livroId },
    },
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
