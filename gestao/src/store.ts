import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authApi } from './api'
import type { UserAccount } from './types'

const TOKEN_KEY = 'rascomp.token'
const USER_KEY = 'rascomp.user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const user = ref<UserAccount | null>(
    (() => {
      try {
        return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
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
    if (token.value) localStorage.setItem(TOKEN_KEY, token.value)
    else localStorage.removeItem(TOKEN_KEY)
    if (user.value) localStorage.setItem(USER_KEY, JSON.stringify(user.value))
    else localStorage.removeItem(USER_KEY)
  }

  async function login(email: string, senha: string) {
    loading.value = true
    try {
      const response = await authApi.login(email, senha)
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
    persist()
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
