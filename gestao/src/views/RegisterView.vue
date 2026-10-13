<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../store'

const auth = useAuthStore()
const router = useRouter()
const currentYear = new Date().getFullYear()
const form = reactive({
  nome: '',
  email: '',
  telefone: '',
  senha: '',
  confirmarSenha: ''
})

async function submit() {
  if (!form.nome || !form.email || !form.senha || !form.confirmarSenha) {
    ElMessage.warning('Preencha os campos obrigatórios.')
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

  try {
    const response = await auth.register({
      nome: form.nome.trim(),
      email: form.email.trim().toLowerCase(),
      telefone: form.telefone.trim() || undefined,
      senha: form.senha
    })

    ElMessage.success(response.message)
    router.replace({
      name: 'verify-email',
      query: { email: response.email, created: '1' }
    })
  } catch (error: any) {
    ElMessage.error(
      error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Não foi possível criar a conta.'
    )
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-shell auth-shell-tall">
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
          <span class="login-brand-event">Crie sua conta para participar do RRC</span>
        </div>

        <div class="auth-flow-note">
          <strong>Como funciona</strong>
          <span>1. Crie sua conta</span>
          <span>2. Confirme seu e-mail</span>
          <span>3. Acesse o Portal do Participante</span>
          <span>4. Configure equipe, robô e inscrição</span>
        </div>
      </section>

      <section class="login-form-panel auth-form-scroll">
        <form class="login-card auth-register-card" @submit.prevent="submit">
          <header class="login-form-heading">
            <h1>Criar conta</h1>
            <p>O acesso só é liberado depois da confirmação do e-mail.</p>
          </header>

          <div class="login-field">
            <label for="register-name">Nome completo *</label>
            <el-input id="register-name" v-model="form.nome" size="large" autocomplete="name" />
          </div>

          <div class="login-field">
            <label for="register-email">E-mail *</label>
            <el-input id="register-email" v-model="form.email" size="large" type="email" autocomplete="email" />
          </div>

          <div class="login-field">
            <label for="register-phone">Telefone</label>
            <el-input id="register-phone" v-model="form.telefone" size="large" autocomplete="tel" />
          </div>

          <div class="auth-password-grid">
            <div class="login-field">
              <label for="register-password">Senha *</label>
              <el-input
                id="register-password"
                v-model="form.senha"
                size="large"
                type="password"
                autocomplete="new-password"
                show-password
              />
            </div>

            <div class="login-field">
              <label for="register-confirm">Confirmar senha *</label>
              <el-input
                id="register-confirm"
                v-model="form.confirmarSenha"
                size="large"
                type="password"
                autocomplete="new-password"
                show-password
              />
            </div>
          </div>

          <p class="auth-security-copy">
            Usaremos o e-mail para confirmar a conta e recuperar seu acesso quando necessário.
          </p>

          <el-button class="login-submit" size="large" native-type="submit" :loading="auth.loading">
            Criar conta e enviar confirmação
          </el-button>

          <div class="auth-secondary-action">
            <span>Já possui uma conta?</span>
            <router-link to="/login">Entrar</router-link>
          </div>

          <p class="login-copyright">© {{ currentYear }} RAS UFRB - Todos os direitos reservados</p>
        </form>
      </section>
    </div>
  </div>
</template>
