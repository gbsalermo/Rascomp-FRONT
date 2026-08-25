import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authApi } from './api'
import type { UserAccount } from './types'

const TOKEN_KEY = 'rascomp.token'
const USER_KEY = 'rascomp.user'

type PersistenceMode = 'local' | 'session'

function detectPersistenceMode(): PersistenceMode {
  if (localStorage.getItem(TOKEN_KEY)) return 'local'
  if (sessionStorage.getItem(TOKEN_KEY)) return 'session'
  return 'local'
}

function storageFor(mode: PersistenceMode) {
  return mode === 'local' ? localStorage : sessionStorage
}

function clearStoredSession() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(TOKEN_KEY)
    storage.removeItem(USER_KEY)
  }
}

export const useAuthStore = defineStore('auth', () => {
  const persistenceMode = ref<PersistenceMode>(detectPersistenceMode())
  const initialStorage = storageFor(persistenceMode.value)

  const token = ref(initialStorage.getItem(TOKEN_KEY) || '')
  const user = ref<UserAccount | null>(
    (() => {
      try {
        return JSON.parse(initialStorage.getItem(USER_KEY) || 'null')
      } catch {
        return null
      }
    })()
  )
  const loading = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value))
  const isOrganization = computed(() => user.value?.role === 'ORGANIZACAO')
  const isParticipant = computed(() => user.value?.role === 'PARTICIPANTE')

  function persist() {
    clearStoredSession()
    const storage = storageFor(persistenceMode.value)

    if (token.value) storage.setItem(TOKEN_KEY, token.value)
    if (user.value) storage.setItem(USER_KEY, JSON.stringify(user.value))
  }

  async function login(email: string, senha: string, remember = false) {
    loading.value = true
    try {
      const response = await authApi.login(email, senha)
      persistenceMode.value = remember ? 'local' : 'session'
      token.value = response.token
      user.value = response.usuario
      persist()
    } finally {
      loading.value = false
    }
  }

  async function hydrate() {
    if (!token.value) return
    try {
      user.value = await authApi.me()
      persist()
    } catch {
      logout()
      throw new Error('Sessão expirada')
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    clearStoredSession()
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    isOrganization,
    isParticipant,
    login,
    hydrate,
    logout
  }
})
