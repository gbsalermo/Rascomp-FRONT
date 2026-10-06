import type {
  AccountActionResponse,
  AuthResponse,
  RegisterResponse,
  UserAccount
} from '../types/auth'
import { http } from './http'

export const authApi = {
  login: (email: string, senha: string, lembrarDeMim = false) =>
    http.post<AuthResponse>('/api/v1/auth/login', { email, senha, lembrarDeMim }).then((r) => r.data),

  register: (payload: { nome: string; email: string; senha: string; telefone?: string }) =>
    http.post<RegisterResponse>('/api/v1/auth/register', payload).then((r) => r.data),

  resendVerification: (email: string) =>
    http
      .post<AccountActionResponse>('/api/v1/auth/email-verification/resend', { email })
      .then((r) => r.data),

  confirmEmail: (token: string) =>
    http
      .post<AccountActionResponse>('/api/v1/auth/email-verification/confirm', { token })
      .then((r) => r.data),

  forgotPassword: (email: string) =>
    http
      .post<AccountActionResponse>('/api/v1/auth/password/forgot', { email })
      .then((r) => r.data),

  activateInternalAccount: (token: string, novaSenha: string) =>
    http
      .post<AccountActionResponse>('/api/v1/auth/internal-account/activate', { token, novaSenha })
      .then((r) => r.data),

  resetPassword: (token: string, novaSenha: string) =>
    http
      .post<AccountActionResponse>('/api/v1/auth/password/reset', { token, novaSenha })
      .then((r) => r.data),

  me: () => http.get<UserAccount>('/api/v1/auth/me').then((r) => r.data),
  logout: () => http.post<void>('/api/v1/auth/logout')
}
