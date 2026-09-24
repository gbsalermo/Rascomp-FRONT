import type { Modalidade } from './competition'

export interface CompetitionCategoryResult {
  categoryId: number
  categoryNome: string
  modalidade: Modalidade
  status: 'CONCLUIDO' | 'PENDENTE'
  winnerRegistrationId?: number
  winnerRobotNome?: string
  winnerTeamNome?: string
  tempoFinalSegundos?: number
  pontosA?: number
  pontosB?: number
  finalMatchId?: number
  resolutionType?: 'RANKING' | 'DECISAO_ORGANIZACAO'
  resolutionReason?: string
  resolutionActorNome?: string
  resolutionAt?: string
  extraTakeAvailable?: boolean
  extraTakeActive?: boolean
  manualDecisionAvailable?: boolean
  extraTakeNumber?: number
}
