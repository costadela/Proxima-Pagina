import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SeletorStatus from '../components/SeletorStatus'
import AvaliacaoEstrelas from '../components/AvaliacaoEstrelas'
import type { StatusLeitura } from '../types/biblioteca'
import { Link } from 'react-router-dom'

export default function CadastrarLivro() {
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [categoria, setCategoria] = useState('')
  const [ano, setAno] = useState('')
  const [paginas, setPaginas] = useState('')
  const [capaUrl, setCapaUrl] = useState('')
  const [sinopse, setSinopse] = useState('')
  const [status, setStatus] = useState<StatusLeitura>('QUERO_LER')
  const [avaliacao, setAvaliacao] = useState(0)

  const sugestoesCategorias = ['Romance', 'Fantasia', 'História', 'Tecnologia']

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-8">
        <Link
          to="/minha-biblioteca"
          className="text-sm text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-1 font-medium inline-flex"
        >
          ← Voltar para Minha biblioteca
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Cadastrar livro</h1>

          <form className="flex flex-col gap-5">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                placeholder="Ex.: Dom Casmurro"
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
                placeholder="Nome do autor"
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
                  placeholder="Digite ou escolha uma"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                <input
                  type="number"
                  placeholder="1899"
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Páginas</label>
                <input
                  type="number"
                  placeholder="256"
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

            {/* URL da capa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da capa
              </label>
              <input
                type="text"
                placeholder="https://"
                value={capaUrl}
                onChange={(e) => setCapaUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                Opcional. Cole o link da imagem da capa: no Google Imagens ou no site da editora, clique com o
botão direito na capa e escolha 'Copiar endereço da imagem'. O link deve terminar em .jpg ou
.png. Se ele sair do ar, o livro aparece com uma capa genérica e você pode corrigir depois.
              </p>
            </div>

            {/* Sinopse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sinopse</label>
              <textarea
                rows={3}
                placeholder="Resumo do livro"
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
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Salvar livro
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}