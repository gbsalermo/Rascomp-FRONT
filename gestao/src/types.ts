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
export type {
  MatchCallStatus,
  RoundSumoStatus,
  RoundSumoOutcomeReason,
  SumoInspection,
  CompetitionJudge,
  MatchJudgeDecision,
  Bracket,
  Match,
  MatchResult,
  RoundSumo
} from './types/sumo'
export type RegistrationStatus =
  | 'PENDENTE'
  | 'APROVADA'
  | 'REJEITADA'
  | 'CANCELADA'
  | 'DESISTENTE'
  | 'DESCLASSIFICADA'
export type CancellationRequestStatus = 'PENDENTE' | 'APROVADA' | 'REJEITADA'
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
