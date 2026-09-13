import type { ConfigFollow } from '../../types/competition'
import type { FollowAttempt, FollowTakeAbsence, RankingItem } from '../../types/follow'
import { http } from '../http'

export const adminFollowApi = {
  rankingFollow: (competitionId: number, categoryId: number) =>
    http.get<RankingItem[]>('/api/v1/ranking/seguidor-linha', { params: { competitionId, categoryId } }).then((r) => r.data),
  followConfig: (categoryId: number) =>
    http.get<ConfigFollow>(`/api/v1/categorias/${categoryId}/config-follow`).then((r) => r.data),
  followAttempts: (competitionId: number, categoryId: number) =>
    http.get<FollowAttempt[]>('/api/v1/tentativas-seguidor-linha/por-contexto', { params: { competitionId, categoryId } }).then((r) => r.data),
  createFollowAttempt: (payload: Omit<FollowAttempt, 'id' | 'competitionId' | 'categoryId' | 'teamNome' | 'robotNome' | 'tempoFinalSegundos' | 'dataCadastro'>) =>
    http.post<FollowAttempt>('/api/v1/tentativas-seguidor-linha', payload).then((r) => r.data),
  followTakeAbsences: (competitionId: number, categoryId: number) =>
    http.get<FollowTakeAbsence[]>('/api/v1/ausencias-tomada-seguidor-linha/por-contexto', { params: { competitionId, categoryId } }).then((r) => r.data),
  markFollowTakeAbsence: (payload: { registrationId: number; tomada: number; observacao?: string }) =>
    http.post<FollowTakeAbsence>('/api/v1/ausencias-tomada-seguidor-linha', payload).then((r) => r.data)
}
