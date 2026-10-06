<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { authApi } from '../api'

const currentYear = new Date().getFullYear()
const email = ref('')
const loading = ref(false)
const sent = ref(false)
const message = ref('')

async function submit() {
  const normalized = email.value.trim().toLowerCase()
  if (!normalized) {
    ElMessage.warning('Informe o e-mail da conta.')
    return
  }

  loading.value = true
  try {
    const response = await authApi.forgotPassword(normalized)
    message.value = response.message
    sent.value = true
  } catch (error: any) {
    ElMessage.error(
      error?.response?.data?.message ||
        'Não foi possível processar a solicitação de recuperação.'
    )
  } finally {
    loading.value = false
  }
}
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
          <span class="login-brand-subtitle">Recuperação de acesso</span>
          <span class="login-brand-event">RAS UFRB · RRC</span>
        </div>
      </section>

      <section class="login-form-panel">
        <form class="login-card" @submit.prevent="submit">
          <header class="login-form-heading">
            <h1>Recuperar senha</h1>
            <p>Receba um link seguro para definir uma nova senha.</p>
          </header>

          <div v-if="sent" class="auth-status-card auth-status-success">
            <strong>Solicitação processada</strong>
            <span>{{ message }}</span>
          </div>

          <template v-else>
            <div class="login-field">
              <label for="recovery-email">E-mail</label>
              <el-input
                id="recovery-email"
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
              native-type="submit"
              :loading="loading"
            >
              Enviar link de recuperação
            </el-button>
          </template>

          <p class="auth-security-copy">
            Por segurança, a resposta é a mesma mesmo quando o endereço não pertence a uma conta válida.
          </p>

          <div class="auth-secondary-action">
            <router-link to="/login">← Voltar para o login</router-link>
          </div>

          <p class="login-copyright">© {{ currentYear }} RAS UFRB - Todos os direitos reservados</p>
        </form>
      </section>
    </div>
  </div>
</template>
