<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../store'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const remember = ref(false)
const currentYear = new Date().getFullYear()
const form = reactive({ email: '', senha: '' })

async function submit() {
  if (!form.email || !form.senha) {
    ElMessage.warning('Informe e-mail e senha.')
    return
  }

  try {
    await auth.login(form.email.trim(), form.senha, remember.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.replace(redirect)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível entrar. Verifique as credenciais.')
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-shell login-shell-main">
      <section class="login-brand-panel" aria-label="Identidade RASCOMP">
        <div class="login-brand-content">
          <img
            src="/rascomp-login-logo.svg"
            alt="RasComp"
            class="login-brand-logo"
          />
          <span class="login-brand-subtitle">Sistema de Gestão</span>
          <span class="login-brand-event">RRC - Competição de Robótica</span>
        </div>

        <img
          src="/ieee-ras-login.svg"
          alt="IEEE Robotics & Automation Society"
          class="login-ieee-logo"
        />
      </section>

      <section class="login-form-panel">
        <form class="login-card" @submit.prevent="submit">
          <div class="login-mobile-brand">
            <img src="/rascomp-login-logo.svg" alt="RasComp" />
          </div>

          <header class="login-form-heading">
            <h1>Acessar Sistema</h1>
            <p>Entre com suas credenciais</p>
          </header>

          <div class="login-field">
            <label for="login-email">E-mail</label>
            <el-input
              id="login-email"
              v-model="form.email"
              size="large"
              type="email"
              autocomplete="email"
              placeholder="admin@rasufrb.edu.br"
            />
          </div>

          <div class="login-field">
            <label for="login-password">Senha</label>
            <el-input
              id="login-password"
              v-model="form.senha"
              size="large"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              show-password
              @keyup.enter="submit"
            />
          </div>

          <div class="login-options">
            <el-checkbox v-model="remember">Lembrar de mim</el-checkbox>
            <router-link to="/recuperar-senha" class="login-forgot-link">
              Esqueci minha senha
            </router-link>
          </div>

          <el-button
            class="login-submit"
            size="large"
            native-type="submit"
            :loading="auth.loading"
          >
            Entrar
          </el-button>

          <div class="auth-divider"><span>primeiro acesso</span></div>

          <router-link to="/cadastro" class="auth-create-account-button">
            Criar conta de participante
          </router-link>

          <p class="auth-first-access-copy">
            O cadastro cria somente sua conta. Equipe, membros, robô e inscrição são configurados depois no portal do participante.
          </p>

          <p class="login-copyright">
            © {{ currentYear }} RAS UFRB - Todos os direitos reservados
          </p>
        </form>
      </section>
    </div>
  </div>
</template>
