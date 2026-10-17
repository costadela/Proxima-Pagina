import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ContextoAutenticacao } from './contextoAutenticacao'
import {
  cadastrarUsuario as apiCadastrarUsuario,
  entrar as apiEntrar,
  obterUsuarioAtual,
  sair as apiSair,
  type Usuario,
} from '../services/api'

export function ProvedorAutenticacao({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState('')

  useEffect(() => {
    let cancelado = false
    obterUsuarioAtual()
      .then(({ usuario: usuarioAtual }) => {
        if (!cancelado) setUsuario(usuarioAtual)
      })
      .catch((error: unknown) => {
        if (!cancelado) {
          setErroCarregamento(
            error instanceof Error ? error.message : 'Não foi possível verificar a sessão.',
          )
        }
      })
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  const cadastrar = useCallback(async (dados: { nome: string; email: string; senha: string }) => {
    const resultado = await apiCadastrarUsuario(dados)
    setUsuario(resultado.usuario)
    setErroCarregamento('')
  }, [])

  const entrar = useCallback(async (dados: { email: string; senha: string }) => {
    const resultado = await apiEntrar(dados)
    setUsuario(resultado.usuario)
    setErroCarregamento('')
  }, [])

  const sair = useCallback(async () => {
    await apiSair()
    setUsuario(null)
  }, [])

  const valor = useMemo(
    () => ({ usuario, carregando, erroCarregamento, cadastrar, entrar, sair }),
    [usuario, carregando, erroCarregamento, cadastrar, entrar, sair],
  )

  return <ContextoAutenticacao.Provider value={valor}>{children}</ContextoAutenticacao.Provider>
}
