export type UserRole = 'DEV' | 'GESTAO' | 'MIDIA' | 'PARTICIPANTE'
export type InternalUserRole = Exclude<UserRole, 'PARTICIPANTE'>

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

export interface InternalUserCreatePayload {
  nome: string
  email: string
  senha: string
  telefone?: string
}

export interface AuthResponse {
  token: string
  tipo: 'Bearer' | string
  usuario: UserAccount
}
