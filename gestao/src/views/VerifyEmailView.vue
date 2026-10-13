<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authApi } from '../api'

const route = useRoute()
const currentYear = new Date().getFullYear()
const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const message = ref('')
const resending = ref(false)

async function confirm() {
  if (!token.value) return

  state.value = 'loading'
  try {
    const response = await authApi.confirmEmail(token.value)
    message.value = response.message
    state.value = 'success'
  } catch (error: any) {
    message.value =
      error?.response?.data?.message ||
      'O link é inválido, expirou ou já foi utilizado. Solicite um novo link.'
    state.value = 'error'
  }
}

async function resend() {
  const normalized = email.value.trim().toLowerCase()
  if (!normalized) {
    ElMessage.warning('Informe o e-mail da conta.')
    return
  }

  resending.value = true
  try {
    const response = await authApi.resendVerification(normalized)
    message.value = response.message
    state.value = 'idle'
    ElMessage.success('Solicitação processada.')
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível solicitar um novo link.')
  } finally {
    resending.value = false
  }
}

onMounted(confirm)
</script>

<template>
  <div class="login-page">
    <div class="login-shell auth-shell-compact">
      <section class="login-brand-panel" aria-label="Identidade RASCOMP">
        <div class="login-brand-content">
          <svg class="login-robot-icon" viewBox="0 0 96 96" aria-hidden="true">
            <path d="M48 15v10" />
            <circle cx="48" cy="11" r="4" />
            <rect x="22" y="28" width="52" height="45" rx="14" />
            <path d="M22 43H12v17h10M74 43h10v17H74" />
            <circle cx="38" cy="49" r="4" />
            <circle cx="58" cy="49" r="4" />
            <path d="M37 61c3 4 7 6 11 6s8-2 11-6" />
          </svg>
          <strong class="login-brand-name">RasComp</strong>
          <span class="login-brand-subtitle">Confirmação de identidade</span>
          <span class="login-brand-event">RAS UFRB · RRC</span>
        </div>
      </section>

      <section class="login-form-panel">
        <div class="login-card">
          <header class="login-form-heading">
            <h1>Verificar e-mail</h1>
            <p v-if="state === 'loading'">Validando seu link de confirmação...</p>
            <p v-else-if="state === 'success'">Sua conta está pronta para acesso.</p>
            <p v-else>Confirme que você controla o endereço usado no cadastro.</p>
          </header>

          <div v-if="state === 'loading'" class="auth-status-card">
            <strong>Verificando...</strong>
            <span>A confirmação leva apenas alguns instantes.</span>
          </div>

          <div v-else-if="state === 'success'" class="auth-status-card auth-status-success">
            <strong>E-mail confirmado</strong>
            <span>{{ message }}</span>
          </div>

          <template v-else>
            <div class="auth-pending-note">
              <strong>{{ state === 'error' ? 'Não foi possível usar este link' : 'Confira sua caixa de entrada' }}</strong>
              <span>
                {{ message || 'Enviamos um link de uso único para o e-mail informado. O acesso permanece bloqueado até a confirmação.' }}
              </span>
            </div>

            <div class="login-field">
              <label for="verify-email">E-mail da conta</label>
              <el-input
                id="verify-email"
                v-model="email"
                size="large"
                type="email"
                autocomplete="email"
                placeholder="voce@exemplo.com"
              />
            </div>

            <el-button
              class="login-submit"
              size="large"
              :loading="resending"
              @click="resend"
            >
              Reenviar link de confirmação
            </el-button>
          </template>

          <div class="auth-secondary-action">
            <router-link to="/login">
              {{ state === 'success' ? 'Entrar no RasComp' : '← Voltar para o login' }}
            </router-link>
          </div>

          <p class="login-copyright">© {{ currentYear }} RAS UFRB - Todos os direitos reservados</p>
        </div>
      </section>
    </div>
  </div>
</template>
