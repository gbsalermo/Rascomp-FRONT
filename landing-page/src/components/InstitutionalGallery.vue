<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type GalleryPreview = {
  src: string
  alt: string
  path: string
}

const galleryImageModules = import.meta.glob(
  '../assets/gallery-preview/*.{jpg,jpeg,png,webp,avif}',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
) as Record<string, string>

const galleryUrl = String(
  import.meta.env.VITE_GALERIA_URL || (import.meta.env.DEV ? 'http://localhost:5175' : '')
).trim().replace(/\/$/, '')

const previews = computed<GalleryPreview[]>(() =>
  Object.entries(galleryImageModules)
    .sort(([a], [b]) => a.localeCompare(b, 'pt-BR', { numeric: true }))
    .map(([path, src], index) => ({
      src,
      path,
      alt: `Registro da IEEE RAS UFRB ${index + 1}`
    }))
)

const activeIndex = ref(0)
const paused = ref(false)
let autoplayTimer: number | undefined

const activePreview = computed(() => previews.value[activeIndex.value] || null)

function nextPreview() {
  if (previews.value.length <= 1) return
  activeIndex.value = (activeIndex.value + 1) % previews.value.length
}

function previousPreview() {
  if (previews.value.length <= 1) return
  activeIndex.value =
    (activeIndex.value - 1 + previews.value.length) % previews.value.length
}

function selectPreview(index: number) {
  activeIndex.value = index
}

onMounted(() => {
  autoplayTimer = window.setInterval(() => {
    if (!paused.value && previews.value.length > 1) {
      nextPreview()
    }
  }, 6500)
})

onBeforeUnmount(() => {
  if (autoplayTimer) window.clearInterval(autoplayTimer)
})
</script>

<template>
  <section id="galeria" class="institutional-gallery-section">
    <div class="institutional-gallery-container">
      <div class="gallery-showcase-grid">
        <div class="gallery-showcase-copy">
          <span class="gallery-eyebrow">Registros da RAS</span>
          <h2>Galeria</h2>
          <p>Projetos, eventos, competições e momentos que fazem parte da nossa trajetória.</p>

          <a
            v-if="galleryUrl"
            class="gallery-primary-cta"
            :href="galleryUrl"
          >
            Ver galeria completa <span aria-hidden="true">→</span>
          </a>

          <span
            v-else
            class="gallery-primary-cta gallery-primary-cta--disabled"
            aria-disabled="true"
            title="Destino da galeria ainda não configurado"
          >
            Ver galeria completa <span aria-hidden="true">→</span>
          </span>
        </div>

        <div
          class="gallery-showcase-visual"
          @mouseenter="paused = true"
          @mouseleave="paused = false"
        >
          <div class="gallery-showcase-frame">
            <img
              v-if="activePreview"
              :src="activePreview.src"
              :alt="activePreview.alt"
              class="gallery-showcase-image"
            />

            <div v-else class="gallery-showcase-placeholder">
              <span>Adicione fotos em <b>src/assets/gallery-preview/</b></span>
            </div>

            <template v-if="previews.length > 1">
              <button
                type="button"
                class="gallery-showcase-arrow gallery-showcase-arrow--left"
                aria-label="Foto anterior"
                @click="previousPreview"
              >
                ←
              </button>

              <button
                type="button"
                class="gallery-showcase-arrow gallery-showcase-arrow--right"
                aria-label="Próxima foto"
                @click="nextPreview"
              >
                →
              </button>
            </template>
          </div>

          <div v-if="previews.length" class="gallery-showcase-navigation">
            <span class="gallery-showcase-counter">
              <strong>{{ String(activeIndex + 1).padStart(2, '0') }}</strong>
              <span>/</span>
              <span>{{ String(previews.length).padStart(2, '0') }}</span>
            </span>

            <div v-if="previews.length > 1" class="gallery-showcase-dots" aria-label="Fotos da galeria">
              <button
                v-for="(_, index) in previews"
                :key="index"
                type="button"
                :class="{ active: index === activeIndex }"
                :aria-label="`Mostrar foto ${index + 1}`"
                @click="selectPreview(index)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
