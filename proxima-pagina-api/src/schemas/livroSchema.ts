import { z } from 'zod'

const camposLivro = {
  titulo: z.string().trim().min(1).max(200),
  autor: z.string().trim().min(1).max(160),
  categoria: z.string().trim().min(1).max(80),
  ano: z.number().int().min(0).max(9999).nullable().optional(),
  paginas: z.number().int().positive().nullable().optional(),
  idioma: z.string().trim().min(1).max(80).default('Português'),
  capaUrl: z.string().url().nullable().optional(),
  sinopse: z.string().trim().max(5000).nullable().optional(),
}

export const criarLivroSchema = z.object({
  ...camposLivro,
  status: z.enum(['QUERO_LER', 'LENDO', 'JA_LI']).default('QUERO_LER'),
  avaliacao: z.number().int().min(1).max(5).nullable().optional(),
}).strict()

export const atualizarLivroSchema = z.object(camposLivro)
  .partial()
  .strict()
  .refine((livro) => Object.keys(livro).length > 0, 'Informe ao menos um campo para atualizar')

export const filtroLivrosSchema = z.object({
  busca: z.string().trim().optional(),
  categoria: z.string().trim().optional(),
})

export const buscaCapasSchema = z.object({
  titulo: z.string().trim().max(200).optional(),
  autor: z.string().trim().max(160).optional(),
  isbn: z.string().trim().max(20).optional(),
}).refine(
  ({ titulo, autor, isbn }) => Boolean(isbn || titulo || autor),
  'Informe ISBN, título ou autor para buscar capas',
)

export const adicionarBibliotecaSchema = z.object({
  livroId: z.string().min(1),
  status: z.enum(['QUERO_LER', 'LENDO', 'JA_LI']).default('QUERO_LER'),
  avaliacao: z.number().int().min(1).max(5).nullable().optional(),
}).strict()

export const atualizarBibliotecaSchema = z.object({
  status: z.enum(['QUERO_LER', 'LENDO', 'JA_LI']).optional(),
  avaliacao: z.number().int().min(1).max(5).nullable().optional(),
}).strict().refine((item) => Object.keys(item).length > 0, 'Informe ao menos um campo para atualizar')
