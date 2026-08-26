<script setup lang="ts">
import { computed, ref } from 'vue'
import { albums, type GalleryCategory } from '../data/albums'

type Filter = 'Todos' | GalleryCategory

const filters: Filter[] = ['Todos', 'RRC', 'Oficinas', 'RAS nas Escolas', 'Premiações', 'Eventos']
const activeFilter = ref<Filter>('Todos')

const visibleAlbums = computed(() => {
  if (activeFilter.value === 'Todos') return albums
  return albums.filter((album) => album.category === activeFilter.value)
})
</script>

<template>
  <section class="gallery-home-page">
    <div class="gallery-page-container">
      <header class="gallery-hero">
        <span class="gallery-kicker">Memórias da RAS UFRB</span>
        <h1>Galeria</h1>
        <p>
          Um espaço dedicado aos registros de competições, oficinas, projetos, visitas, premiações e eventos da comunidade IEEE RAS UFRB.
        </p>
      </header>

      <div class="gallery-filter-bar" aria-label="Filtrar álbuns">
        <button
          v-for="filter in filters"
          :key="filter"
          type="button"
          :class="{ active: activeFilter === filter }"
          @click="activeFilter = filter"
        >
          {{ filter }}
        </button>
      </div>

      <div class="gallery-index-grid">
        <article v-for="album in visibleAlbums" :key="album.slug" class="gallery-index-card">
          <RouterLink :to="`/albuns/${album.slug}`" class="gallery-index-media" :aria-label="`Abrir álbum ${album.title}`">
            <img v-if="album.cover" :src="album.cover" :alt="`Capa do álbum ${album.title}`" />
            <div v-else class="gallery-placeholder-cover">
              <span>{{ album.category }}</span>
              <strong>{{ album.title }}</strong>
              <small>Foto de capa a adicionar</small>
            </div>
            <div class="gallery-placeholder-strip" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </RouterLink>

          <div class="gallery-index-copy">
            <span class="gallery-category-pill">{{ album.category }}</span>
            <h2>{{ album.title }}</h2>
            <div class="gallery-index-meta">
              <span>{{ album.count }} fotos</span>
              <span>{{ album.date }}</span>
            </div>
            <p>{{ album.description }}</p>
            <RouterLink :to="`/albuns/${album.slug}`" class="gallery-index-link">Ver álbum <span>→</span></RouterLink>
          </div>
        </article>
      </div>

      <p class="gallery-development-note">
        As imagens exibidas nesta primeira versão são placeholders. A estrutura já está pronta para receber capas e fotos reais por álbum.
      </p>
    </div>
  </section>
</template>
