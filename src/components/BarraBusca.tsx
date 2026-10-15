interface BarraBuscaProps {
  valor: string
  onChange: (novoValor: string) => void
  placeholder?: string
}

export default function BarraBusca({
  valor,
  onChange,
  placeholder = 'Buscar por título ou autor...',
}: BarraBuscaProps) {
  return (
    <div className="w-full">
      <input
        type="text"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all shadow-sm"
      />
    </div>
  )
}