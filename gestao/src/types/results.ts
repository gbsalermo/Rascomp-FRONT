import type { Modalidade } from './competition'

export interface CompetitionCategoryResult {
  categoryId: number
  categoryNome: string
  modalidade: Modalidade
  status: 'CONCLUIDO' | 'PARCIAL' | 'PENDENTE'
  winnerRegistrationId?: number
  winnerRobotNome?: string
  winnerTeamNome?: string
  secondRegistrationId?: number
  secondRobotNome?: string
  secondTeamNome?: string
  secondTempoFinalSegundos?: number
  thirdRegistrationId?: number
  thirdRobotNome?: string
  thirdTeamNome?: string
  thirdTempoFinalSegundos?: number
  tempoFinalSegundos?: number
  pontosA?: number
  pontosB?: number
  finalMatchId?: number
  thirdPlaceMatchId?: number
  resolutionType?: 'RANKING' | 'DECISAO_ORGANIZACAO'
  resolutionReason?: string
  resolutionActorNome?: string
  resolutionAt?: string
  extraTakeAvailable?: boolean
  extraTakeActive?: boolean
  manualDecisionAvailable?: boolean
  extraTakeNumber?: number
}
