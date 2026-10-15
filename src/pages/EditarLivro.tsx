import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SeletorStatus from '../components/SeletorStatus'
import AvaliacaoEstrelas from '../components/AvaliacaoEstrelas'
import type { StatusLeitura } from '../types/biblioteca'
import { LIVROS_MOCK } from '../mocks/livrosMock'

export default function EditarLivro() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

const livroOriginal = LIVROS_MOCK.find((l) => l.id === id) || LIVROS_MOCK[0]

  const [titulo, setTitulo] = useState(livroOriginal.titulo)
  const [autor, setAutor] = useState(livroOriginal.autor)
  const [categoria, setCategoria] = useState(livroOriginal.categoria)
  const [ano, setAno] = useState(String(livroOriginal.ano || ''))
  const [paginas, setPaginas] = useState(String(livroOriginal.paginas || ''))
  const [sinopse, setSinopse] = useState(livroOriginal.sinopse || '')
  const [status, setStatus] = useState<StatusLeitura>('JA_LI')
  const [avaliacao, setAvaliacao] = useState(5)

  const sugestoesCategorias = ['Romance', 'Fantasia', 'História', 'Tecnologia']

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Alterações salvas:', {
      id: livroOriginal.id,
      titulo,
      autor,
      categoria,
      ano,
      paginas,
      sinopse,
      status,
      avaliacao,
    })
    navigate(`/livros/${livroOriginal.id}`)
  }

  const handleExcluir = () => {
    if (confirm('Tem certeza de que deseja excluir este livro?')) {
      console.log('Livro excluído!')
      navigate('/minha-biblioteca')
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-8">
        <Link
          to={`/livros/${livroOriginal.id}`}
          className="text-sm text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-1 font-medium inline-flex"
        >
          ← Voltar para o livro
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar informações</h1>

          <form onSubmit={handleSalvar} className="flex flex-col gap-5">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
            </div>

            {/* Autor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
              <input
                type="text"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
            </div>

            {/* Categoria, Ano e Páginas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <input
                  type="text"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                <input
                  type="number"
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Páginas</label>
                <input
                  type="number"
                  value={paginas}
                  onChange={(e) => setPaginas(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Sugestões de Categoria */}
            <div className="flex items-center gap-2 -mt-2">
              <span className="text-xs text-gray-500">Sugestões:</span>
              {sugestoesCategorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoria(cat)}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sinopse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sinopse</label>
              <textarea
                rows={3}
                value={sinopse}
                onChange={(e) => setSinopse(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none"
              />
            </div>

            {/* Status e Avaliação */}
            <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status na minha biblioteca
                </label>
                <SeletorStatus statusAtual={status} onAlterarStatus={setStatus} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minha avaliação
                </label>
                <AvaliacaoEstrelas nota={avaliacao} onChange={setAvaliacao} tamanho="md" />
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleExcluir}
                className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
              >
                Excluir livro
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/livros/${livroOriginal.id}`)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Salvar alterações
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}