import { useState } from 'react'
import type { Livro } from '../types/livros'

interface CapaLivroProps {
  livro: Pick<Livro, 'id' | 'titulo' | 'capaUrl'>
  tamanho: 'catalogo' | 'detalhe' | 'mini'
}

const CORES_CAPA = [
  '#647C64',
  '#7189A6',
  '#B87979',
  '#C49A55',
  '#8875A5',
  '#C4774F',
  '#527D82',
  '#6C757D',
]

const CLASSES_TAMANHO = {
  catalogo: 'w-32 h-44 rounded-r-md rounded-l-xs border-l-2',
  detalhe: 'w-full md:w-56 h-80 rounded-r-xl rounded-l-xs border-l-4',
  mini: 'w-14 h-20 rounded-r-md rounded-l-xs border-l-2',
}

export default function CapaLivro({ livro, tamanho }: CapaLivroProps) {
  const [urlComFalha, setUrlComFalha] = useState<string | null>(null)
  const idNumerico = Number.parseInt(livro.id, 10) || 0
  const corDeFundo = CORES_CAPA[idNumerico % CORES_CAPA.length]
  const exibirImagem = Boolean(livro.capaUrl && urlComFalha !== livro.capaUrl)

  return (
    <div
      style={{ backgroundColor: corDeFundo }}
      className={`${CLASSES_TAMANHO[tamanho]} shadow-md flex flex-col justify-center relative overflow-hidden select-none border-black/20 flex-shrink-0`}
    >
      {exibirImagem && (
        <img
          src={livro.capaUrl ?? undefined}
          alt={`Capa de ${livro.titulo}`}
          loading="lazy"
          onError={() => setUrlComFalha(livro.capaUrl)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <div
        className={`absolute top-0 left-0 bottom-0 ${
          tamanho === 'mini' ? 'w-1' : tamanho === 'detalhe' ? 'w-3.5' : 'w-2.5'
        } bg-gradient-to-r from-black/25 via-black/10 to-transparent`}
      />

      {!exibirImagem && (
        <div className={`z-10 text-center ${tamanho === 'mini' ? 'px-1.5' : 'px-2'}`}>
          <h2 className={`font-bold text-white leading-snug line-clamp-4 font-serif drop-shadow-xs ${
            tamanho === 'mini' ? 'text-[9px]' : tamanho === 'detalhe' ? 'text-lg' : 'text-sm'
          }`}>
            {livro.titulo}
          </h2>
        </div>
      )}
    </div>
  )
}
