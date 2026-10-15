interface AvaliacaoEstrelasProps {
  nota?: number // De 1 a 5
  onChange?: (novaNota: number) => void // Opcional: se fornecido, permite alterar
  tamanho?: 'sm' | 'md' | 'lg'
}

export default function AvaliacaoEstrelas({
  nota = 0,
  onChange,
  tamanho = 'md',
}: AvaliacaoEstrelasProps) {
  const estrelas = [1, 2, 3, 4, 5]

  // Ajusta o tamanho visual dos ícones
  const tamanhosMap = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  return (
    <div className="flex items-center gap-1">
      {estrelas.map((estrela) => {
        const preenchida = estrela <= nota

        return (
          <button
            key={estrela}
            type="button"
            disabled={!onChange} // Desabilita se for apenas exibição
            onClick={() => onChange && onChange(estrela)}
            className={`${tamanhosMap[tamanho]} ${
              onChange ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
            } ${preenchida ? 'text-amber-400' : 'text-gray-300'}`}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}