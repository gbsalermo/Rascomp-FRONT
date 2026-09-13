export type { UserRole, UserAccount, AuthResponse } from './types/auth'
export type {
  CompetitionStatus,
  RegistrationWindowChangeType,
  Modalidade,
  SumoPhysicalClass,
  SumoControlMode,
  Competition,
  CompetitionRegistrationWindowChange,
  Category,
  ConfigSumo,
  ConfigFollow
} from './types/competition'
export type { RankingItem, FollowAttempt, FollowTakeAbsence } from './types/follow'
export type RegistrationStatus =
  | 'PENDENTE'
  | 'APROVADA'
  | 'REJEITADA'
  | 'CANCELADA'
  | 'DESISTENTE'
  | 'DESCLASSIFICADA'
export type CancellationRequestStatus = 'PENDENTE' | 'APROVADA' | 'REJEITADA'
export type MatchCallStatus = 'NAO_CONVOCADA' | 'CONVOCADA' | 'EM_CHAMADA' | 'PRONTA' | 'ADIADA'
export type RoundSumoStatus = 'FINALIZADO' | 'EMPATADO' | 'ANULADO' | 'CANCELADO'
export type RoundSumoOutcomeReason =
  | 'DISPUTA'
  | 'SUICIDIO_WO'
  | 'PENALIDADES'
  | 'FALHA_INICIALIZACAO'
  | 'DECISAO_JUIZ'

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

export interface RegistrationCancellationRequest {
  id: number
  registrationId: number
  competitionId: number
  competitionNome?: string
  teamNome?: string
  robotNome?: string
  requestedByUserId?: number
  requestedByUserNome?: string
  status: CancellationRequestStatus
  motivo: string
  reviewedByUserId?: number
  reviewedByUserNome?: string
  reviewedAt?: string
  resposta?: string
  dataCadastro?: string
}

export interface SumoInspection {
  id: number
  registrationId: number
  numeroTentativa?: number
  pesoMedido?: number
  aprovada: boolean
  observacao?: string
  registradoPorId?: number
  registradoPorNome?: string
  dataCadastro?: string
}

export interface CompetitionJudge {
  id: number
  competitionId: number
  nome: string
  userAccountId?: number
  ativo?: boolean
  dataCadastro?: string
}

export interface MatchJudgeDecision {
  id: number
  matchId: number
  winnerRegistrationId: number
  winnerRobotNome?: string
  judgeId: number
  judgeNome?: string
  justificativa: string
  dataCadastro?: string
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
  atual?: boolean
  dataCadastro?: string
}

export interface Match {
  id: number
  bracketId: number
  bracketNome?: string
  bracketAtual?: boolean
  bracketAtivo?: boolean
  competitionId?: number
  competitionNome?: string
  categoryId?: number
  categoryNome?: string
  rodada: number
  ordem: number
  registrationAId?: number
  robotAId?: number
  robotANome?: string
  teamANome?: string
  registrationBId?: number
  robotBId?: number
  robotBNome?: string
  teamBNome?: string
  dataHora?: string
  pista?: string
  ordemExecucao?: number
  statusConvocacao?: MatchCallStatus
  status?: string
  ativo?: boolean
  dataCadastro?: string
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

export interface RoundSumo {
  id: number
  matchId: number
  numeroRound: number
  winnerRegistrationId?: number
  winnerRobotNome?: string
  status: RoundSumoStatus
  motivoResultado?: RoundSumoOutcomeReason
  penalidadesA?: number
  penalidadesB?: number
  observacao?: string
  justificativa?: string
  dataCadastro?: string
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

export interface RobotImage {
  id: number
  robotId: number
  originalFilename: string
  contentType: string
  principal: boolean
  ordem: number
  url: string
  dataCadastro?: string
}

export interface Competitor {
  id: number
  nome: string
  email?: string
  telefone?: string
  teamId?: number
  [key: string]: unknown
}
