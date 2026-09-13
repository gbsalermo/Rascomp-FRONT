import axios from 'axios'

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')
export const assetUrl = (path?: string) => path ? `${API_URL}${path.startsWith('/') ? path : `/${path}`}` : ''

const TOKEN_KEY = 'rascomp.token'
const USER_KEY = 'rascomp.user'

export const AUTH_UNAUTHORIZED_EVENT = 'rascomp:unauthorized'

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
    const requestUrl = String(error.config?.url || '')
    const credentialRequest = requestUrl.includes('/api/v1/auth/login') || requestUrl.includes('/api/v1/auth/register')
    if (error.response?.status === 401 && !credentialRequest) {
      clearStoredSession()
      if (typeof window !== 'undefined') window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
    }
    return Promise.reject(error)
  }
)
