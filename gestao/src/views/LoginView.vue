<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../store'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const showPassword = ref(false)
const form = reactive({ email: '', senha: '' })

async function submit() {
  if (!form.email || !form.senha) {
    ElMessage.warning('Informe e-mail e senha.')
    return
  }
  try {
    await auth.login(form.email.trim(), form.senha)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.replace(redirect)
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || 'Não foi possível entrar. Verifique as credenciais.')
  }
}
</script>

<template>
  <div class="login-page">
    <section class="login-brand-panel">
      <div class="login-brand-copy">
        <span class="eyebrow light">IEEE Robotics & Automation Society · UFRB</span>
        <img src="/rascomp-logo.webp" alt="Logo RASCOMP" class="login-logo" />
        <h1>Da inscrição ao pódio, tudo em um único fluxo.</h1>
        <p>
          Equipes, robôs, inspeções, tentativas, chaveamentos e resultados preparados para
          operação em tempo real.
        </p>
        <div class="login-chips">
          <span>FOLLOW LINE</span><span>SUMÔ</span><span>RRC OPS</span>
        </div>
      </div>
    </section>

    <section class="login-form-panel">
      <form class="login-card" @submit.prevent="submit">
        <div class="login-mobile-brand">
          <img src="/rascomp-logo.webp" alt="RASCOMP" />
        </div>
        <span class="eyebrow">Acesso seguro</span>
        <h2>Entrar no RASCOMP</h2>
        <p class="muted">Use sua conta de participante ou organização.</p>

        <label>E-mail</label>
        <el-input v-model="form.email" size="large" type="email" placeholder="voce@exemplo.com" />

        <label>Senha</label>
        <el-input
          v-model="form.senha"
          size="large"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          @keyup.enter="submit"
        >
          <template #suffix>
            <button type="button" class="text-button" @click="showPassword = !showPassword">
              {{ showPassword ? 'ocultar' : 'mostrar' }}
            </button>
          </template>
        </el-input>

        <el-button
          class="primary-action"
          size="large"
          native-type="submit"
          :loading="auth.loading"
        >
          Entrar
        </el-button>

        <p class="login-footnote">
          A autenticação usa <code>POST /api/v1/auth/login</code> e JWT Bearer.
        </p>
      </form>
    </section>
  </div>
</template>
