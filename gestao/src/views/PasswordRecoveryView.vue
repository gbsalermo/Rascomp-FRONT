<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const email = ref('')
const currentYear = new Date().getFullYear()

function submit() {
  if (!email.value.trim()) {
    ElMessage.warning('Informe o e-mail da conta.')
    return
  }

  ElMessage.info('A recuperação de senha será ativada quando o backend disponibilizar esse fluxo.')
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
            <p>Informe o e-mail associado à sua conta.</p>
          </header>

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

          <div class="auth-pending-note">
            <strong>Fluxo em preparação</strong>
            <span>A interface já está pronta, mas o envio de recuperação ainda depende do endpoint de backend.</span>
          </div>

          <el-button class="login-submit" size="large" native-type="submit">
            Solicitar recuperação
          </el-button>

          <div class="auth-secondary-action">
            <router-link to="/login">← Voltar para o login</router-link>
          </div>

          <p class="login-copyright">© {{ currentYear }} RAS UFRB - Todos os direitos reservados</p>
        </form>
      </section>
    </div>
  </div>
</template>
