import axios from 'axios'
import type {
  AuthResponse,
  Bracket,
  Category,
  Competition,
  Match,
  MatchResult,
  RankingItem,
  Registration,
  Team,
  Robot,
  Competitor,
  UserAccount
} from './types'

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')
const TOKEN_KEY = 'rascomp.token'
const USER_KEY = 'rascomp.user'

function storedToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

function clearStoredSession() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(TOKEN_KEY)
    storage.removeItem(USER_KEY)
  }
}

export const http = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

http.interceptors.request.use((config) => {
  const token = storedToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredSession()
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (email: string, senha: string) =>
    http.post<AuthResponse>('/api/v1/auth/login', { email, senha }).then((r) => r.data),
  register: (payload: { nome: string; email: string; senha: string; telefone?: string }) =>
    http.post<AuthResponse>('/api/v1/auth/register', payload).then((r) => r.data),
  me: () => http.get<UserAccount>('/api/v1/auth/me').then((r) => r.data)
}

export const adminApi = {
  competitions: (status?: string) =>
    http
      .get<Competition[]>(status ? '/api/v1/competicoes/por-status' : '/api/v1/competicoes', {
        params: status ? { status } : undefined
      })
      .then((r) => r.data),
  createCompetition: (payload: Competition) =>
    http.post<Competition>('/api/v1/competicoes', payload).then((r) => r.data),
  updateCompetition: (id: number, payload: Competition) =>
    http.put<Competition>(`/api/v1/competicoes/${id}`, payload).then((r) => r.data),
  categories: (modalidade?: string) =>
    http
      .get<Category[]>(modalidade ? '/api/v1/categorias/por-modalidade' : '/api/v1/categorias', {
        params: modalidade ? { modalidade } : undefined
      })
      .then((r) => r.data),
  registrations: (params?: { competitionId?: number; status?: string }) => {
    if (params?.competitionId) {
      return http
        .get<Registration[]>('/api/v1/inscricoes/por-competicao', {
          params: { competitionId: params.competitionId }
        })
        .then((r) => r.data)
    }
    if (params?.status) {
      return http
        .get<Registration[]>('/api/v1/inscricoes/por-status', { params: { status: params.status } })
        .then((r) => r.data)
    }
    return http.get<Registration[]>('/api/v1/inscricoes').then((r) => r.data)
  },
  updateRegistration: (id: number, payload: Registration) =>
    http.put<Registration>(`/api/v1/inscricoes/${id}`, payload).then((r) => r.data),
  teams: () => http.get<Team[]>('/api/v1/equipes').then((r) => r.data),
  robots: () => http.get<Robot[]>('/api/v1/robos').then((r) => r.data),
  competitors: () => http.get<Competitor[]>('/api/v1/competidores').then((r) => r.data),
  rankingFollow: (competitionId: number, categoryId: number) =>
    http
      .get<RankingItem[]>('/api/v1/ranking/seguidor-linha', {
        params: { competitionId, categoryId }
      })
      .then((r) => r.data),
  createFollowAttempt: (payload: Record<string, unknown>) =>
    http.post('/api/v1/tentativas-seguidor-linha', payload).then((r) => r.data),
  inspectSumo: (payload: Record<string, unknown>) =>
    http.post('/api/v1/inspecoes-sumo', payload).then((r) => r.data),
  brackets: (competitionId: number) =>
    http
      .get<Bracket[]>('/api/v1/chaveamentos/por-competicao', { params: { competitionId } })
      .then((r) => r.data),
  generateBracket: (competitionId: number, categoryId: number) =>
    http
      .post<Bracket>('/api/v1/chaveamentos/gerar', null, { params: { competitionId, categoryId } })
      .then((r) => r.data),
  matches: (bracketId: number) =>
    http
      .get<Match[]>('/api/v1/partidas/por-chaveamento', { params: { bracketId } })
      .then((r) => r.data),
  results: (bracketId: number) =>
    http
      .get<MatchResult[]>('/api/v1/resultados-partida/por-chaveamento', { params: { bracketId } })
      .then((r) => r.data),
  rounds: (matchId: number) =>
    http.get('/api/v1/rounds-sumo/por-partida', { params: { matchId } }).then((r) => r.data),
  createRound: (payload: Record<string, unknown>) =>
    http.post('/api/v1/rounds-sumo', payload).then((r) => r.data)
}

export const participantApi = {
  institutions: () =>
    http
      .get<Array<{ id: number; nome: string; sigla?: string }>>('/api/v1/public/instituicoes')
      .then((r) => r.data),
  teams: () => http.get<Team[]>('/api/v1/participante/equipes').then((r) => r.data),
  createTeam: (payload: { nome: string; institutionId: number }) =>
    http.post<Team>('/api/v1/participante/equipes', payload).then((r) => r.data),
  competitors: (teamId: number) =>
    http
      .get<Competitor[]>(`/api/v1/participante/equipes/${teamId}/competidores`)
      .then((r) => r.data),
  robots: (teamId: number) =>
    http.get<Robot[]>(`/api/v1/participante/equipes/${teamId}/robos`).then((r) => r.data),
  registrations: (teamId: number) =>
    http
      .get<Registration[]>(`/api/v1/participante/equipes/${teamId}/inscricoes`)
      .then((r) => r.data)
}
