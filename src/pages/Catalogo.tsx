import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BarraBusca from '../components/BarraBusca'
import FiltroCategorias from '../components/FiltroCategorias'
import CardLivro from '../components/CardLivro'
import {
  adicionarBiblioteca,
  listarCategorias,
  listarLivros,
  type LivroComBiblioteca,
} from '../services/api'

export default function Catalogo() {
  const [busca, setBusca] = useState('')
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState('Todos')
  const [categorias, setCategorias] = useState<string[]>(['Todos'])
  const [livros, setLivros] = useState<LivroComBiblioteca[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [erroCategorias, setErroCategorias] = useState('')

  useEffect(() => {
    let cancelado = false
    listarCategorias()
      .then((resultado) => {
        if (!cancelado) setCategorias(['Todos', ...resultado])
      })
      .catch((error: unknown) => {
        if (!cancelado) setErroCategorias(
          error instanceof Error ? error.message : 'Não foi possível carregar as categorias.',
        )
      })

    return () => {
      cancelado = true
    }
  }, [])

  useEffect(() => {
    let cancelado = false
    listarLivros({ busca: busca.trim(), categoria: categoriaSelecionada })
      .then((resultado) => {
        if (!cancelado) {
          setLivros(resultado)
          setErro('')
        }
      })
      .catch((error: unknown) => {
        if (!cancelado) {
          setErro(error instanceof Error ? error.message : 'Não foi possível carregar os livros.')
        }
      })
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => {
      cancelado = true
    }
  }, [busca, categoriaSelecionada])

  const handleAdicionarABiblioteca = async (id: string) => {
    try {
      const item = await adicionarBiblioteca(id)
      setLivros((atuais) =>
        atuais.map((livro) =>
          livro.id === id ? { ...livro, biblioteca: item } : livro,
        ),
      )
      setErro('')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível adicionar o livro.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8">
<div className="mb-6">
  <h1 className="text-lg md:text-xl font-bold text-gray-900">Catálogo</h1>
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
        {erro && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {erro}
          </p>
        )}
        {erroCategorias && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {erroCategorias}
          </p>
        )}

        {carregando ? (
          <p className="py-12 text-center text-gray-500">Carregando livros...</p>
        ) : livros.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {livros.map((livro) => (
              <CardLivro
                key={livro.id}
                livro={livro}
                onAdicionar={(id) => void handleAdicionarABiblioteca(id)}
                jaNaBiblioteca={livro.biblioteca !== null}
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