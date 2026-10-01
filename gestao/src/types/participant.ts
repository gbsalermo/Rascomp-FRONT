export type TeamMembershipRequestType = 'CONVITE' | 'SOLICITACAO'
export type TeamMembershipStatus = 'PENDENTE' | 'ACEITA' | 'REJEITADA' | 'CANCELADA'

export interface TeamMembershipRequest {
  id: number
  teamId: number
  teamNome: string
  institutionNome?: string
  institutionSigla?: string

  participantUserId: number
  participantNome: string
  participantEmail: string

  requestedByUserId: number
  requestedByNome: string

  requestType: TeamMembershipRequestType
  status: TeamMembershipStatus
  mensagem?: string

  reviewedByUserId?: number
  reviewedByNome?: string
  reviewedAt?: string
  dataCadastro?: string
}
