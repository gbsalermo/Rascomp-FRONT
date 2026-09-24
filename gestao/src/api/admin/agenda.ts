import type {
  AgendaActivity,
  FollowCallStatus,
  FollowTakeSchedule,
  FollowTakeScheduleEntry
} from '../../types/agenda'
import { http } from '../http'

export const adminAgendaApi = {
  agenda: (competitionId: number) =>
    http.get<AgendaActivity[]>('/api/v1/agenda/competicao', { params: { competitionId } }).then((r) => r.data),

  followSchedules: (competitionId: number) =>
    http.get<FollowTakeSchedule[]>('/api/v1/agenda-follow/por-competicao', {
      params: { competitionId }
    }).then((r) => r.data),

  followSchedulesByCategory: (competitionId: number, categoryId: number) =>
    http.get<FollowTakeSchedule[]>('/api/v1/agenda-follow/por-categoria', {
      params: { competitionId, categoryId }
    }).then((r) => r.data),

  createFollowSchedule: (payload: Omit<FollowTakeSchedule, 'id'>) =>
    http.post<FollowTakeSchedule>('/api/v1/agenda-follow', payload).then((r) => r.data),

  updateFollowSchedule: (id: number, payload: FollowTakeSchedule) =>
    http.put<FollowTakeSchedule>(`/api/v1/agenda-follow/${id}`, payload).then((r) => r.data),

  followScheduleQueue: (scheduleId: number) =>
    http.get<FollowTakeScheduleEntry[]>(`/api/v1/agenda-follow/${scheduleId}/fila`).then((r) => r.data),

  syncFollowScheduleQueue: (scheduleId: number) =>
    http.post<FollowTakeScheduleEntry[]>(`/api/v1/agenda-follow/${scheduleId}/sincronizar-fila`).then((r) => r.data),

  updateFollowCall: (
    entryId: number,
    payload: { ordemConvocacao: number; status: FollowCallStatus }
  ) =>
    http.patch<FollowTakeScheduleEntry>(`/api/v1/agenda-follow/fila/${entryId}`, payload).then((r) => r.data)
}
