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
  teamNome: string
  robotId: number
  robotNome: string
  robotDescricao?: string
  competitorIds?: number[]
  competitorNomes?: string[]
  requestedByUserNome?: string
  reviewedByUserNome?: string
  reviewedAt?: string
  reviewReason?: string
  status: RegistrationStatus
  observacao?: string
  comprovanteDisponivel?: boolean
  comprovanteNome?: string
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
  | 'ENTRADA_MANUAL'
  | 'AJUSTE_COMPOSICAO'

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


export interface ManualCompetitionEntryRequest {
  competitionId: number
  categoryId: number
  participantUserId: number
  teamId?: number
  robotNome: string
  robotDescricao?: string
  justificativa: string
}


export interface ManualParticipantEntryRequest {
  competitionId: number
  participantUserId: number
  teamId?: number
  justificativa: string
}

export type ParticipantCompetitionRegistrationStatus =
  | 'PENDENTE'
  | 'APROVADA'
  | 'CORRECAO_SOLICITADA'
  | 'REJEITADA'
  | 'CANCELADA'

export interface ParticipantRobotLink {
  robotId: number
  robotNome: string
  registrationId?: number
  categoryId?: number
  categoryNome?: string
  registrationStatus?: RegistrationStatus
}

export interface ParticipantCompetitionRegistration {
  id: number
  competitionId: number
  competitionNome: string
  competitorId: number
  competitorNome: string
  teamId: number
  teamNome: string
  teamLeader?: boolean
  status: ParticipantCompetitionRegistrationStatus
  observacao?: string
  comprovanteDisponivel?: boolean
  comprovanteNome?: string
  requestedByUserId?: number
  requestedByUserNome?: string
  reviewedByUserId?: number
  reviewedByUserNome?: string
  reviewedAt?: string
  reviewReason?: string
  ativo?: boolean
  dataCadastro?: string
  robots: ParticipantRobotLink[]
}

export interface RegistrationCompetitorContext {
  competitorId: number
  competitorNome: string
  robotResponsible: boolean
  officialCompetitor: boolean
  participantRegistrationId?: number
  participantRegistrationStatus?: ParticipantCompetitionRegistrationStatus
}


export type RegistrationCompetitorChangeType = 'ADICIONADO' | 'REMOVIDO'
export type RegistrationCompetitorChangeStatus = 'PENDENTE_REVISAO' | 'MANTIDA' | 'VETADA'

export interface RegistrationCompetitorChange {
  id: number
  registrationId: number
  competitionId: number
  robotId: number
  robotNome: string
  competitorId: number
  competitorNome: string
  changeType: RegistrationCompetitorChangeType
  status: RegistrationCompetitorChangeStatus
  actorUserId?: number
  actorUserNome?: string
  reviewedByUserId?: number
  reviewedByUserNome?: string
  reviewedAt?: string
  reason?: string
  dataCadastro?: string
}

export interface TeamLeadershipHistory {
  id: number
  teamId: number
  teamNome: string
  competitionId?: number
  competitionNome?: string
  previousUserId?: number
  previousUserNome?: string
  newUserId: number
  newUserNome: string
  changedByUserId: number
  changedByUserNome: string
  reason: string
  dataCadastro?: string
}
