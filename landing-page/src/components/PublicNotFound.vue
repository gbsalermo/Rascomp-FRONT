<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.title = '404 | RasComp'
})
</script>

<template>
  <main class="not-found-page" aria-labelledby="not-found-title">
    <section class="not-found-shell">
      <div class="not-found-visual">
        <img src="/404-error.jpg" alt="Ilustração da página de erro 404" />
      </div>

      <div class="not-found-content">
        <img class="not-found-logo" src="/rascomp-logo.webp" alt="RasComp" />
        <span class="not-found-eyebrow">Erro 404</span>
        <h1 id="not-found-title">Essa rota saiu da pista.</h1>
        <p>
          A página que você tentou acessar não existe, foi movida ou não está mais disponível.
          Volte para a página inicial e continue acompanhando o RasComp.
        </p>

        <a class="not-found-home" href="/">Voltar para o início</a>

        <small class="not-found-credit">
          <a href="https://www.freepik.com" target="_blank" rel="noreferrer noopener">Designed by Freepik</a>
        </small>
      </div>
    </section>
  </main>
</template>
