import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BarraBusca from '../components/BarraBusca'
import FiltroCategorias from '../components/FiltroCategorias'
import AvaliacaoEstrelas from '../components/AvaliacaoEstrelas'
import { LIVROS_MOCK } from '../mocks/livrosMock'
import type { Livro } from '../types/livros'

const CORES_CAPA = [
  '#647C64', // Verde
  '#7189A6', // Azul
  '#B87979', // Rosa queimado
  '#C49A55', // Mostarda
  '#8875A5', // Roxo
  '#C4774F', // Terracota
  '#527D82', // Azul petróleo
  '#6C757D', // Cinza
]

export default function MinhaBiblioteca() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos')

  const categorias: string[] = [
    'Todos',
    ...Array.from(new Set(LIVROS_MOCK.map((livro: Livro) => livro.categoria))),
  ]

  const livrosBiblioteca = [
    { ...LIVROS_MOCK[0], status: 'LENDO', avaliacao: 0 }, // Dom Casmurro
    { ...LIVROS_MOCK[10], status: 'QUERO_LER', avaliacao: 0 }, // O Hobbit
    { ...LIVROS_MOCK[16], status: 'JA_LI', avaliacao: 5 }, // 1984
    { ...LIVROS_MOCK[45], status: 'JA_LI', avaliacao: 5 }, // Código Limpo
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

  // Helper para renderizar a mini capa limpa no mesmo formato de livro
  const renderCapaColorida = (item: Livro) => {
    const idNumerico = parseInt(item.id, 10) || 0
    const corDeFundo = CORES_CAPA[idNumerico % CORES_CAPA.length]

    return (
      <div
        style={{ backgroundColor: corDeFundo }}
        className="w-14 h-20 rounded-r-md rounded-l-xs shadow-sm flex-shrink-0 flex items-center justify-center p-1.5 relative overflow-hidden select-none border-l-2 border-black/20 text-center"
      >
        {/* Efeito de lombada 3D */}
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-r from-black/25 via-black/10 to-transparent" />
        
        {/* Moldura sutil interna */}
        <div className="absolute inset-1 border border-white/20 rounded-xs pointer-events-none" />

        {/* Apenas o Título em destaque */}
        <h4 className="font-bold text-white text-[9px] leading-tight line-clamp-3 font-serif drop-shadow-xs z-10">
          {item.titulo}
        </h4>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
  <h1 className="text-lg md:text-xl font-bold text-gray-900">
    Minha biblioteca
  </h1>
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
                    {renderCapaColorida(item)}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block mb-1">
                        {item.categoria}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm truncate">
                        {item.titulo}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">{item.autor}</p>
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
                    {renderCapaColorida(item)}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block mb-1">
                        {item.categoria}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm truncate">
                        {item.titulo}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">{item.autor}</p>
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
                    {renderCapaColorida(item)}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block mb-1">
                        {item.categoria}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm truncate">
                        {item.titulo}
                      </h3>
                      <p className="text-xs text-gray-500 truncate mb-1">{item.autor}</p>
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
      </main>

      <Footer />
    </div>
  )
}