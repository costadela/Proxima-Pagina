import { useNavigate } from 'react-router-dom'
import type { Livro } from '../types/livros'
import CapaLivro from './CapaLivro'

interface CardLivroProps {
  livro: Livro
  onAdicionar?: (id: string) => void
  jaNaBiblioteca?: boolean
}

export default function CardLivro({
  livro,
  onAdicionar,
  jaNaBiblioteca = false,
}: CardLivroProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
      
      <div
        onClick={() => navigate(`/livros/${livro.id}`)}
        className="cursor-pointer flex-1 flex flex-col justify-between"
      >
        <div>
          {/* Capa de Livro Físico Centralizada */}
          <div className="w-full h-52 bg-slate-100 p-3 flex items-center justify-center border-b border-gray-100 relative">
            <CapaLivro livro={livro} tamanho="catalogo" />
          </div>

          {/* Informações no corpo do card */}
          <div className="p-3.5">
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block">
              {livro.categoria}
            </span>
            <h3 className="font-bold text-gray-900 mt-1.5 text-sm line-clamp-1">
              {livro.titulo}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{livro.autor}</p>
          </div>
        </div>
      </div>

      <div className="p-3.5 pt-0">
        <button
          type="button"
          disabled={jaNaBiblioteca}
          onClick={(e) => {
            e.stopPropagation()
            if (onAdicionar) onAdicionar(livro.id)
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-1.5 px-3 rounded-lg text-xs transition-colors shadow-xs"
        >
          {jaNaBiblioteca ? 'Na biblioteca' : 'Adicionar à biblioteca'}
        </button>
      </div>
    </div>
  )
}