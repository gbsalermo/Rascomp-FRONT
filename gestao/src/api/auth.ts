import type { AuthResponse, UserAccount } from '../types/auth'
import { http } from './http'

export const authApi = {
  login: (email: string, senha: string, lembrarDeMim = false) =>
    http.post<AuthResponse>('/api/v1/auth/login', { email, senha, lembrarDeMim }).then((r) => r.data),
  register: (payload: { nome: string; email: string; senha: string; telefone?: string }, lembrarDeMim = false) =>
    http.post<AuthResponse>('/api/v1/auth/register', { ...payload, lembrarDeMim }).then((r) => r.data),
  me: () => http.get<UserAccount>('/api/v1/auth/me').then((r) => r.data),
  logout: () => http.post<void>('/api/v1/auth/logout')
}
