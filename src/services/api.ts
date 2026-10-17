import type { ItemBiblioteca, StatusLeitura } from '../types/biblioteca'
import type { Livro } from '../types/livros'

const apiOrigin = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ??
  (import.meta.env.DEV ? 'http://localhost:3333' : undefined)
const API_BASE_URL = apiOrigin ? `${apiOrigin}/api` : undefined

export type LivroComBiblioteca = Livro & {
  biblioteca: ItemBiblioteca | null
}

export type ItemBibliotecaComLivro = ItemBiblioteca & {
  livro: Livro
}

export interface DadosLivro {
  titulo: string
  autor: string
  categoria: string
  ano: number | null
  paginas: number | null
  idioma: string
  capaUrl: string | null
  sinopse: string | null
}

export interface SugestaoCapa {
  id: string
  titulo: string
  autores: string[]
  capaUrl: string
}

export interface Usuario {
  id: string
  nome: string
  email: string
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('A URL da API não foi configurada. Defina VITE_API_URL e publique o frontend novamente.')
  }

  const headers = new Headers(options?.headers)
  if (options?.body) headers.set('Content-Type', 'application/json')
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (response.status === 204) return undefined as T

  const body: unknown = await response.json()
  if (!response.ok) {
    const message =
      typeof body === 'object' && body !== null && 'erro' in body &&
      typeof body.erro === 'string'
        ? body.erro
        : `A API respondeu com erro (${response.status})`
    throw new ApiError(message, response.status)
  }

  return body as T
}

export function obterUsuarioAtual() {
  return request<{ usuario: Usuario | null }>('/auth/me')
}

export function cadastrarUsuario(dados: { nome: string; email: string; senha: string }) {
  return request<{ usuario: Usuario }>('/auth/cadastro', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}

export function entrar(dados: { email: string; senha: string }) {
  return request<{ usuario: Usuario }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}

export function sair() {
  return request<void>('/auth/logout', { method: 'POST' })
}

export function listarLivros(filtros: { busca?: string; categoria?: string } = {}) {
  const query = new URLSearchParams()
  if (filtros.busca) query.set('busca', filtros.busca)
  if (filtros.categoria && filtros.categoria !== 'Todos') {
    query.set('categoria', filtros.categoria)
  }
  const sufixo = query.size > 0 ? `?${query.toString()}` : ''

  return request<LivroComBiblioteca[]>(`/livros${sufixo}`)
}

export function listarCategorias() {
  return request<string[]>('/livros/categorias')
}

export function buscarCapas(filtros: { titulo: string; autor: string; isbn: string }) {
  const query = new URLSearchParams()
  if (filtros.titulo.trim()) query.set('titulo', filtros.titulo.trim())
  if (filtros.autor.trim()) query.set('autor', filtros.autor.trim())
  if (filtros.isbn.trim()) query.set('isbn', filtros.isbn.trim())

  return request<SugestaoCapa[]>(`/livros/capas?${query.toString()}`)
}

export function buscarLivro(id: string) {
  return request<LivroComBiblioteca>(`/livros/${encodeURIComponent(id)}`)
}

export function criarLivro(
  dados: DadosLivro & { status: StatusLeitura; avaliacao: number | null },
) {
  return request<LivroComBiblioteca>('/livros', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}

export function atualizarLivro(id: string, dados: Partial<DadosLivro>) {
  return request<LivroComBiblioteca>(`/livros/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(dados),
  })
}

export function excluirLivro(id: string) {
  return request<void>(`/livros/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function listarBiblioteca() {
  return request<ItemBibliotecaComLivro[]>('/biblioteca')
}

export function adicionarBiblioteca(livroId: string) {
  return request<ItemBibliotecaComLivro>('/biblioteca', {
    method: 'POST',
    body: JSON.stringify({ livroId }),
  })
}

export function atualizarItemBiblioteca(
  livroId: string,
  dados: { status?: StatusLeitura; avaliacao?: number | null },
) {
  return request<ItemBibliotecaComLivro>(`/biblioteca/${encodeURIComponent(livroId)}`, {
    method: 'PATCH',
    body: JSON.stringify(dados),
  })
}

export function removerDaBiblioteca(livroId: string) {
  return request<void>(`/biblioteca/${encodeURIComponent(livroId)}`, {
    method: 'DELETE',
  })
}
