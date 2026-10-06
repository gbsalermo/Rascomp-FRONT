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
    ElMessage.error('O link de recuperação está incompleto.')
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
    const response = await authApi.resetPassword(token.value, form.senha)
    message.value = response.message
    success.value = true
  } catch (error: any) {
    ElMessage.error(
      error?.response?.data?.message ||
        'O link é inválido, expirou ou já foi utilizado.'
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
          <span class="login-brand-subtitle">Nova senha</span>
          <span class="login-brand-event">RAS UFRB · RRC</span>
        </div>
      </section>

      <section class="login-form-panel">
        <form class="login-card" @submit.prevent="submit">
          <header class="login-form-heading">
            <h1>Redefinir senha</h1>
            <p v-if="!success">Defina a nova credencial da sua conta.</p>
            <p v-else>Sua credencial foi atualizada.</p>
          </header>

          <div v-if="success" class="auth-status-card auth-status-success">
            <strong>Senha alterada</strong>
            <span>{{ message }}</span>
          </div>

          <template v-else>
            <div v-if="!token" class="auth-pending-note">
              <strong>Link incompleto</strong>
              <span>Solicite uma nova recuperação de senha para receber um link válido.</span>
            </div>

            <template v-else>
              <div class="login-field">
                <label for="reset-password">Nova senha</label>
                <el-input
                  id="reset-password"
                  v-model="form.senha"
                  size="large"
                  type="password"
                  autocomplete="new-password"
                  show-password
                />
              </div>

              <div class="login-field">
                <label for="reset-password-confirm">Confirmar nova senha</label>
                <el-input
                  id="reset-password-confirm"
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
                Salvar nova senha
              </el-button>
            </template>
          </template>

          <div class="auth-secondary-action">
            <router-link :to="success ? '/login' : '/recuperar-senha'">
              {{ success ? 'Entrar com a nova senha' : '← Solicitar outro link' }}
            </router-link>
          </div>

          <p class="login-copyright">© {{ currentYear }} RAS UFRB - Todos os direitos reservados</p>
        </form>
      </section>
    </div>
  </div>
</template>
