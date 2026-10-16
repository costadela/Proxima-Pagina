import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SeletorStatus from '../components/SeletorStatus'
import AvaliacaoEstrelas from '../components/AvaliacaoEstrelas'
import BuscaCapas from '../components/BuscaCapas'
import type { StatusLeitura } from '../types/biblioteca'
import {
  atualizarItemBiblioteca,
  atualizarLivro,
  buscarLivro,
  type LivroComBiblioteca,
} from '../services/api'

interface FormularioLivro {
  titulo: string
  autor: string
  categoria: string
  ano: string
  paginas: string
  idioma: string
  capaUrl: string
  sinopse: string
}

const FORMULARIO_VAZIO: FormularioLivro = {
  titulo: '',
  autor: '',
  categoria: '',
  ano: '',
  paginas: '',
  idioma: 'Português',
  capaUrl: '',
  sinopse: '',
}

export default function EditarLivro() {
  const navigate = useNavigate()
  const { id = '' } = useParams<{ id: string }>()
  const [livro, setLivro] = useState<LivroComBiblioteca | null>(null)
  const [formulario, setFormulario] = useState(FORMULARIO_VAZIO)
  const [status, setStatus] = useState<StatusLeitura>('QUERO_LER')
  const [avaliacao, setAvaliacao] = useState(0)
  const [isbn, setIsbn] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let cancelado = false
    buscarLivro(id)
      .then((resultado) => {
        if (cancelado) return
        setLivro(resultado)
        setFormulario({
          titulo: resultado.titulo,
          autor: resultado.autor,
          categoria: resultado.categoria,
          ano: resultado.ano?.toString() ?? '',
          paginas: resultado.paginas?.toString() ?? '',
          idioma: resultado.idioma,
          capaUrl: resultado.capaUrl ?? '',
          sinopse: resultado.sinopse ?? '',
        })
        setStatus(resultado.biblioteca?.status ?? 'QUERO_LER')
        setAvaliacao(resultado.biblioteca?.avaliacao ?? 0)
      })
      .catch((error: unknown) => {
        if (!cancelado) {
          setErro(error instanceof Error ? error.message : 'Não foi possível carregar o livro.')
        }
      })
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => {
      cancelado = true
    }
  }, [id])

  const atualizarCampo = (campo: keyof FormularioLivro, valor: string) => {
    setFormulario((atual) => ({ ...atual, [campo]: valor }))
  }

  const handleSalvar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!livro) return
    setSalvando(true)
    try {
      await atualizarLivro(livro.id, {
        titulo: formulario.titulo,
        autor: formulario.autor,
        categoria: formulario.categoria,
        ano: formulario.ano ? Number(formulario.ano) : null,
        paginas: formulario.paginas ? Number(formulario.paginas) : null,
        idioma: formulario.idioma,
        capaUrl: formulario.capaUrl.trim() || null,
        sinopse: formulario.sinopse.trim() || null,
      })
      if (livro.biblioteca) {
        await atualizarItemBiblioteca(livro.id, { status, avaliacao: avaliacao || null })
      }
      navigate(`/livros/${livro.id}`, { replace: true })
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível salvar as alterações.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-8">
        <Link
          to={`/livros/${id}`}
          replace
          className="text-sm text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-1 font-medium inline-flex"
        >
          ← Voltar para o livro
        </Link>

        {erro && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {erro}
          </p>
        )}

        {carregando ? (
          <p className="py-12 text-center text-gray-500">Carregando livro...</p>
        ) : !livro ? null : !livro.ehMeuLivro ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Livros do catálogo não podem ser editados. Você pode apenas removê-los da sua biblioteca.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar informações</h1>

            <form onSubmit={(event) => void handleSalvar(event)} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="titulo">
                  Título
                </label>
                <input
                  id="titulo"
                  value={formulario.titulo}
                  onChange={(event) => atualizarCampo('titulo', event.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="autor">
                  Autor
                </label>
                <input
                  id="autor"
                  value={formulario.autor}
                  onChange={(event) => atualizarCampo('autor', event.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="categoria">
                    Categoria
                  </label>
                  <input
                    id="categoria"
                    value={formulario.categoria}
                    onChange={(event) => atualizarCampo('categoria', event.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ano">
                    Ano
                  </label>
                  <input
                    id="ano"
                    type="number"
                    min="0"
                    value={formulario.ano}
                    onChange={(event) => atualizarCampo('ano', event.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="paginas">
                    Páginas
                  </label>
                  <input
                    id="paginas"
                    type="number"
                    min="1"
                    value={formulario.paginas}
                    onChange={(event) => atualizarCampo('paginas', event.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="idioma">
                  Idioma
                </label>
                <input
                  id="idioma"
                  value={formulario.idioma}
                  onChange={(event) => atualizarCampo('idioma', event.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <BuscaCapas
                  titulo={formulario.titulo}
                  autor={formulario.autor}
                  isbn={isbn}
                  onIsbnChange={setIsbn}
                  onSelecionar={(capaUrl) => atualizarCampo('capaUrl', capaUrl)}
                />
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-1" htmlFor="capaUrl">
                  URL da capa selecionada
                </label>
                <input
                  id="capaUrl"
                  type="url"
                  value={formulario.capaUrl}
                  onChange={(event) => atualizarCampo('capaUrl', event.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinopse">
                  Sinopse
                </label>
                <textarea
                  id="sinopse"
                  rows={3}
                  value={formulario.sinopse}
                  onChange={(event) => atualizarCampo('sinopse', event.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                />
              </div>

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

              <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/livros/${livro.id}`, { replace: true })}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando}
                    className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg"
                  >
                    {salvando ? 'Salvando...' : 'Salvar alterações'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
