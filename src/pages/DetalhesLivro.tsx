import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SeletorStatus from '../components/SeletorStatus'
import AvaliacaoEstrelas from '../components/AvaliacaoEstrelas'
import type { StatusLeitura } from '../types/biblioteca'
import { LIVROS_MOCK } from '../mocks/livrosMock'

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

export default function DetalhesLivro() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const livro = LIVROS_MOCK.find((l) => l.id === id) || LIVROS_MOCK[0]

  const [status, setStatus] = useState<StatusLeitura>('QUERO_LER')
  const [avaliacao, setAvaliacao] = useState(0)

  const idNumerico = parseInt(livro.id, 10) || 0
  const corDeFundo = CORES_CAPA[idNumerico % CORES_CAPA.length]

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-1 font-medium cursor-pointer"
        >
          ← Voltar
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8">
          {/* Capa de Livro Físico Estilizada */}
          <div
            style={{ backgroundColor: corDeFundo }}
            className="w-full md:w-56 h-80 rounded-r-xl rounded-l-xs shadow-md flex flex-col justify-between p-6 relative overflow-hidden select-none border-l-4 border-black/20 flex-shrink-0"
          >
            {/* Efeito de lombada 3D */}
            <div className="absolute top-0 left-0 bottom-0 w-3.5 bg-gradient-to-r from-black/25 via-black/10 to-transparent" />

            {/* Moldura sutil interna */}
            <div className="absolute inset-3 border border-white/20 rounded-xs pointer-events-none" />

            {/* Apenas o Título Centralizado */}
            <div className="z-10 my-auto text-center px-2">
              <h2 className="font-bold text-white text-lg leading-snug line-clamp-4 font-serif drop-shadow-xs">
                {livro.titulo}
              </h2>
            </div>
          </div>

          {/* Informações detalhadas */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {livro.categoria}
                </span>
                {livro.ehMeuLivro && (
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Meu livro
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {livro.titulo}
              </h1>
              <p className="text-gray-600 text-lg mt-1">{livro.autor}</p>

              {/* Ficha técnica */}
              <div className="flex items-center gap-6 mt-4 text-sm text-gray-500 border-y border-gray-100 py-3">
                <div>
                  <span className="block text-xs font-semibold text-gray-400">Ano</span>
                  {livro.ano || 1900}
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400">Páginas</span>
                  {livro.paginas || 200}
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400">Idioma</span>
                  {livro.idioma || 'Português'}
                </div>
              </div>

              <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                {livro.sinopse ||
                  'Sem sinopse cadastrada para este livro no momento.'}
              </p>
            </div>

            {/* Configurações de Leitura e Avaliação */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <SeletorStatus statusAtual={status} onAlterarStatus={setStatus} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minha avaliação
                </label>
                <AvaliacaoEstrelas nota={avaliacao} onChange={setAvaliacao} tamanho="lg" />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors">
                  Salvar alterações
                </button>
                <button className="text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-50 transition-colors">
                  Remover da biblioteca
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}