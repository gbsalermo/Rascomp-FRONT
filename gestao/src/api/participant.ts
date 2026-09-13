import type {
  Competitor,
  ConfigFollow,
  FollowAttempt,
  Registration,
  RegistrationCancellationRequest,
  Robot,
  RobotImage,
  Team
} from '../types'
import { http } from './http'

export const participantApi = {
  institutions: () => http.get<Array<{ id: number; nome: string; sigla?: string }>>('/api/v1/public/instituicoes').then((r) => r.data),
  teams: () => http.get<Team[]>('/api/v1/participante/equipes').then((r) => r.data),
  createTeam: (payload: { nome: string; institutionId: number }) => http.post<Team>('/api/v1/participante/equipes', payload).then((r) => r.data),
  competitors: (teamId: number) => http.get<Competitor[]>(`/api/v1/participante/equipes/${teamId}/competidores`).then((r) => r.data),
  robots: (teamId: number) => http.get<Robot[]>(`/api/v1/participante/equipes/${teamId}/robos`).then((r) => r.data),
  robotPhotos: (robotId: number) => http.get<RobotImage[]>(`/api/v1/participante/robos/${robotId}/fotos`).then((r) => r.data),
  uploadRobotPhoto: (robotId: number, file: File) => {
    const form = new FormData()
    form.append('arquivo', file)
    return http.post<RobotImage>(`/api/v1/participante/robos/${robotId}/fotos`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((r) => r.data)
  },
  setPrincipalRobotPhoto: (robotId: number, imageId: number) =>
    http.patch<RobotImage>(`/api/v1/participante/robos/${robotId}/fotos/${imageId}/principal`).then((r) => r.data),
  deleteRobotPhoto: (robotId: number, imageId: number) => http.delete(`/api/v1/participante/robos/${robotId}/fotos/${imageId}`),
  registrations: (teamId: number) => http.get<Registration[]>(`/api/v1/participante/equipes/${teamId}/inscricoes`).then((r) => r.data),
  cancelRegistration: (registrationId: number) => http.delete(`/api/v1/participante/inscricoes/${registrationId}`),
  reactivateRegistration: (registrationId: number) =>
    http.patch<Registration>(`/api/v1/participante/inscricoes/${registrationId}/reativar`).then((r) => r.data),
  requestRegistrationCancellation: (registrationId: number, motivo: string) =>
    http.post<RegistrationCancellationRequest>(`/api/v1/participante/inscricoes/${registrationId}/solicitacoes-cancelamento`, { motivo }).then((r) => r.data),
  registrationCancellationRequests: (registrationId: number) =>
    http.get<RegistrationCancellationRequest[]>(`/api/v1/participante/inscricoes/${registrationId}/solicitacoes-cancelamento`).then((r) => r.data),
  followAttempts: (registrationId: number) =>
    http.get<FollowAttempt[]>(`/api/v1/participante/inscricoes/${registrationId}/tentativas-follow`).then((r) => r.data),
  followConfig: (registrationId: number) =>
    http.get<ConfigFollow>(`/api/v1/participante/inscricoes/${registrationId}/config-follow`).then((r) => r.data)
}
