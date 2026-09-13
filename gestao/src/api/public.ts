import type {
  Bracket,
  Category,
  Competition,
  Match,
  MatchResult,
  RankingItem,
  RobotImage
} from '../types'
import { http } from './http'

export const publicApi = {
  competitions: () => http.get<Competition[]>('/api/v1/public/competicoes').then((r) => r.data),
  categories: (modalidade?: string) =>
    http.get<Category[]>('/api/v1/public/categorias', { params: modalidade ? { modalidade } : undefined }).then((r) => r.data),
  robotPhotos: (robotId: number) =>
    http.get<RobotImage[]>(`/api/v1/public/robos/${robotId}/fotos`).then((r) => r.data),
  rankingFollow: (competitionId: number, categoryId: number) =>
    http.get<RankingItem[]>('/api/v1/public/ranking/seguidor-linha', { params: { competitionId, categoryId } }).then((r) => r.data),
  brackets: (competitionId: number) =>
    http.get<Bracket[]>('/api/v1/public/chaveamentos', { params: { competitionId } }).then((r) => r.data),
  matches: (bracketId: number) =>
    http.get<Match[]>('/api/v1/public/partidas', { params: { bracketId } }).then((r) => r.data),
  results: (bracketId: number) =>
    http.get<MatchResult[]>('/api/v1/public/resultados', { params: { bracketId } }).then((r) => r.data)
}
