import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { adminApi, AUTH_UNAUTHORIZED_EVENT, authApi } from './api'
import type { AuthCapability, Competition, UserAccount } from './types'

const TOKEN_KEY = 'rascomp.token'
const USER_KEY = 'rascomp.user'
const COMPETITION_KEY = 'rascomp.competitionId'

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
  const hydrated = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value))
  const isDev = computed(() => user.value?.role === 'DEV')
  const isManagement = computed(() => user.value?.role === 'GESTAO')
  const isMedia = computed(() => user.value?.role === 'MIDIA')
  const isParticipant = computed(() => user.value?.role === 'PARTICIPANTE')
  const canOperateCompetition = computed(() => isDev.value || isManagement.value)
  const canManageUsers = computed(() => isDev.value)
  const canManageSystem = computed(() => isDev.value)
  const canManageMedia = computed(() => isDev.value || isMedia.value)

  function hasCapability(capability: AuthCapability) {
    switch (capability) {
      case 'operateCompetition':
        return canOperateCompetition.value
      case 'manageUsers':
        return canManageUsers.value
      case 'manageSystem':
        return canManageSystem.value
      case 'manageMedia':
        return canManageMedia.value
      case 'participant':
        return isParticipant.value
      default:
        return false
    }
  }

  function persist() {
    clearStoredSession()
    const storage = storageFor(persistenceMode.value)

    if (token.value) storage.setItem(TOKEN_KEY, token.value)
    if (user.value) storage.setItem(USER_KEY, JSON.stringify(user.value))
  }

  function clearSessionState() {
    token.value = ''
    user.value = null
    clearStoredSession()
  }

  function applyAuth(response: { token: string; usuario: UserAccount }, remember: boolean) {
    persistenceMode.value = remember ? 'local' : 'session'
    token.value = response.token
    user.value = response.usuario
    hydrated.value = true
    persist()
  }

  async function login(email: string, senha: string, remember = false) {
    loading.value = true
    try {
      const response = await authApi.login(email, senha, remember)
      applyAuth(response, remember)
    } finally {
      loading.value = false
    }
  }

  async function register(
    payload: { nome: string; email: string; senha: string; telefone?: string },
    remember = true
  ) {
    loading.value = true
    try {
      const response = await authApi.register(payload, remember)
      applyAuth(response, remember)
    } finally {
      loading.value = false
    }
  }

  async function hydrate(force = false) {
    if (hydrated.value && !force) return user.value

    if (!token.value) {
      user.value = null
      hydrated.value = true
      return null
    }

    try {
      user.value = await authApi.me()
      persist()
      return user.value
    } catch {
      clearSessionState()
      throw new Error('Sessão expirada')
    } finally {
      hydrated.value = true
    }
  }

  async function logout() {
    try {
      if (token.value) await authApi.logout()
    } catch {
      // Mesmo sem resposta do backend, o dispositivo atual deve encerrar a sessão local.
    } finally {
      clearSessionState()
      hydrated.value = true
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, () => {
      clearSessionState()
      hydrated.value = true
    })
  }

  return {
    token,
    user,
    loading,
    hydrated,
    isAuthenticated,
    isDev,
    isManagement,
    isMedia,
    isParticipant,
    canOperateCompetition,
    canManageUsers,
    canManageSystem,
    canManageMedia,
    hasCapability,
    login,
    register,
    hydrate,
    logout
  }
})

export const useCompetitionStore = defineStore('competition-context', () => {
  const auth = useAuthStore()
  const competitions = ref<Competition[]>([])
  const loading = ref(false)
  const selectedId = ref<number | null>(
    (() => {
      const stored = Number(localStorage.getItem(COMPETITION_KEY))
      return Number.isFinite(stored) && stored > 0 ? stored : null
    })()
  )

  const selectedCompetition = computed(() =>
    competitions.value.find((item) => item.id === selectedId.value)
  )

  function priorityCompetition(items: Competition[]) {
    return (
      items.find((item) => item.status === 'EM_ANDAMENTO') ||
      items.find((item) => item.status === 'INSCRICOES_ABERTAS') ||
      items.find((item) => item.status === 'INSCRICOES_ENCERRADAS') ||
      items.find((item) => item.status === 'PLANEJADA') ||
      items[0]
    )
  }

  function select(id?: number | null) {
    if (auth.isManagement) {
      const vigenteId = priorityCompetition(competitions.value)?.id || null
      selectedId.value = vigenteId
    } else {
      selectedId.value = id || null
    }

    if (selectedId.value) localStorage.setItem(COMPETITION_KEY, String(selectedId.value))
    else localStorage.removeItem(COMPETITION_KEY)
  }

  async function load(force = false) {
    if (competitions.value.length && !force) return competitions.value
    loading.value = true
    try {
      competitions.value = await adminApi.competitions()

      if (auth.isManagement) {
        select(priorityCompetition(competitions.value)?.id)
        return competitions.value
      }

      const selectedStillExists = competitions.value.some((item) => item.id === selectedId.value)
      if (!selectedStillExists) select(priorityCompetition(competitions.value)?.id)
      return competitions.value
    } finally {
      loading.value = false
    }
  }

  return {
    competitions,
    loading,
    selectedId,
    selectedCompetition,
    select,
    load
  }
})
