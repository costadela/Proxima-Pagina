import { Router } from 'express'
import { z } from 'zod'
import { env } from '../config/env'
import { prisma } from '../config/prisma'
import { HttpError } from '../errors/HttpError'
import {
  autenticacaoOpcional,
  exigirAutenticacao,
  usuarioIdAutenticado,
} from '../middlewares/autenticacao'
import {
  atualizarLivroSchema,
  buscaCapasSchema,
  criarLivroSchema,
  filtroLivrosSchema,
} from '../schemas/livroSchema'

const router = Router()
router.use(autenticacaoOpcional)

function livroComBibliotecaDoUsuario<
  T extends { biblioteca: { id: string }[] },
>(livro: T) {
  const { biblioteca, ...dados } = livro
  return { ...dados, biblioteca: biblioteca[0] ?? null }
}

const googleBooksResponseSchema = z.object({
  items: z.array(z.object({
    id: z.string().optional(),
    volumeInfo: z.object({
      title: z.string().optional(),
      authors: z.array(z.string()).optional(),
      imageLinks: z.object({
        thumbnail: z.string().url().optional(),
        smallThumbnail: z.string().url().optional(),
      }).optional(),
    }).optional(),
  })).optional(),
})

router.get('/capas', async (request, response) => {
  const filtros = buscaCapasSchema.parse(request.query)
  const consulta = filtros.isbn
    ? `isbn:${filtros.isbn.replace(/[-\s]/g, '')}`
    : [
        filtros.titulo ? `intitle:${filtros.titulo}` : '',
        filtros.autor ? `inauthor:${filtros.autor}` : '',
      ].filter(Boolean).join('+')
  const url = new URL('https://www.googleapis.com/books/v1/volumes')
  url.searchParams.set('q', consulta)
  url.searchParams.set('maxResults', '8')
  url.searchParams.set('printType', 'books')
  url.searchParams.set(
    'fields',
    'items(id,volumeInfo/title,volumeInfo/authors,volumeInfo/imageLinks/thumbnail,volumeInfo/imageLinks/smallThumbnail)',
  )
  if (env.GOOGLE_BOOKS_API_KEY) {
    url.searchParams.set('key', env.GOOGLE_BOOKS_API_KEY)
  }

  let resposta: Response
  try {
    resposta = await fetch(url, { signal: AbortSignal.timeout(8000) })
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new HttpError(504, 'A busca de capas demorou demais. Tente novamente.')
    }
    throw new HttpError(502, 'Não foi possível consultar o Google Books. Tente novamente.')
  }

  if (resposta.status === 429) {
    throw new HttpError(
      503,
      'A cota de busca do Google Books foi atingida. Configure GOOGLE_BOOKS_API_KEY na API ou informe uma URL de capa manualmente.',
    )
  }

  if (!resposta.ok) {
    throw new HttpError(502, 'O Google Books não conseguiu concluir a busca de capas.')
  }

  const corpo: unknown = await resposta.json()
  const resultado = googleBooksResponseSchema.safeParse(corpo)
  if (!resultado.success) {
    throw new HttpError(502, 'O Google Books retornou dados em um formato inesperado.')
  }

  const capas = (resultado.data.items ?? []).flatMap(({ id, volumeInfo }) => {
    if (!volumeInfo?.imageLinks) return []
    const imagem = volumeInfo.imageLinks.thumbnail ?? volumeInfo.imageLinks.smallThumbnail
    if (!imagem) return []

    try {
      const imagemUrl = new URL(imagem)
      if (imagemUrl.protocol !== 'https:' && imagemUrl.protocol !== 'http:') return []
      imagemUrl.protocol = 'https:'
      return [{
        id: id ?? imagem,
        titulo: volumeInfo.title ?? 'Livro sem título',
        autores: volumeInfo.authors ?? [],
        capaUrl: imagemUrl.toString(),
      }]
    } catch {
      return []
    }
  })

  response.json(capas)
})

router.get('/categorias', async (_request, response) => {
  const categorias = await prisma.livro.findMany({
    where: { ehMeuLivro: false },
    distinct: ['categoria'],
    orderBy: { categoria: 'asc' },
    select: { categoria: true },
  })

  response.json(categorias.map(({ categoria }) => categoria))
})

