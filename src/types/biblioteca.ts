export type StatusLeitura = 'QUERO_LER' | 'LENDO' | 'JA_LI'

export interface ItemBiblioteca {
  id: string
  livroId: string
  status: StatusLeitura
  avaliacao: number | null
}