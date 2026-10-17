import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAutenticacao } from '../contexts/useAutenticacao'

export default function RotaProtegida({ children }: { children: ReactNode }) {
  const { usuario, carregando, erroCarregamento } = useAutenticacao()
  const location = useLocation()

  if (carregando) {
    return <p className="p-8 text-center text-sm text-slate-600">Verificando sua sessão...</p>
  }

  if (erroCarregamento) {
    return (
      <p role="alert" className="m-8 rounded-lg bg-red-50 p-4 text-sm text-red-700">
        {erroCarregamento}
      </p>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