router.get('/', async (request, response) => {
  const filtros = filtroLivrosSchema.parse(request.query)
  const livros = await prisma.livro.findMany({
    where: {
      ehMeuLivro: false,
      ...(filtros.categoria ? { categoria: filtros.categoria } : {}),
      ...(filtros.busca
        ? {
            OR: [
              { titulo: { contains: filtros.busca, mode: 'insensitive' } },
              { autor: { contains: filtros.busca, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: {
      biblioteca: {
        where: { usuarioId: request.usuarioId ?? '' },
      },
    },
    orderBy: { titulo: 'asc' },
  })

  response.json(livros.map(livroComBibliotecaDoUsuario))
})

router.get('/:id', async (request, response) => {
  const livro = await prisma.livro.findFirst({
    where: {
      id: request.params.id,
      OR: [
        { ehMeuLivro: false },
        ...(request.usuarioId ? [{ usuarioId: request.usuarioId }] : []),
      ],
    },
    include: {
      biblioteca: { where: { usuarioId: request.usuarioId ?? '' } },
    },
  })

  if (!livro) throw new HttpError(404, 'Livro não encontrado')
  response.json(livroComBibliotecaDoUsuario(livro))
})

router.post('/', exigirAutenticacao, async (request, response) => {
  const usuarioId = usuarioIdAutenticado(request)
  const dados = criarLivroSchema.parse(request.body)
  const { status, avaliacao, ...livro } = dados
  const criado = await prisma.$transaction(async (transaction) => {
    const cadastroExistente = await transaction.livro.findFirst({
      where: {
        ehMeuLivro: true,
        usuarioId,
        titulo: { equals: livro.titulo, mode: 'insensitive' },
        autor: { equals: livro.autor, mode: 'insensitive' },
      },
      select: { id: true },
    })

    if (cadastroExistente) {
      throw new HttpError(409, 'Você já cadastrou este livro')
    }

    const livrosDoCatalogo = await transaction.livro.findMany({
      where: {
        ehMeuLivro: false,
        titulo: { equals: livro.titulo, mode: 'insensitive' },
        autor: { equals: livro.autor, mode: 'insensitive' },
      },
      select: { id: true },
    })

    if (livrosDoCatalogo.length > 0) {
      await transaction.itemBiblioteca.deleteMany({
        where: {
          usuarioId,
          livroId: { in: livrosDoCatalogo.map(({ id }) => id) },
        },
      })
    }

    return transaction.livro.create({
      data: {
        ...livro,
        ehMeuLivro: true,
        usuarioId,
        biblioteca: { create: { usuarioId, status, avaliacao: avaliacao ?? null } },
      },
      include: { biblioteca: true },
    })
  })

  response.status(201).json(livroComBibliotecaDoUsuario(criado))
})

router.patch('/:id', exigirAutenticacao, async (request, response) => {
  const usuarioId = usuarioIdAutenticado(request)
  const livroId = request.params.id
  if (typeof livroId !== 'string') throw new HttpError(404, 'Livro não encontrado')
  const dados = atualizarLivroSchema.parse(request.body)
  const livro = await prisma.livro.findFirst({
    where: { id: livroId, ehMeuLivro: true, usuarioId },
  })

  if (!livro) throw new HttpError(404, 'Livro não encontrado')

  const atualizado = await prisma.livro.update({
    where: { id: livro.id },
    data: dados,
    include: { biblioteca: { where: { usuarioId } } },
  })

  response.json(livroComBibliotecaDoUsuario(atualizado))
})

router.delete('/:id', exigirAutenticacao, async (request, response) => {
  const usuarioId = usuarioIdAutenticado(request)
  const livroId = request.params.id
  if (typeof livroId !== 'string') throw new HttpError(404, 'Livro não encontrado')
  const livro = await prisma.livro.findFirst({
    where: { id: livroId, ehMeuLivro: true, usuarioId },
  })

  if (!livro) throw new HttpError(404, 'Livro não encontrado')

  await prisma.livro.delete({ where: { id: livro.id } })
  response.status(204).end()
})

export default router
