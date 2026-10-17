import { createContext } from 'react'
import type { Usuario } from '../services/api'

export interface AuthContexto {
  usuario: Usuario | null
  carregando: boolean
  erroCarregamento: string
  cadastrar: (dados: { nome: string; email: string; senha: string }) => Promise<void>
  entrar: (dados: { email: string; senha: string }) => Promise<void>
  sair: () => Promise<void>
}

export const ContextoAutenticacao = createContext<AuthContexto | null>(null)
