import type {
  Category,
  Competition,
  CompetitionRegistrationWindowChange
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
  categories: (modalidade?: string) =>
    http.get<Category[]>(modalidade ? '/api/v1/categorias/por-modalidade' : '/api/v1/categorias', {
      params: modalidade ? { modalidade } : undefined
    }).then((r) => r.data)
}
