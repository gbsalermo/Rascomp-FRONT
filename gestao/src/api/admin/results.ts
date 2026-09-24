import type { CompetitionCategoryResult } from '../../types/results'
import { http } from '../http'

export const adminResultsApi = {
  competitionResults: (competitionId: number) =>
    http.get<CompetitionCategoryResult[]>('/api/v1/resultados-competicao', {
      params: { competitionId }
    }).then((r) => r.data)
}
