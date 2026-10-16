export interface Livro {
  id: string
  titulo: string
  autor: string
  categoria: string
  ano: number | null
  paginas: number | null
  idioma: string
  capaUrl: string | null
  sinopse: string | null
  ehMeuLivro: boolean
}