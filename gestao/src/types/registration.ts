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
  reviewReason?: string
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


export type RegistrationStatusChangeType =
  | 'CRIACAO'
  | 'APROVACAO'
  | 'REJEICAO'
  | 'CANCELAMENTO'
  | 'DESISTENCIA'
  | 'REATIVACAO'
  | 'DESCLASSIFICACAO'

export interface RegistrationStatusHistory {
  id: number
  registrationId: number
  previousStatus?: RegistrationStatus
  newStatus: RegistrationStatus
  changeType: RegistrationStatusChangeType
  actorUserId?: number
  actorUserNome?: string
  reason?: string
  dataCadastro?: string
}
