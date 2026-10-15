import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()

  const ehCatalogoAtivo =
    location.pathname === '/catalogo' || location.pathname === '/'
  const ehBibliotecaAtiva = location.pathname === '/minha-biblioteca'

  return (
    <header className="bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <div className="flex items-center gap-2.5 select-none">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900 font-serif">
            Próxima <span className="text-blue-600 font-sans">Página</span>
          </span>
        </div>

        {/* Links de Navegação */}
        <nav className="flex items-center gap-6">
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

      </div>
    </header>
  )
}