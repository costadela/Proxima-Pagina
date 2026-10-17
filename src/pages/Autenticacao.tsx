import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useAutenticacao } from '../contexts/useAutenticacao'

export default function Autenticacao() {
  const location = useLocation()
  const navigate = useNavigate()
  const { usuario, carregando, entrar, cadastrar } = useAutenticacao()
  const cadastro = location.pathname === '/cadastro'
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const destino = (() => {
    const from = location.state?.from
    if (
      typeof from === 'object' &&
      from !== null &&
      'pathname' in from &&
      typeof from.pathname === 'string' &&
      from.pathname.startsWith('/') &&
      !from.pathname.startsWith('//')
    ) {
      return `${from.pathname}${'search' in from && typeof from.search === 'string' ? from.search : ''}`
    }
    return '/minha-biblioteca'
  })()

  useEffect(() => {
    if (!carregando && usuario) navigate(destino, { replace: true })
  }, [carregando, destino, navigate, usuario])

  const enviar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      if (cadastro) await cadastrar({ nome, email, senha })
      else await entrar({ email, senha })
      navigate(destino, { replace: true })
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível acessar sua conta.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <Link to="/" className="text-sm font-medium text-blue-700 hover:text-blue-900">
            ← Voltar ao início
          </Link>
          <p className="mt-8 text-sm font-semibold text-blue-700">
            Próxima Página
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {cadastro ? 'Crie sua conta' : 'Que bom ter você de volta'}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {cadastro
              ? 'Cadastre-se para montar sua biblioteca e acompanhar suas leituras.'
              : 'Entre para acessar sua biblioteca e continuar sua jornada de leitura.'}
          </p>

          {erro && (
            <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {erro}
            </p>
          )}

          <form onSubmit={(event) => void enviar(event)} className="mt-7 space-y-5">
            {cadastro && (
              <div>
                <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Nome
                </label>
                <input
                  id="nome"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={80}
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
            <div>
              <label htmlFor="senha" className="mb-1.5 block text-sm font-medium text-slate-700">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                autoComplete={cadastro ? 'new-password' : 'current-password'}
                required
                minLength={8}
                maxLength={128}
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              {cadastro && <p className="mt-1.5 text-xs text-slate-500">Use pelo menos 8 caracteres.</p>}
            </div>
            <button
              type="submit"
              disabled={enviando || carregando}
              className="w-full rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60"
            >
              {enviando ? 'Aguarde...' : cadastro ? 'Criar conta' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {cadastro ? 'Já tem uma conta?' : 'Ainda não tem conta?'}{' '}
            <Link
              to={cadastro ? '/login' : '/cadastro'}
              state={location.state}
              className="font-semibold text-blue-700 hover:text-blue-900"
            >
              {cadastro ? 'Entrar' : 'Cadastre-se'}
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
