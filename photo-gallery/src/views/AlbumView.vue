<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findAlbum, type GalleryPhoto } from '../data/albums'

const route = useRoute()
const selectedIndex = ref<number | null>(null)

const album = computed(() => findAlbum(route.params.slug))
const selectedPhoto = computed<GalleryPhoto | null>(() => {
  if (selectedIndex.value == null || !album.value) return null
  return album.value.photos[selectedIndex.value] || null
})

function openPhoto(index: number) {
  selectedIndex.value = index
}

function closeLightbox() {
  selectedIndex.value = null
}

function previousPhoto() {
  if (selectedIndex.value == null || !album.value) return
  selectedIndex.value = (selectedIndex.value - 1 + album.value.photos.length) % album.value.photos.length
}

function nextPhoto() {
  if (selectedIndex.value == null || !album.value) return
  selectedIndex.value = (selectedIndex.value + 1) % album.value.photos.length
}

watch(() => route.params.slug, closeLightbox)
</script>

<template>
  <section v-if="album" class="album-page">
    <div class="gallery-page-container">
      <RouterLink to="/" class="album-back-link">← Todos os álbuns</RouterLink>

      <header class="album-heading">
        <div>
          <span class="gallery-category-pill">{{ album.category }}</span>
          <h1>{{ album.title }}</h1>
          <p>{{ album.description }}</p>
        </div>
        <div class="album-summary">
          <strong>{{ album.count }}</strong>
          <span>fotos no álbum</span>
          <small>{{ album.date }}</small>
        </div>
      </header>

      <div class="album-photo-grid">
        <button
          v-for="(photo, index) in album.photos"
          :key="photo.id"
          type="button"
          class="album-photo-card"
          :aria-label="`Abrir ${photo.alt}`"
          @click="openPhoto(index)"
        >
          <img v-if="photo.src" :src="photo.src" :alt="photo.alt" loading="lazy" />
          <span v-else class="album-photo-placeholder">
            <small>{{ album.category }}</small>
            <strong>Foto {{ index + 1 }}</strong>
            <em>Imagem real a adicionar</em>
          </span>
        </button>
      </div>

      <div class="album-more-note">
        <strong>Estrutura pronta para as fotos reais</strong>
        <p>
          Nesta primeira versão exibimos amostras estruturais. Quando os arquivos reais forem adicionados ao catálogo, a mesma grade e o lightbox passam a usar as imagens automaticamente.
        </p>
      </div>
    </div>

    <div v-if="selectedPhoto && selectedIndex != null" class="gallery-lightbox" role="dialog" aria-modal="true" :aria-label="selectedPhoto.alt">
      <button type="button" class="lightbox-close" aria-label="Fechar foto" @click="closeLightbox">×</button>
      <button type="button" class="lightbox-arrow previous" aria-label="Foto anterior" @click="previousPhoto">‹</button>

      <div class="lightbox-content">
        <img v-if="selectedPhoto.src" :src="selectedPhoto.src" :alt="selectedPhoto.alt" />
        <div v-else class="lightbox-placeholder">
          <span>{{ album.category }}</span>
          <strong>{{ album.title }}</strong>
          <small>Foto {{ selectedIndex + 1 }}</small>
        </div>
        <p>{{ selectedIndex + 1 }} / {{ album.photos.length }}</p>
      </div>

      <button type="button" class="lightbox-arrow next" aria-label="Próxima foto" @click="nextPhoto">›</button>
    </div>
  </section>

  <section v-else class="album-not-found">
    <div class="gallery-page-container">
      <span class="gallery-kicker">Álbum não encontrado</span>
      <h1>Esse álbum não existe.</h1>
      <RouterLink to="/">Voltar para a galeria</RouterLink>
    </div>
  </section>
</template>
