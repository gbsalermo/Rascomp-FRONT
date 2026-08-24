export type UserRole = 'PARTICIPANTE' | 'ORGANIZACAO'
export type CompetitionStatus =
  | 'PLANEJADA'
  | 'INSCRICOES_ABERTAS'
  | 'INSCRICOES_ENCERRADAS'
  | 'EM_ANDAMENTO'
  | 'FINALIZADA'
  | 'CANCELADA'
export type RegistrationStatus =
  | 'PENDENTE'
  | 'APROVADA'
  | 'REJEITADA'
  | 'CANCELADA'
  | 'DESCLASSIFICADA'
export type Modalidade = 'SUMO' | 'FOLLOW_LINE'

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

export interface Competition {
  id?: number
  nome: string
  descricao?: string
  inicioInscricoes: string
  fimInscricoes: string
  dataInicio: string
  dataFim: string
  status?: CompetitionStatus
  ativo?: boolean
  dataCadastro?: string
}

export interface Category {
  id: number
  nome: string
  modalidade: Modalidade
  competitionId?: number
  ativo?: boolean
  [key: string]: unknown
}

export interface Registration {
  id: number
  competitionId: number
  competitionNome: string
  categoryId: number
  categoryNome: string
  teamId: number
  teamNome: string
  robotId: number
  robotNome: string
  competitorIds?: number[]
  competitorNomes?: string[]
  requestedByUserNome?: string
  reviewedByUserNome?: string
  reviewedAt?: string
  status: RegistrationStatus
  observacao?: string
  ativo?: boolean
  dataCadastro?: string
}

export interface RankingItem {
  posicao?: number
  registrationId: number
  teamNome?: string
  robotNome?: string
  tempoBruto?: number
  penalidadeSegundos?: number
  tempoFinal?: number
  [key: string]: unknown
}

export interface Bracket {
  id: number
  competitionId: number
  competitionNome?: string
  categoryId: number
  categoryNome?: string
  nome: string
  status?: string
  ativo?: boolean
}

export interface Match {
  id: number
  bracketId: number
  bracketNome?: string
  rodada: number
  ordem: number
  registrationAId?: number
  robotANome?: string
  registrationBId?: number
  robotBNome?: string
  dataHora?: string
  status?: string
  ativo?: boolean
}

export interface MatchResult {
  id: number
  matchId: number
  winnerRegistrationId?: number
  winnerRobotNome?: string
  pontosA?: number
  pontosB?: number
  [key: string]: unknown
}

export interface Team {
  id: number
  nome: string
  institutionId?: number
  institutionNome?: string
  ativo?: boolean
  [key: string]: unknown
}

export interface Robot {
  id: number
  nome: string
  descricao?: string
  teamId: number
  teamNome?: string
  ativo?: boolean
  [key: string]: unknown
}

export interface Competitor {
  id: number
  nome: string
  email?: string
  telefone?: string
  teamId?: number
  [key: string]: unknown
}
