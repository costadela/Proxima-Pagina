import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import MinhaBiblioteca from './pages/MinhaBiblioteca'
import DetalhesLivro from './pages/DetalhesLivro'
import CadastrarLivro from './pages/CadastrarLivro'
import EditarLivro from './pages/EditarLivro'
import Autenticacao from './pages/Autenticacao'
import RotaProtegida from './components/RotaProtegida'
import { ProvedorAutenticacao } from './contexts/AuthContext'

export default function App() {
  return (
    <BrowserRouter>
      <ProvedorAutenticacao>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/login" element={<Autenticacao />} />
          <Route path="/cadastro" element={<Autenticacao />} />

          <Route
            path="/minha-biblioteca"
            element={<RotaProtegida><MinhaBiblioteca /></RotaProtegida>}
          />
          <Route path="/biblioteca" element={<Navigate to="/minha-biblioteca" replace />} />

          <Route
            path="/livros/novo"
            element={<RotaProtegida><CadastrarLivro /></RotaProtegida>}
          />
          <Route path="/livros/:id" element={<DetalhesLivro />} />
          <Route
            path="/livros/:id/editar"
            element={<RotaProtegida><EditarLivro /></RotaProtegida>}
          />
        </Routes>
      </ProvedorAutenticacao>
    </BrowserRouter>
  )
}