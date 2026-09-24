import type { CompetitionCategoryResult } from '../../types/results'
import { http } from '../http'

export const adminResultsApi = {
  competitionResults: (competitionId: number) =>
    http.get<CompetitionCategoryResult[]>('/api/v1/resultados-competicao', {
      params: { competitionId }
    }).then((r) => r.data),
  defineFollowManualResult: (payload: {
    competitionId: number
    categoryId: number
    winnerRegistrationId: number
    justificativa: string
  }) =>
    http.post('/api/v1/resultados-competicao/follow/decisao-organizacao', payload).then((r) => r.data)
}
