import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Catalogo from './pages/Catalogo'
import MinhaBiblioteca from './pages/MinhaBiblioteca'
import DetalhesLivro from './pages/DetalhesLivro'
import CadastrarLivro from './pages/CadastrarLivro'
import EditarLivro from './pages/EditarLivro'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
    
        <Route path="/" element={<Catalogo />} />
        <Route path="/catalogo" element={<Catalogo />} />

        <Route path="/minha-biblioteca" element={<MinhaBiblioteca />} />
        <Route path="/biblioteca" element={<Navigate to="/minha-biblioteca" replace />} />
        
        <Route path="/livros/novo" element={<CadastrarLivro />} />
        <Route path="/livros/:id" element={<DetalhesLivro />} />
        <Route path="/livros/:id/editar" element={<EditarLivro />} />
      </Routes>
    </BrowserRouter>
  )
}