import Header from '../components/Header'
import Footer from '../components/Footer'

export default function CadastroLivro() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <Header />
      <main className="flex-1 max-w-2xl w-full mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Cadastrar livro</h1>
        <p className="text-gray-600">Formulário de cadastro e edição de livros em construção.</p>
      </main>
      <Footer />
    </div>
  )
}