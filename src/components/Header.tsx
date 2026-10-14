export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
      <h2 className="text-xl font-bold text-gray-900">Próxima Página</h2>
      <nav className="flex gap-4">
        <a href="#" className="font-semibold text-blue-600 hover:underline">
          Catálogo
        </a>
        <a href="#" className="text-gray-500 hover:text-gray-900 hover:underline">
          Minha biblioteca
        </a>
      </nav>
    </header>
  )
}