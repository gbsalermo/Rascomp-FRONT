import type {
  CancellationRequestStatus,
  Registration,
  RegistrationCancellationRequest
} from '../../types/registration'
import { http } from '../http'

export const adminRegistrationApi = {
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
