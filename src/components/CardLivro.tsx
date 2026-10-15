import { useNavigate } from 'react-router-dom'
import type { Livro } from '../types/livros'

interface CardLivroProps {
  livro: Livro
  onAdicionar?: (id: string) => void
}

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

export default function CardLivro({ livro, onAdicionar }: CardLivroProps) {
  const navigate = useNavigate()
  const idNumerico = parseInt(livro.id, 10) || 0
  const corDeFundo = CORES_CAPA[idNumerico % CORES_CAPA.length]

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
      
      <div
        onClick={() => navigate(`/livros/${livro.id}`)}
        className="cursor-pointer flex-1 flex flex-col justify-between"
      >
        <div>
          {/* Capa de Livro Físico Centralizada */}
          <div className="w-full h-52 bg-slate-100 p-3 flex items-center justify-center border-b border-gray-100 relative">
            <div
              style={{ backgroundColor: corDeFundo }}
              className="w-32 h-44 rounded-r-md rounded-l-xs shadow-md group-hover:shadow-lg transition-shadow p-2.5 flex flex-col justify-center relative overflow-hidden select-none border-l-2 border-black/20"
            >
              {/* Efeito de lombada 3D */}
              <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-gradient-to-r from-black/25 via-black/10 to-transparent" />

              {/* Moldura sutil interna */}
              <div className="absolute inset-2 border border-white/20 rounded-xs pointer-events-none" />

              {/* Apenas o Título Centralizado */}
              <div className="z-10 text-center px-1">
                <h4 className="font-bold text-white text-sm leading-snug line-clamp-3 font-serif drop-shadow-xs">
                  {livro.titulo}
                </h4>
              </div>
            </div>
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
          onClick={(e) => {
            e.stopPropagation()
            onAdicionar && onAdicionar(livro.id)
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded-lg text-xs transition-colors shadow-xs"
        >
          Adicionar à biblioteca
        </button>
      </div>
    </div>
  )
}