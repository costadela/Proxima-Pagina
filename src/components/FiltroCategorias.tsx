interface FiltroCategoriasProps {
  categorias: string[]
  categoriaSelecionada: string
  onSelecionarCategoria: (categoria: string) => void
}

export default function FiltroCategorias({
  categorias,
  categoriaSelecionada,
  onSelecionarCategoria,
}: FiltroCategoriasProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 w-full">
      {categorias.map((categoria) => {
        const ativada = categoriaSelecionada === categoria
        return (
          <button
            key={categoria}
            onClick={() => onSelecionarCategoria(categoria)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              ativada
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {categoria}
          </button>
        )
      })}
    </div>
  )
}