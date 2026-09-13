import type {
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
import { adminCompetitionApi } from './api/admin/competition'
import { adminRegistrationApi } from './api/admin/registration'

export { API_URL, assetUrl, AUTH_UNAUTHORIZED_EVENT, http } from './api/http'
export { authApi } from './api/auth'

export { publicApi } from './api/public'
export { participantApi } from './api/participant'

export const adminApi = {
  ...adminCompetitionApi,
  ...adminRegistrationApi,
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
