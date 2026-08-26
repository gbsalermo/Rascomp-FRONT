<script setup lang="ts">
const siteUrl = (import.meta.env.VITE_SITE_URL || 'http://localhost:5174').replace(/\/$/, '')
</script>

<template>
  <div class="gallery-app-shell">
    <header class="gallery-site-header">
      <div class="gallery-site-header-inner">
        <a :href="siteUrl" class="gallery-brand" aria-label="Voltar ao site da IEEE RAS UFRB">
          <span class="gallery-brand-mark">RAS</span>
          <span>
            <strong>IEEE RAS UFRB</strong>
            <small>Galeria de fotos</small>
          </span>
        </a>

        <nav aria-label="Navegação da galeria">
          <RouterLink to="/">Álbuns</RouterLink>
          <a :href="siteUrl">Voltar ao site</a>
        </nav>
      </div>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="gallery-site-footer">
      <div>
        <strong>IEEE RAS UFRB</strong>
        <span>Memórias, projetos, eventos e robótica.</span>
      </div>
      <a :href="siteUrl">Voltar para a página institucional →</a>
    </footer>
  </div>
</template>
