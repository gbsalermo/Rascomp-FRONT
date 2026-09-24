import type { ConfigSumo } from '../../types/competition'
import type {
  Bracket,
  CompetitionJudge,
  Match,
  MatchCallStatus,
  MatchJudgeDecision,
  MatchResult,
  RoundSumo,
  RoundSumoOutcomeReason,
  RoundSumoStatus,
  SumoInspection
} from '../../types/sumo'
import { http } from '../http'

export const adminSumoApi = {
  inspectSumo: (payload: { registrationId: number; aprovada: boolean; pesoMedido?: number; observacao?: string }) =>
    http.post<SumoInspection>('/api/v1/inspecoes-sumo', payload).then((r) => r.data),
  sumoInspections: (registrationId: number) =>
    http.get<SumoInspection[]>('/api/v1/inspecoes-sumo/por-inscricao', { params: { registrationId } }).then((r) => r.data),
  sumoInspectionsByContext: (competitionId: number, categoryId: number) =>
    http.get<SumoInspection[]>('/api/v1/inspecoes-sumo/por-contexto', { params: { competitionId, categoryId } }).then((r) => r.data),
  sumoAptitude: (registrationId: number) =>
    http.get<boolean>('/api/v1/inspecoes-sumo/aptidao', { params: { registrationId } }).then((r) => r.data),
  sumoConfig: (categoryId: number) =>
    http.get<ConfigSumo>(`/api/v1/categorias/${categoryId}/config-sumo`).then((r) => r.data),
  judges: (competitionId: number, apenasAtivos = true) =>
    http.get<CompetitionJudge[]>('/api/v1/juizes-competicao', { params: { competitionId, apenasAtivos } }).then((r) => r.data),
  createJudge: (payload: { competitionId: number; nome: string; userAccountId?: number }) =>
    http.post<CompetitionJudge>('/api/v1/juizes-competicao', payload).then((r) => r.data),
  updateJudge: (id: number, payload: { competitionId: number; nome: string; userAccountId?: number }) =>
    http.put<CompetitionJudge>(`/api/v1/juizes-competicao/${id}`, payload).then((r) => r.data),
  deactivateJudge: (id: number) => http.delete(`/api/v1/juizes-competicao/${id}`).then(() => undefined),
  brackets: (competitionId: number) =>
    http.get<Bracket[]>('/api/v1/chaveamentos/por-competicao', { params: { competitionId } }).then((r) => r.data),
  generateBracket: (competitionId: number, categoryId: number) =>
    http.post<Bracket>('/api/v1/chaveamentos/gerar', null, { params: { competitionId, categoryId } }).then((r) => r.data),
  match: (matchId: number) => http.get<Match>(`/api/v1/partidas/${matchId}`).then((r) => r.data),
  matches: (bracketId: number) =>
    http.get<Match[]>('/api/v1/partidas/por-chaveamento', { params: { bracketId } }).then((r) => r.data),
  updateMatchAgenda: (
    matchId: number,
    payload: { dataHora?: string | null; pista?: string | null; ordemExecucao?: number | null; statusConvocacao: MatchCallStatus }
  ) =>
    http.patch<Match>(`/api/v1/partidas/${matchId}/agenda`, payload).then((r) => r.data),
  results: (bracketId: number) =>
    http.get<MatchResult[]>('/api/v1/resultados-partida/por-chaveamento', { params: { bracketId } }).then((r) => r.data),
  resolveUnavailableMatch: (matchId: number) =>
    http.post<MatchResult>('/api/v1/resultados-partida/resolver-indisponibilidade', null, { params: { matchId } }).then((r) => r.data),
  rounds: (matchId: number) =>
    http.get<RoundSumo[]>('/api/v1/rounds-sumo/por-partida', { params: { matchId } }).then((r) => r.data),
  createRound: (payload: {
    matchId: number
    winnerRegistrationId?: number
    status: RoundSumoStatus
    motivoResultado?: RoundSumoOutcomeReason
    penalidadesA?: number
    penalidadesB?: number
    observacao?: string
    justificativa?: string
  }) => http.post<RoundSumo>('/api/v1/rounds-sumo', payload).then((r) => r.data),
  registerSumoBattle: (payload: {
    matchId: number
    rounds: Array<{
      winnerRegistrationId?: number
      status: RoundSumoStatus
      motivoResultado?: RoundSumoOutcomeReason
      penalidadesA?: number
      penalidadesB?: number
      observacao?: string
      justificativa?: string
    }>
  }) => http.post<RoundSumo[]>('/api/v1/rounds-sumo/batalha', payload).then((r) => r.data),
  judgeDecision: (matchId: number) =>
    http.get<MatchJudgeDecision>('/api/v1/decisoes-juiz-sumo/por-partida', { params: { matchId } }).then((r) => r.data),
  decideSumoMatch: (payload: { matchId: number; winnerRegistrationId: number; judgeId: number; justificativa: string }) =>
    http.post<MatchJudgeDecision>('/api/v1/decisoes-juiz-sumo', payload).then((r) => r.data)
}
