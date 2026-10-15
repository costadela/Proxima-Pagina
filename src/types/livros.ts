export interface Livro {
  id: string
  titulo: string
  autor: string
  categoria: string
  ano: number
  paginas: number
  idioma: string
  capaUrl: string
  sinopse: string
  ehMeuLivro?: boolean 
}