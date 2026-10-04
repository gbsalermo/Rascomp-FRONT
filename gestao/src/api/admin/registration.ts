import type {
  CancellationRequestStatus,
  ManualCompetitionEntryRequest,
  ManualParticipantEntryRequest,
  ParticipantCompetitionRegistration,
  ParticipantCompetitionRegistrationStatus,
  Registration,
  RegistrationCompetitorContext,
  RegistrationCompetitorChange,
  RegistrationCompetitorChangeStatus,
  TeamLeadershipHistory,
  RegistrationCancellationRequest,
  RegistrationStatusHistory
} from '../../types/registration'
import type { Competitor } from '../../types/catalog'
import { http } from '../http'

export const adminRegistrationApi = {
  compositionChanges: (competitionId: number) =>
    http.get<RegistrationCompetitorChange[]>('/api/v1/inscricoes/composicao/pendentes', {
      params: { competitionId }
    }).then((r) => r.data),
  registrationCompositionChanges: (registrationId: number) =>
    http.get<RegistrationCompetitorChange[]>(`/api/v1/inscricoes/composicao/por-inscricao/${registrationId}`).then((r) => r.data),
  reviewCompositionChange: (
    id: number,
    status: RegistrationCompetitorChangeStatus,
    motivo?: string
  ) => http.patch<RegistrationCompetitorChange>(
    `/api/v1/inscricoes/composicao/${id}`,
    { status, motivo }
  ).then((r) => r.data),
  teamLeaderCandidates: (teamId: number, competitionId: number) =>
    http.get<Competitor[]>(`/api/v1/equipes/${teamId}/lideranca/candidatos`, {
      params: { competitionId }
    }).then((r) => r.data),
  transferTeamLeader: (
    teamId: number,
    payload: { competitionId: number; newResponsibleUserId: number; motivo: string }
  ) => http.patch<TeamLeadershipHistory>(
    `/api/v1/equipes/${teamId}/lideranca`,
    payload
  ).then((r) => r.data),
  teamLeadershipHistory: (teamId: number) =>
    http.get<TeamLeadershipHistory[]>(`/api/v1/equipes/${teamId}/lideranca/historico`).then((r) => r.data),
  participantRegistrations: (competitionId: number) =>
    http.get<ParticipantCompetitionRegistration[]>('/api/v1/inscricoes-participantes/por-competicao', {
      params: { competitionId }
    }).then((r) => r.data),
  reviewParticipantRegistration: (
    id: number,
    status: ParticipantCompetitionRegistrationStatus,
    motivo?: string
  ) => http.patch<ParticipantCompetitionRegistration>(
    `/api/v1/inscricoes-participantes/${id}/revisao`,
    { status, motivo }
  ).then((r) => r.data),
  participantRegistrationReceipt: (id: number) =>
    http.get<Blob>(`/api/v1/inscricoes-participantes/${id}/comprovante`, { responseType: 'blob' }).then((r) => r.data),
  registrationCompetitorContext: (id: number) =>
    http.get<RegistrationCompetitorContext[]>(`/api/v1/inscricoes/${id}/contexto-competidores`).then((r) => r.data),
  robotRegistrationReceipt: (id: number) =>
    http.get<Blob>(`/api/v1/inscricoes/${id}/comprovante`, { responseType: 'blob' }).then((r) => r.data),
  manualParticipantEntry: (payload: ManualParticipantEntryRequest) =>
    http.post<ParticipantCompetitionRegistration>(
      '/api/v1/inscricoes-participantes/entrada-manual',
      payload
    ).then((r) => r.data),
  manualCompetitionEntry: (payload: ManualCompetitionEntryRequest) =>
    http.post<Registration>('/api/v1/inscricoes/entrada-manual', payload).then((r) => r.data),
  registrations: (params?: { competitionId?: number; status?: string }) => {
    if (params?.competitionId) {
      return http.get<Registration[]>('/api/v1/inscricoes/por-competicao', {
        params: { competitionId: params.competitionId }
      }).then((r) => r.data)
    }
    if (params?.status) {
      return http.get<Registration[]>('/api/v1/inscricoes/por-status', {
        params: { status: params.status }
      }).then((r) => r.data)
    }
    return http.get<Registration[]>('/api/v1/inscricoes').then((r) => r.data)
  },
  updateRegistration: (id: number, payload: Registration) =>
    http.put<Registration>(`/api/v1/inscricoes/${id}`, payload).then((r) => r.data),
  cancelRegistration: (id: number) =>
    http.delete(`/api/v1/inscricoes/${id}`).then(() => undefined),
  reactivateRegistration: (id: number) =>
    http.patch<Registration>(`/api/v1/inscricoes/${id}/reativar`).then((r) => r.data),
  disqualifyRegistration: (id: number, motivo: string) =>
    http.patch<Registration>(`/api/v1/inscricoes/${id}/desclassificar`, { motivo }).then((r) => r.data),
  registrationStatusHistory: (id: number) =>
    http.get<RegistrationStatusHistory[]>(`/api/v1/inscricoes/${id}/historico-status`).then((r) => r.data),
  cancellationRequests: (params?: { competitionId?: number; status?: CancellationRequestStatus }) =>
    http.get<RegistrationCancellationRequest[]>('/api/v1/solicitacoes-cancelamento-inscricao', { params }).then((r) => r.data),
  approveCancellationRequest: (id: number, resposta?: string) =>
    http.patch<RegistrationCancellationRequest>(
      `/api/v1/solicitacoes-cancelamento-inscricao/${id}/aprovar`,
      resposta ? { resposta } : {}
    ).then((r) => r.data),
  rejectCancellationRequest: (id: number, resposta?: string) =>
    http.patch<RegistrationCancellationRequest>(
      `/api/v1/solicitacoes-cancelamento-inscricao/${id}/rejeitar`,
      resposta ? { resposta } : {}
    ).then((r) => r.data)
}
