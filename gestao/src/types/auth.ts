export type UserRole = 'DEV' | 'GESTAO' | 'MIDIA' | 'PARTICIPANTE'

export type AuthCapability =
  | 'operateCompetition'
  | 'manageUsers'
  | 'manageSystem'
  | 'manageMedia'
  | 'participant'

export interface UserAccount {
  id: number
  nome: string
  email: string
  telefone?: string
  role: UserRole
  ativo: boolean
  ultimoLogin?: string
  dataCadastro?: string
}

export interface AuthResponse {
  token: string
  tipo: 'Bearer' | string
  usuario: UserAccount
}
