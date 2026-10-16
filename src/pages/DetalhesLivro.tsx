import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SeletorStatus from '../components/SeletorStatus'
import AvaliacaoEstrelas from '../components/AvaliacaoEstrelas'
import CapaLivro from '../components/CapaLivro'
import type { StatusLeitura } from '../types/biblioteca'
import {
  atualizarItemBiblioteca,
  buscarLivro,
  adicionarBiblioteca,
  excluirLivro,
  removerDaBiblioteca,
  type LivroComBiblioteca,
} from '../services/api'

export default function DetalhesLivro() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [livro, setLivro] = useState<LivroComBiblioteca | null>(null)
  const [status, setStatus] = useState<StatusLeitura>('QUERO_LER')
  const [avaliacao, setAvaliacao] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    let cancelado = false
    buscarLivro(id)
      .then((resultado) => {
        if (cancelado) return
        setLivro(resultado)
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

  const salvarNaBiblioteca = async () => {
    if (!livro?.biblioteca) return
    setSalvando(true)
    try {
      const item = await atualizarItemBiblioteca(livro.id, { status, avaliacao: avaliacao || null })
      setLivro({ ...livro, biblioteca: item })
      setMensagem('Alterações salvas.')
      setErro('')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível salvar as alterações.')
    } finally {
      setSalvando(false)
    }
  }

  const adicionar = async () => {
    if (!livro) return
    setSalvando(true)
    try {
      const item = await adicionarBiblioteca(livro.id)
      setLivro({ ...livro, biblioteca: item })
      setStatus(item.status)
      setAvaliacao(item.avaliacao ?? 0)
      setErro('')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível adicionar o livro.')
    } finally {
      setSalvando(false)
    }
  }

  const remover = async () => {
    if (!livro || !window.confirm('Remover este livro da sua biblioteca?')) return
    setSalvando(true)
    try {
      await removerDaBiblioteca(livro.id)
      setLivro({ ...livro, biblioteca: null })
      setStatus('QUERO_LER')
      setAvaliacao(0)
      setMensagem('Livro removido da biblioteca.')
      setErro('')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível remover o livro.')
    } finally {
      setSalvando(false)
    }
  }

  const excluir = async () => {
    if (!livro || !window.confirm('Excluir este livro da sua biblioteca?')) return
    setSalvando(true)
    try {
      await excluirLivro(livro.id)
      navigate('/minha-biblioteca')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível excluir o livro.')
    } finally {
      setSalvando(false)
    }
  }

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

        {erro && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {erro}
          </p>
        )}
        {mensagem && (
          <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {mensagem}
          </p>
        )}

        {carregando ? (
          <p className="py-12 text-center text-gray-500">Carregando livro...</p>
        ) : livro ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8">
            <CapaLivro livro={livro} tamanho="detalhe" />

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

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{livro.titulo}</h1>
                <p className="text-gray-600 text-lg mt-1">{livro.autor}</p>

                <div className="flex items-center gap-6 mt-4 text-sm text-gray-500 border-y border-gray-100 py-3">
                  <div>
                    <span className="block text-xs font-semibold text-gray-400">Ano</span>
                    {livro.ano ?? 'Não informado'}
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400">Páginas</span>
                    {livro.paginas ?? 'Não informado'}
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400">Idioma</span>
                    {livro.idioma}
                  </div>
                </div>

                <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                  {livro.sinopse || 'Sem sinopse cadastrada para este livro no momento.'}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-6">
                {livro.biblioteca ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                      <SeletorStatus statusAtual={status} onAlterarStatus={setStatus} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Minha avaliação
                      </label>
                      <AvaliacaoEstrelas nota={avaliacao} onChange={setAvaliacao} tamanho="lg" />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => void salvarNaBiblioteca()}
                        disabled={salvando}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-60"
                      >
                        Salvar alterações
                      </button>
                      {livro.ehMeuLivro ? (
                        <>
                          <Link
                            to={`/livros/${livro.id}/editar`}
                            className="text-blue-700 border border-blue-200 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50"
                          >
                            Editar informações
                          </Link>
                          <button
                            onClick={() => void excluir()}
                            disabled={salvando}
                            className="text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-50 disabled:opacity-60"
                          >
                            Excluir livro
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => void remover()}
                          disabled={salvando}
                          className="text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-50 disabled:opacity-60"
                        >
                          Remover da biblioteca
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => void adicionar()}
                    disabled={salvando}
                    className="self-start bg-blue-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-60"
                  >
                    Adicionar à biblioteca
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}
