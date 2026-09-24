import type { Modalidade } from './competition'

export type FollowScheduleStatus =
  | 'AGENDADA'
  | 'EM_CHAMADA'
  | 'EM_ANDAMENTO'
  | 'FINALIZADA'
  | 'ADIADA'
  | 'CANCELADA'

export type FollowCallStatus =
  | 'AGUARDANDO'
  | 'CONVOCADA'
  | 'EM_APRESENTACAO'
  | 'EM_EXECUCAO'
  | 'CONCLUIDA'
  | 'AUSENTE'

export interface FollowTakeSchedule {
  id: number
  competitionId: number
  competitionNome?: string
  categoryId: number
  categoryNome?: string
  tomada: number
  dataHora: string
  pista?: string
  ordemExecucao?: number
  status?: FollowScheduleStatus
  ativo?: boolean
  totalFila?: number
  concluidos?: number
  ausentes?: number
  dataCadastro?: string
}

export interface FollowTakeScheduleEntry {
  id: number
  scheduleId: number
  competitionId?: number
  categoryId?: number
  tomada?: number
  registrationId: number
  robotNome?: string
  teamNome?: string
  registrationStatus?: string
  ordemConvocacao: number
  status: FollowCallStatus
  dataCadastro?: string
}

export interface AgendaActivity {
  tipo: 'FOLLOW_TAKE' | 'SUMO_MATCH'
  sourceId: number
  competitionId: number
  competitionNome?: string
  categoryId: number
  categoryNome?: string
  modalidade: Modalidade
  titulo: string
  dataHora?: string
  pista?: string
  ordemExecucao?: number
  status?: string
  tomada?: number
  bracketId?: number
  matchId?: number
  totalFila?: number
  concluidos?: number
  ausentes?: number
}
