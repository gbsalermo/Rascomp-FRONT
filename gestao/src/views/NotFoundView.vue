<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store'

const router = useRouter()
const auth = useAuthStore()

const homeLabel = computed(() => auth.isAuthenticated ? 'Voltar ao início' : 'Ir para o login')

function goHome() {
  if (!auth.isAuthenticated || !auth.user) {
    router.push({ name: 'login' })
    return
  }

  router.push({ name: auth.user.role === 'PARTICIPANTE' ? 'participant' : 'dashboard' })
}
</script>

<template>
  <main class="not-found-page">
    <section class="not-found-content" aria-labelledby="not-found-title">
      <img
        class="not-found-robot"
        src="/rascomp-404-robot.gif"
        alt="Robô do RASCOMP acenando"
      />

      <p class="error-code">404</p>
      <h1 id="not-found-title">Página não encontrada</h1>
      <p class="error-message">
        Parece que nosso robô se perdeu no caminho. A página que você tentou acessar não existe ou foi movida.
      </p>

      <button class="back-button" type="button" @click="goHome">
        {{ homeLabel }}
      </button>
    </section>
  </main>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 20px;
  background: #050505;
  color: #f7f7f7;
}

.not-found-content {
  width: min(100%, 760px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.not-found-robot {
  display: block;
  width: min(100%, 620px);
  height: auto;
  object-fit: contain;
  margin-bottom: 4px;
}

.error-code {
  margin: 0;
  color: #5eead4;
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.06em;
}

h1 {
  margin: 14px 0 8px;
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 700;
}

.error-message {
  max-width: 540px;
  margin: 0;
  color: #a9b0b8;
  font-size: 1rem;
  line-height: 1.6;
}

.back-button {
  margin-top: 28px;
  min-height: 44px;
  padding: 0 22px;
  border: 1px solid rgba(94, 234, 212, 0.42);
  border-radius: 10px;
  background: rgba(94, 234, 212, 0.08);
  color: #f7f7f7;
  font: inherit;
  font-weight: 650;
  cursor: pointer;
  transition: background-color 160ms ease, border-color 160ms ease, transform 160ms ease;
}

.back-button:hover {
  background: rgba(94, 234, 212, 0.14);
  border-color: #5eead4;
  transform: translateY(-1px);
}

.back-button:focus-visible {
  outline: 2px solid #5eead4;
  outline-offset: 4px;
}

@media (max-width: 600px) {
  .not-found-page {
    padding: 24px 16px;
  }

  .not-found-robot {
    width: min(100%, 480px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-button {
    transition: none;
  }
}
</style>
