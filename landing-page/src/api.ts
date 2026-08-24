import axios from 'axios'

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')
const publicApi = axios.create({ baseURL: `${API_URL}/api/v1/public`, timeout: 15000 })

export const api = {
  competitions: () => publicApi.get('/competicoes').then((r) => r.data),
  categories: (modalidade?: string) =>
    publicApi.get('/categorias', { params: modalidade ? { modalidade } : undefined }).then((r) => r.data),
  teams: () => publicApi.get('/equipes').then((r) => r.data),
  robots: () => publicApi.get('/robos').then((r) => r.data),
  registrations: (competitionId: number) =>
    publicApi.get('/inscricoes', { params: { competitionId } }).then((r) => r.data),
  ranking: (competitionId: number, categoryId: number) =>
    publicApi
      .get('/ranking/seguidor-linha', { params: { competitionId, categoryId } })
      .then((r) => r.data),
  brackets: (competitionId: number) =>
    publicApi.get('/chaveamentos', { params: { competitionId } }).then((r) => r.data),
  matches: (bracketId: number) =>
    publicApi.get('/partidas', { params: { bracketId } }).then((r) => r.data),
  results: (bracketId: number) =>
    publicApi.get('/resultados', { params: { bracketId } }).then((r) => r.data)
}

export function assetUrl(path?: string) {
  if (!path) return ''
  if (/^https?:\/\//.test(path)) return path
  return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`
}
