import type {
  Category,
  Competition,
  CompetitionRegistrationWindowChange,
  RegistrationLot
} from '../../types/competition'
import { http } from '../http'

export const adminCompetitionApi = {
  competitions: (status?: string) =>
    http.get<Competition[]>(status ? '/api/v1/competicoes/por-status' : '/api/v1/competicoes', {
      params: status ? { status } : undefined
    }).then((r) => r.data),
  createCompetition: (payload: Competition) =>
    http.post<Competition>('/api/v1/competicoes', payload).then((r) => r.data),
  updateCompetition: (id: number, payload: Competition) =>
    http.put<Competition>(`/api/v1/competicoes/${id}`, payload).then((r) => r.data),
  updateCompetitionStatus: (id: number, status: string) =>
    http.patch<Competition>(`/api/v1/competicoes/${id}/status`, null, { params: { status } }).then((r) => r.data),
  currentCompetition: () =>
    http.get<Competition | undefined>('/api/v1/competicoes/vigente').then((r) => r.status === 204 ? undefined : r.data),
  setCurrentCompetition: (id: number) =>
    http.patch<Competition>(`/api/v1/competicoes/${id}/vigente`).then((r) => r.data),
  extendCompetitionRegistrationWindow: (id: number, payload: { novaDataFim: string; motivo: string }) =>
    http.post<CompetitionRegistrationWindowChange>(`/api/v1/competicoes/${id}/prorrogar-inscricoes`, payload).then((r) => r.data),
  competitionRegistrationWindowHistory: (id: number) =>
    http.get<CompetitionRegistrationWindowChange[]>(`/api/v1/competicoes/${id}/historico-inscricoes`).then((r) => r.data),
  competitionLots: (id: number) =>
    http.get<RegistrationLot[]>(`/api/v1/competicoes/${id}/lotes`).then((r) => r.data),
  createCompetitionLot: (id: number, payload: RegistrationLot) =>
    http.post<RegistrationLot>(`/api/v1/competicoes/${id}/lotes`, payload).then((r) => r.data),
  updateCompetitionLot: (id: number, lotId: number, payload: RegistrationLot) =>
    http.put<RegistrationLot>(`/api/v1/competicoes/${id}/lotes/${lotId}`, payload).then((r) => r.data),
  deleteCompetitionLot: (id: number, lotId: number) =>
    http.delete(`/api/v1/competicoes/${id}/lotes/${lotId}`),
  categories: (modalidade?: string) =>
    http.get<Category[]>(modalidade ? '/api/v1/categorias/por-modalidade' : '/api/v1/categorias', {
      params: modalidade ? { modalidade } : undefined
    }).then((r) => r.data)
}
