import type {
  CancellationRequestStatus,
  Category,
  Competition,
  CompetitionRegistrationWindowChange,
  Registration,
  RegistrationCancellationRequest,
  RobotImage,
  Team,
  Robot,
  Competitor,
  UserAccount,
  UserRole
} from './types'

import { http } from './api/http'
import { adminFollowApi } from './api/admin/follow'
import { adminSumoApi } from './api/admin/sumo'

export { API_URL, assetUrl, AUTH_UNAUTHORIZED_EVENT, http } from './api/http'
export { authApi } from './api/auth'

export { publicApi } from './api/public'
export { participantApi } from './api/participant'

export const adminApi = {
  competitions: (status?: string) =>
    http.get<Competition[]>(status ? '/api/v1/competicoes/por-status' : '/api/v1/competicoes', {
      params: status ? { status } : undefined
    }).then((r) => r.data),
  createCompetition: (payload: Competition) => http.post<Competition>('/api/v1/competicoes', payload).then((r) => r.data),
  updateCompetition: (id: number, payload: Competition) => http.put<Competition>(`/api/v1/competicoes/${id}`, payload).then((r) => r.data),
  extendCompetitionRegistrationWindow: (id: number, payload: { novaDataFim: string; motivo: string }) =>
    http.post<CompetitionRegistrationWindowChange>(`/api/v1/competicoes/${id}/prorrogar-inscricoes`, payload).then((r) => r.data),
  competitionRegistrationWindowHistory: (id: number) =>
    http.get<CompetitionRegistrationWindowChange[]>(`/api/v1/competicoes/${id}/historico-inscricoes`).then((r) => r.data),
  categories: (modalidade?: string) =>
    http.get<Category[]>(modalidade ? '/api/v1/categorias/por-modalidade' : '/api/v1/categorias', {
      params: modalidade ? { modalidade } : undefined
    }).then((r) => r.data),
  registrations: (params?: { competitionId?: number; status?: string }) => {
    if (params?.competitionId) return http.get<Registration[]>('/api/v1/inscricoes/por-competicao', { params: { competitionId: params.competitionId } }).then((r) => r.data)
    if (params?.status) return http.get<Registration[]>('/api/v1/inscricoes/por-status', { params: { status: params.status } }).then((r) => r.data)
    return http.get<Registration[]>('/api/v1/inscricoes').then((r) => r.data)
  },
  updateRegistration: (id: number, payload: Registration) => http.put<Registration>(`/api/v1/inscricoes/${id}`, payload).then((r) => r.data),
  cancellationRequests: (params?: { competitionId?: number; status?: CancellationRequestStatus }) =>
    http.get<RegistrationCancellationRequest[]>('/api/v1/solicitacoes-cancelamento-inscricao', { params }).then((r) => r.data),
  approveCancellationRequest: (id: number, resposta?: string) =>
    http.patch<RegistrationCancellationRequest>(`/api/v1/solicitacoes-cancelamento-inscricao/${id}/aprovar`, resposta ? { resposta } : {}).then((r) => r.data),
  rejectCancellationRequest: (id: number, resposta?: string) =>
    http.patch<RegistrationCancellationRequest>(`/api/v1/solicitacoes-cancelamento-inscricao/${id}/rejeitar`, resposta ? { resposta } : {}).then((r) => r.data),
  teams: () => http.get<Team[]>('/api/v1/equipes').then((r) => r.data),
  setTeamActive: (id: number, ativo: boolean) =>
    ativo
      ? http.patch<Team>(`/api/v1/equipes/${id}/reativar`).then((r) => r.data)
      : http.delete(`/api/v1/equipes/${id}`).then(() => undefined),
  robots: () => http.get<Robot[]>('/api/v1/robos').then((r) => r.data),
  setRobotActive: (id: number, ativo: boolean) =>
    ativo
      ? http.patch<Robot>(`/api/v1/robos/${id}/reativar`).then((r) => r.data)
      : http.delete(`/api/v1/robos/${id}`).then(() => undefined),
  users: (role: UserRole) =>
    http.get<UserAccount[]>('/api/v1/usuarios', { params: { role } }).then((r) => r.data),
  setUserActive: (id: number, ativo: boolean) =>
    http.patch<UserAccount>(`/api/v1/usuarios/${id}/ativo`, null, { params: { ativo } }).then((r) => r.data),
  robotPhotos: (robotId: number) => http.get<RobotImage[]>(`/api/v1/robos/${robotId}/fotos`).then((r) => r.data),
  competitors: () => http.get<Competitor[]>('/api/v1/competidores').then((r) => r.data),
  ...adminFollowApi,
  ...adminSumoApi
}
