export interface RankingItem {
  posicao?: number
  registrationId: number
  robotId?: number
  teamNome?: string
  robotNome?: string
  tempoBrutoSegundos?: number
  penalidadeSegundos?: number
  tempoFinalSegundos?: number
  tomada?: number
  numeroTentativa?: number
  [key: string]: unknown
}

export interface FollowAttempt {
  id: number
  registrationId: number
  competitionId?: number
  categoryId?: number
  teamNome?: string
  robotNome?: string
  tomada: number
  numeroTentativa: number
  tempoSegundos?: number
  checkpointsAlcancados: number
  penalidadeSegundos: number
  tempoFinalSegundos?: number
  concluida: boolean
  valida: boolean
  observacao?: string
  dataCadastro?: string
}

export interface FollowTakeAbsence {
  id: number
  registrationId: number
  competitionId?: number
  categoryId?: number
  teamNome?: string
  robotNome?: string
  tomada: number
  observacao?: string
  registradoPorId?: number
  registradoPorNome?: string
  dataCadastro?: string
}
