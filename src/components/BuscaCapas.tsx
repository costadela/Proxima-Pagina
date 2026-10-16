import { useState } from 'react'
import { buscarCapas, type SugestaoCapa } from '../services/api'

interface BuscaCapasProps {
  titulo: string
  autor: string
  isbn: string
  onIsbnChange: (isbn: string) => void
  onSelecionar: (capaUrl: string) => void
}

export default function BuscaCapas({
  titulo,
  autor,
  isbn,
  onIsbnChange,
  onSelecionar,
}: BuscaCapasProps) {
  const [resultados, setResultados] = useState<SugestaoCapa[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const pesquisar = async () => {
    setCarregando(true)
    setErro('')
    setResultados([])
    try {
      const capas = await buscarCapas({ titulo, autor, isbn })
      setResultados(capas)
      if (capas.length === 0) setErro('Nenhuma capa encontrada. Você pode informar uma URL manualmente.')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível buscar capas.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
          ISBN (opcional)
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="isbn"
            type="text"
            value={isbn}
            onChange={(event) => onIsbnChange(event.target.value)}
            placeholder="Ex.: 9788535902778"
            className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            type="button"
            onClick={() => void pesquisar()}
            disabled={carregando || (!isbn.trim() && !titulo.trim() && !autor.trim())}
            className="px-4 py-2 text-sm font-medium text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {carregando ? 'Buscando...' : 'Buscar no Google Books'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Pesquise por ISBN para resultados mais precisos ou use o título e o autor.
        </p>
      </div>

      {erro && <p role="status" className="text-sm text-gray-600">{erro}</p>}

      {resultados.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {resultados.map((resultado) => (
            <button
              key={resultado.id}
              type="button"
              onClick={() => onSelecionar(resultado.capaUrl)}
              className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-2 text-left hover:border-blue-500 hover:bg-blue-50"
            >
              <img
                src={resultado.capaUrl}
                alt={`Capa sugerida: ${resultado.titulo}`}
                loading="lazy"
                className="h-32 w-24 rounded object-cover shadow-sm"
              />
              <span className="line-clamp-2 w-full text-xs font-medium text-gray-700">
                {resultado.titulo}
              </span>
              {resultado.autores.length > 0 && (
                <span className="line-clamp-1 w-full text-xs text-gray-500">
                  {resultado.autores.join(', ')}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
