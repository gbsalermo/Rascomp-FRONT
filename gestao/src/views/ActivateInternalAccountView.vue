<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authApi } from '../api'

const route = useRoute()
const currentYear = new Date().getFullYear()
const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
const loading = ref(false)
const success = ref(false)
const message = ref('')
const form = reactive({
  senha: '',
  confirmarSenha: ''
})

async function submit() {
  if (!token.value) {
    ElMessage.error('O convite de primeiro acesso está incompleto.')
    return
  }
  if (form.senha.length < 8) {
    ElMessage.warning('A senha deve ter pelo menos 8 caracteres.')
    return
  }
  if (form.senha !== form.confirmarSenha) {
    ElMessage.warning('As senhas não coincidem.')
    return
  }

  loading.value = true
  try {
    const response = await authApi.activateInternalAccount(token.value, form.senha)
    message.value = response.message
    success.value = true
  } catch (error: any) {
    ElMessage.error(
      error?.response?.data?.message ||
        'O convite é inválido, expirou ou já foi utilizado.'
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
          <span class="login-brand-subtitle">Primeiro acesso</span>
          <span class="login-brand-event">RAS UFRB · RRC</span>
        </div>
      </section>

      <section class="login-form-panel">
        <form class="login-card" @submit.prevent="submit">
          <header class="login-form-heading">
            <h1>Ativar conta</h1>
            <p v-if="!success">Crie sua senha pessoal para concluir o primeiro acesso.</p>
            <p v-else>Sua conta interna está pronta para uso.</p>
          </header>

          <div v-if="success" class="auth-status-card auth-status-success">
            <strong>Conta ativada</strong>
            <span>{{ message }}</span>
          </div>

          <template v-else>
            <div v-if="!token" class="auth-pending-note">
              <strong>Convite incompleto</strong>
              <span>Peça ao DEV responsável para reenviar o convite de primeiro acesso.</span>
            </div>

            <template v-else>
              <p class="auth-security-copy">
                A senha é definida somente por você. O administrador que criou sua conta não tem acesso a ela.
              </p>

              <div class="login-field">
                <label for="activation-password">Criar senha</label>
                <el-input
                  id="activation-password"
                  v-model="form.senha"
                  size="large"
                  type="password"
                  autocomplete="new-password"
                  show-password
                />
              </div>

              <div class="login-field">
                <label for="activation-password-confirm">Confirmar senha</label>
                <el-input
                  id="activation-password-confirm"
                  v-model="form.confirmarSenha"
                  size="large"
                  type="password"
                  autocomplete="new-password"
                  show-password
                />
              </div>

              <el-button
                class="login-submit"
                size="large"
                native-type="submit"
                :loading="loading"
              >
                Ativar conta
              </el-button>
            </template>
          </template>

          <div class="auth-secondary-action">
            <router-link to="/login">
              {{ success ? 'Entrar no RasComp' : '← Voltar para o login' }}
            </router-link>
          </div>

          <p class="login-copyright">© {{ currentYear }} RAS UFRB - Todos os direitos reservados</p>
        </form>
      </section>
    </div>
  </div>
</template>
