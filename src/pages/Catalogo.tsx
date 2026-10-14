import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Catalog() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Olá, bem-vindo ao Catálogo!</h1>
      </main>

      <Footer />
    </div>
  )
}