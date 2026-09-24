export type MatchCallStatus = 'NAO_CONVOCADA' | 'CONVOCADA' | 'EM_CHAMADA' | 'PRONTA' | 'ADIADA'
export type RoundSumoStatus = 'FINALIZADO' | 'EMPATADO' | 'ANULADO' | 'CANCELADO'
export type RoundSumoOutcomeReason =
  | 'DISPUTA'
  | 'SUICIDIO_WO'
  | 'PENALIDADES'
  | 'FALHA_INICIALIZACAO'
  | 'DECISAO_JUIZ'

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
  registrationAStatus?: string
  robotAId?: number
  robotANome?: string
  teamANome?: string
  registrationBId?: number
  registrationBStatus?: string
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
