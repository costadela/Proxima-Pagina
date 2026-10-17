import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAutenticacao } from '../contexts/useAutenticacao'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { usuario, sair } = useAutenticacao()
  const [erroSaida, setErroSaida] = useState('')

  const ehCatalogoAtivo = location.pathname === '/catalogo'
  const ehBibliotecaAtiva = location.pathname === '/minha-biblioteca'

  return (
    <header className="bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 sm:px-6">
        
        <Link
          to="/"
          aria-label="Próxima Página — página inicial"
          className="flex items-center gap-2.5 select-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-md shadow-blue-900/20">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.65"
                d="M12 7.1c-1.7-1.35-4.22-1.8-7.1-1.1v11.7c2.9-.7 5.4-.25 7.1 1.1m0-11.7c1.7-1.35 4.22-1.8 7.1-1.1v11.7c-2.9-.7-5.4-.25-7.1 1.1m0-11.7v11.7"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.4"
                d="M7.5 9.1c1.05-.15 2.05-.07 2.9.25m-2.9 2.3c1.05-.15 2.05-.07 2.9.25m4.1-2.55c.85-.32 1.85-.4 2.9-.25m-2.9 2.8c.85-.32 1.85-.4 2.9-.25"
              />
              <path
                strokeLinecap="round"
                strokeWidth="1.5"
                d="M18.3 3.2v2.1m1.05-1.05h-2.1"
              />
            </svg>
          </div>
          <span className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
            Próxima <span className="text-blue-700">Página</span>
          </span>
        </Link>

        {/* Links de Navegação */}
        <nav className="flex w-full items-center justify-between gap-3 sm:w-auto sm:gap-6">
          <Link
            to="/catalogo"
            className={`text-sm font-medium transition-colors ${
              ehCatalogoAtivo
                ? 'text-blue-600 font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Catálogo
          </Link>

          <Link
            to="/minha-biblioteca"
            className={`text-sm font-medium transition-colors ${
              ehBibliotecaAtiva
                ? 'text-blue-600 font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Minha biblioteca
          </Link>
        </nav>

        {usuario && (
          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            <span className="max-w-40 truncate text-xs text-gray-500 sm:max-w-48">
              {usuario.nome}
            </span>
            <button
              type="button"
              onClick={() => {
                setErroSaida('')
                void (async () => {
                  try {
                    await sair()
                    navigate('/', { replace: true, state: null })
                  } catch (error: unknown) {
                    setErroSaida(
                      error instanceof Error ? error.message : 'Não foi possível sair da conta.',
                    )
                  }
                })()
              }}
              className="text-sm font-semibold text-gray-600 transition-colors hover:text-blue-700"
            >
              Sair
            </button>
          </div>
        )}

      </div>
      {erroSaida && (
        <p role="alert" className="px-4 pb-3 text-right text-xs text-red-700">
          {erroSaida}
        </p>
      )}
    </header>
  )
}