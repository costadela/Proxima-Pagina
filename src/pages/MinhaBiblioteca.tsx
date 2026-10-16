import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BarraBusca from '../components/BarraBusca'
import FiltroCategorias from '../components/FiltroCategorias'
import AvaliacaoEstrelas from '../components/AvaliacaoEstrelas'
import CapaLivro from '../components/CapaLivro'
import { listarBiblioteca, type ItemBibliotecaComLivro } from '../services/api'

export default function MinhaBiblioteca() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos')
  const [itens, setItens] = useState<ItemBibliotecaComLivro[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let cancelado = false
    listarBiblioteca()
      .then((resultado) => {
        if (!cancelado) setItens(resultado)
      })
      .catch((error: unknown) => {
        if (!cancelado) {
          setErro(error instanceof Error ? error.message : 'Não foi possível carregar a biblioteca.')
        }
      })
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  const livrosBiblioteca = itens.map((item) => ({
    ...item.livro,
    status: item.status,
    avaliacao: item.avaliacao ?? 0,
  }))
  const categorias = [
    'Todos',
    ...Array.from(new Set(livrosBiblioteca.map((livro) => livro.categoria))).sort(
      (a, b) => a.localeCompare(b, 'pt-BR'),
    ),
  ]

  const livrosFiltrados = livrosBiblioteca.filter((item) => {
    const combinaBusca =
      item.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      item.autor.toLowerCase().includes(busca.toLowerCase())
    const combinaCategoria =
      categoriaSelecionada === 'Todos' || item.categoria === categoriaSelecionada

    return combinaBusca && combinaCategoria
  })

  const queroLer = livrosFiltrados.filter((item) => item.status === 'QUERO_LER')
  const lendo = livrosFiltrados.filter((item) => item.status === 'LENDO')
  const jaLi = livrosFiltrados.filter((item) => item.status === 'JA_LI')

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Minha biblioteca</h1>
          <Link
            to="/livros/novo"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors self-start sm:self-auto inline-block"
          >
            + Cadastrar livro
          </Link>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <BarraBusca
            valor={busca}
            onChange={setBusca}
            placeholder="Buscar na minha biblioteca..."
          />
          <FiltroCategorias
            categorias={categorias}
            categoriaSelecionada={categoriaSelecionada}
            onSelecionarCategoria={setCategoriaSelecionada}
          />
        </div>

        {erro && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {erro}
          </p>
        )}

        {carregando ? (
          <p className="py-12 text-center text-gray-500">Carregando biblioteca...</p>
        ) : (
          <>
        {/* CONTAINER DAS 3 COLUNAS KANBAN LADO A LADO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* COLUNA 1: Quero ler */}
          <section className="bg-gray-100/70 p-4 rounded-xl border border-gray-200/60">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center justify-between">
              <span>Quero ler</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {queroLer.length}
              </span>
            </h2>

            <div className="flex flex-col gap-4">
              {queroLer.length > 0 ? (
                queroLer.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/livros/${item.id}`)}
                    className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex gap-3 items-center"
                  >
                    <CapaLivro livro={item} tamanho="mini" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block mb-1">
                        {item.categoria}
                      </span>
                      {item.ehMeuLivro && (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded inline-block ml-1 mb-1">
                          Meu cadastro
                        </span>
                      )}
                      <h3 className="font-bold text-gray-900 text-sm truncate">
                        {item.titulo}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">{item.autor}</p>
                      {item.ehMeuLivro && (
                        <Link
                          to={`/livros/${item.id}/editar`}
                          onClick={(event) => event.stopPropagation()}
                          className="inline-block mt-2 text-xs font-semibold text-blue-700 hover:text-blue-900"
                        >
                          Editar informações
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 py-4 text-center">
                  Nenhum livro nesta seção.
                </p>
              )}
            </div>
          </section>

          {/* COLUNA 2: Lendo */}
          <section className="bg-gray-100/70 p-4 rounded-xl border border-gray-200/60">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center justify-between">
              <span>Lendo</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {lendo.length}
              </span>
            </h2>

            <div className="flex flex-col gap-4">
              {lendo.length > 0 ? (
                lendo.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/livros/${item.id}`)}
                    className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex gap-3 items-center"
                  >
                    <CapaLivro livro={item} tamanho="mini" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block mb-1">
                        {item.categoria}
                      </span>
                      {item.ehMeuLivro && (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded inline-block ml-1 mb-1">
                          Meu cadastro
                        </span>
                      )}
                      <h3 className="font-bold text-gray-900 text-sm truncate">
                        {item.titulo}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">{item.autor}</p>
                      {item.ehMeuLivro && (
                        <Link
                          to={`/livros/${item.id}/editar`}
                          onClick={(event) => event.stopPropagation()}
                          className="inline-block mt-2 text-xs font-semibold text-blue-700 hover:text-blue-900"
                        >
                          Editar informações
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 py-4 text-center">
                  Nenhum livro em leitura.
                </p>
              )}
            </div>
          </section>

          {/* COLUNA 3: Já li */}
          <section className="bg-gray-100/70 p-4 rounded-xl border border-gray-200/60">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center justify-between">
              <span>Já li</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {jaLi.length}
              </span>
            </h2>

            <div className="flex flex-col gap-4">
              {jaLi.length > 0 ? (
                jaLi.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/livros/${item.id}`)}
                    className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex gap-3 items-center"
                  >
                    <CapaLivro livro={item} tamanho="mini" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block mb-1">
                        {item.categoria}
                      </span>
                      {item.ehMeuLivro && (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded inline-block ml-1 mb-1">
                          Meu cadastro
                        </span>
                      )}
                      <h3 className="font-bold text-gray-900 text-sm truncate">
                        {item.titulo}
                      </h3>
                      <p className="text-xs text-gray-500 truncate mb-1">{item.autor}</p>
                      {item.ehMeuLivro && (
                        <Link
                          to={`/livros/${item.id}/editar`}
                          onClick={(event) => event.stopPropagation()}
                          className="inline-block mb-1 text-xs font-semibold text-blue-700 hover:text-blue-900"
                        >
                          Editar informações
                        </Link>
                      )}
                      <AvaliacaoEstrelas nota={item.avaliacao} tamanho="sm" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 py-4 text-center">
                  Nenhum livro concluído.
                </p>
              )}
            </div>
          </section>
        </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}