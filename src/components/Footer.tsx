export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white py-8 mt-auto text-center text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-2">
        
        {/* Linha 1: Identificação do App */}
        <p className="text-gray-600 font-medium">
          Próxima Página — Seu companheiro de leituras
        </p>

        {/* Linha 2: Crédito com link */}
        <p className="text-gray-600">
          Desenvolvido por{' '}
          <a
            href="https://vitorcostadela.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-medium hover:underline transition-colors"
          >
            Vitor Costadela
          </a>
        </p>

      </div>
    </footer>
  )
}