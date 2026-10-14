import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Catalogo from "./pages/Catalogo";
import MinhaBiblioteca from "./pages/MinhaBiblioteca";
import DetalhesLivro from "./pages/DetalhesLivro";
import CadastroLivro from "./pages/CadastroLivro";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/minha-biblioteca" element={<MinhaBiblioteca />} />
        <Route path="/livro/:id" element={<DetalhesLivro />} />
        <Route path="/cadastrar-livro" element={<CadastroLivro />} />
        <Route path="/editar-livro/:id" element={<CadastroLivro />} />
      </Routes>
    </BrowserRouter>
  )
}