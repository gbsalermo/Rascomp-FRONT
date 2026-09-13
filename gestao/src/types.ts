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
export type {
  RegistrationStatus,
  CancellationRequestStatus,
  Registration,
  RegistrationCancellationRequest
} from './types/registration'
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
