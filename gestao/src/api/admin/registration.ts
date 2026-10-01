import type {
  CancellationRequestStatus,
  ManualCompetitionEntryRequest,
  ParticipantCompetitionRegistration,
  ParticipantCompetitionRegistrationStatus,
  Registration,
  RegistrationCompetitorContext,
  RegistrationCancellationRequest,
  RegistrationStatusHistory
} from '../../types/registration'
import { http } from '../http'

export const adminRegistrationApi = {
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
