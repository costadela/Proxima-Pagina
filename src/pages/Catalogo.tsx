import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BarraBusca from '../components/BarraBusca'
import FiltroCategorias from '../components/FiltroCategorias'
import CardLivro from '../components/CardLivro'
import { LIVROS_MOCK } from '../mocks/livrosMock'
import type { Livro } from '../types/livros'

export default function Catalogo() {
  const [busca, setBusca] = useState('')
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState('Todos')

  // Lista de categorias extraída dinamicamente dos livros
  const categorias: string[] = [
    'Todos',
    ...Array.from(
      new Set(LIVROS_MOCK.map((livro: Livro) => livro.categoria)),
    ),
  ]

  // Filtra os livros por título, autor e categoria
  const livrosFiltrados = LIVROS_MOCK.filter((livro: Livro) => {
    const buscaLower = busca.toLowerCase().trim()

    const combinaBusca =
      livro.titulo.toLowerCase().includes(buscaLower) ||
      livro.autor.toLowerCase().includes(buscaLower)

    const combinaCategoria =
      categoriaSelecionada === 'Todos' ||
      livro.categoria === categoriaSelecionada

    return combinaBusca && combinaCategoria
  })

  const handleAdicionarABiblioteca = (id: string) => {
    console.log(`Livro ${id} adicionado à biblioteca!`)

    // Futuramente: integração com a API REST
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8">
{/* Título da página */}
<div className="mb-6">
  <h1 className="text-lg md:text-xl font-bold text-gray-900">
    Catálogo
  </h1>
</div>

        {/* Busca e filtro de categorias */}
        <div className="flex flex-col gap-4 mb-8">
          <BarraBusca
            valor={busca}
            onChange={setBusca}
            placeholder="Buscar por título ou autor"
          />

          <FiltroCategorias
            categorias={categorias}
            categoriaSelecionada={categoriaSelecionada}
            onSelecionarCategoria={setCategoriaSelecionada}
          />
        </div>

        {/* Grade de livros */}
        {livrosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {livrosFiltrados.map((livro: Livro) => (
              <CardLivro
                key={livro.id}
                livro={livro}
                onAdicionar={handleAdicionarABiblioteca}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-600">
              Nenhum livro encontrado.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Tente alterar a busca ou selecionar outra categoria.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}