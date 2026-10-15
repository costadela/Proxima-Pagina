import type { StatusLeitura } from '../types/biblioteca'

interface SeletorStatusProps {
  statusAtual?: StatusLeitura
  onAlterarStatus: (novoStatus: StatusLeitura) => void
}

export default function SeletorStatus({
  statusAtual,
  onAlterarStatus,
}: SeletorStatusProps) {
  const opcoes: { id: StatusLeitura; label: string }[] = [
    { id: 'QUERO_LER', label: 'Quero ler' },
    { id: 'LENDO', label: 'Lendo' },
    { id: 'JA_LI', label: 'Já li' },
  ]

  return (
    <div className="flex items-center gap-2">
      {opcoes.map((opcao) => {
        const estaAtivo = statusAtual === opcao.id

        return (
          <button
            key={opcao.id}
            type="button"
            onClick={() => onAlterarStatus(opcao.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              estaAtivo
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {opcao.label}
          </button>
        )
      })}
    </div>
  )
}