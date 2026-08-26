<script setup lang="ts">
import { computed, ref } from 'vue'

type GalleryFilter = 'Todos' | 'RRC' | 'Oficinas' | 'RAS nas Escolas' | 'Premiações' | 'Eventos'

type GalleryAlbum = {
  id: number
  slug: string
  title: string
  category: Exclude<GalleryFilter, 'Todos'>
  description: string
  date: string
  count: number
  tone: 'purple' | 'red' | 'neutral'
}

const filters: GalleryFilter[] = ['Todos', 'RRC', 'Oficinas', 'RAS nas Escolas', 'Premiações', 'Eventos']
const activeFilter = ref<GalleryFilter>('Todos')
const selectedAlbum = ref<GalleryAlbum | null>(null)
const galleryBaseUrl = (import.meta.env.VITE_GALERIA_URL || 'http://localhost:5175').replace(/\/$/, '')

const albums: GalleryAlbum[] = [
  {
    id: 1,
    slug: 'rrc-2026',
    title: 'RRC 2026',
    category: 'RRC',
    description: 'Momentos das edições do RRC e da nossa equipe em ação dentro e fora das pistas.',
    date: '11–13 abr. 2026',
    count: 48,
    tone: 'red'
  },
  {
    id: 2,
    slug: 'oficina-de-robotica',
    title: 'Oficina de Robótica',
    category: 'Oficinas',
    description: 'Capacitação, aprendizado e compartilhamento de conhecimento com a comunidade.',
    date: '22 mai. 2026',
    count: 32,
    tone: 'purple'
  },
  {
    id: 3,
    slug: 'ras-nas-escolas',
    title: 'RAS nas Escolas',
    category: 'RAS nas Escolas',
    description: 'Levando tecnologia, inspiração e ciência para estudantes de escolas da nossa região.',
    date: '03 jun. 2026',
    count: 27,
    tone: 'red'
  },
  {
    id: 4,
    slug: 'conquistas-e-premiacoes',
    title: 'Conquistas e Premiações',
    category: 'Premiações',
    description: 'Registros de conquistas que representam trabalho, dedicação e evolução técnica.',
    date: '2025–2026',
    count: 41,
    tone: 'purple'
  },
  {
    id: 5,
    slug: 'eventos-institucionais',
    title: 'Eventos Institucionais',
    category: 'Eventos',
    description: 'Palestras, workshops, integrações e momentos que fortalecem nossa comunidade.',
    date: '2025–2026',
    count: 36,
    tone: 'neutral'
  }
]

const visibleAlbums = computed(() => {
  if (activeFilter.value === 'Todos') return albums
  return albums.filter((album) => album.category === activeFilter.value)
})

function selectAlbum(album: GalleryAlbum) {
  selectedAlbum.value = album
}

function closePreview() {
  selectedAlbum.value = null
}

function albumUrl(album: GalleryAlbum) {
  return `${galleryBaseUrl}/albuns/${album.slug}`
}
</script>

<template>
  <section id="galeria" class="institutional-gallery-section">
    <div class="institutional-gallery-container">
      <header class="institutional-gallery-heading">
        <div class="gallery-heading-copy">
          <span class="gallery-heading-icon" aria-hidden="true">▣</span>
          <div>
            <span class="gallery-eyebrow">Memórias e registros</span>
            <h2>Galeria</h2>
            <p>Registros que contam nossa história e mostram o impacto da robótica. Confira fotos de eventos, competições, oficinas, visitas às escolas e premiações.</p>
          </div>
        </div>
      </header>

      <div class="gallery-filter-row" aria-label="Filtrar galeria">
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

      <div class="gallery-albums-grid">
        <article v-for="album in visibleAlbums" :key="album.id" class="gallery-album-card">
          <button
            type="button"
            class="gallery-album-media"
            :class="`tone-${album.tone}`"
            :aria-label="`Abrir prévia de ${album.title}`"
            @click="selectAlbum(album)"
          >
            <div class="gallery-album-main-placeholder">
              <span>{{ album.category }}</span>
            </div>

            <div class="gallery-album-thumbs" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </button>

          <div class="gallery-album-copy">
            <span class="gallery-album-category">{{ album.category }}</span>
            <h3>{{ album.title }}</h3>
            <div class="gallery-album-meta">
              <span>▧ {{ album.count }} fotos</span>
              <span>▣ {{ album.date }}</span>
            </div>
            <p>{{ album.description }}</p>
            <a class="gallery-open-album" :href="albumUrl(album)">Ver álbum <span aria-hidden="true">→</span></a>
          </div>
        </article>
      </div>

      <div class="gallery-help-note">
        <span aria-hidden="true">▧</span>
        <p>Clique na capa para uma prévia rápida ou em “Ver álbum” para abrir a galeria completa.</p>
      </div>
    </div>

    <aside v-if="selectedAlbum" class="gallery-preview-card" aria-live="polite">
      <header>
        <strong>▧ Prévia do álbum</strong>
        <button type="button" aria-label="Fechar prévia" @click="closePreview">×</button>
      </header>
      <div class="gallery-preview-media" :class="`tone-${selectedAlbum.tone}`">
        <span>{{ selectedAlbum.category }}</span>
        <a :href="albumUrl(selectedAlbum)" aria-label="Abrir álbum completo">›</a>
      </div>
      <footer>
        <span>Prévia · {{ selectedAlbum.count }} fotos</span>
        <a :href="albumUrl(selectedAlbum)">Abrir álbum →</a>
      </footer>
    </aside>
  </section>
</template>
