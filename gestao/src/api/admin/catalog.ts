import type { InternalUserCreatePayload, InternalUserRole, UserAccount, UserRole } from '../../types/auth'
import type { CompetitionAdminCatalog, Competitor, Robot, RobotImage, Team } from '../../types/catalog'
import { http } from '../http'

export const adminCatalogApi = {
  competitionAdminCatalog: (competitionId: number) =>
    http.get<CompetitionAdminCatalog>(`/api/v1/competicoes/${competitionId}/catalogo-administrativo`).then((r) => r.data),
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
  createInternalUser: (payload: InternalUserCreatePayload, role: InternalUserRole) =>
    http.post<UserAccount>('/api/v1/usuarios/internos', payload, { params: { role } }).then((r) => r.data),
  updateUser: (id: number, payload: { nome: string; email: string; telefone?: string }) =>
    http.put<UserAccount>(`/api/v1/usuarios/${id}`, payload).then((r) => r.data),
  setUserActive: (id: number, ativo: boolean) =>
    http.patch<UserAccount>(`/api/v1/usuarios/${id}/ativo`, null, { params: { ativo } }).then((r) => r.data),
  setUserRole: (id: number, role: InternalUserRole) =>
    http.patch<UserAccount>(`/api/v1/usuarios/${id}/role`, null, { params: { role } }).then((r) => r.data),
  robotPhotos: (robotId: number) =>
    http.get<RobotImage[]>(`/api/v1/robos/${robotId}/fotos`).then((r) => r.data),
  competitors: () => http.get<Competitor[]>('/api/v1/competidores').then((r) => r.data),
  setCompetitorActive: (id: number, ativo: boolean) =>
    ativo
      ? http.patch<Competitor>(`/api/v1/competidores/${id}/reativar`).then((r) => r.data)
      : http.delete(`/api/v1/competidores/${id}`).then(() => undefined)
}
