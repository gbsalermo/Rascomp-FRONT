<script setup lang="ts">
import { computed, ref } from 'vue'

type GalleryFilter = 'Todos' | 'RRC' | 'Oficinas' | 'RAS nas Escolas' | 'Competições' | 'Premiações' | 'Eventos' | 'Visitas Técnicas'

type GalleryAlbum = {
  id: number
  title: string
  category: Exclude<GalleryFilter, 'Todos'>
  description: string
  year: string
  count: number
  tone: 'purple' | 'red' | 'neutral'
}

const filters: GalleryFilter[] = ['Todos', 'RRC', 'Oficinas', 'RAS nas Escolas', 'Competições', 'Premiações', 'Eventos', 'Visitas Técnicas']
const activeFilter = ref<GalleryFilter>('Todos')
const selectedAlbum = ref<GalleryAlbum | null>(null)

const albums: GalleryAlbum[] = [
  { id: 1, title: 'RRC — Competição de Robótica', category: 'RRC', description: 'Momentos das edições do RRC e da nossa equipe em ação dentro e fora das pistas.', year: '2026', count: 128, tone: 'red' },
  { id: 2, title: 'Oficinas e Cursos', category: 'Oficinas', description: 'Capacitação, aprendizado e compartilhamento de conhecimento com a comunidade.', year: '2026', count: 86, tone: 'purple' },
  { id: 3, title: 'RAS nas Escolas', category: 'RAS nas Escolas', description: 'Levando tecnologia, inspiração e ciência para estudantes de escolas da nossa região.', year: '2026', count: 72, tone: 'neutral' },
  { id: 4, title: 'Outras Competições', category: 'Competições', description: 'Participações em eventos e torneios de robótica em diferentes modalidades.', year: '2025', count: 94, tone: 'red' },
  { id: 5, title: 'Conquistas e Premiações', category: 'Premiações', description: 'Cada conquista é resultado de muito trabalho, dedicação e paixão pela robótica.', year: '2025', count: 41, tone: 'purple' },
  { id: 6, title: 'Eventos Institucionais', category: 'Eventos', description: 'Palestras, workshops, integrações e momentos que fortalecem nossa comunidade.', year: '2025', count: 83, tone: 'neutral' },
  { id: 7, title: 'Visitas Técnicas', category: 'Visitas Técnicas', description: 'Conhecimento na prática: empresas, laboratórios e centros de inovação.', year: '2025', count: 37, tone: 'purple' }
]

const visibleAlbums = computed(() => {
  if (activeFilter.value === 'Todos') return albums
  return albums.filter((album) => album.category === activeFilter.value)
})

function openAlbum(album: GalleryAlbum) {
  selectedAlbum.value = album
}

function closeAlbum() {
  selectedAlbum.value = null
}
</script>

<template>
  <section id="galeria" class="institutional-gallery-section">
    <div class="institutional-gallery-container">
      <header class="institutional-gallery-heading">
        <div>
          <span>Galeria</span>
          <h2>Galeria de Momentos</h2>
          <p>Registros de eventos, competições, oficinas e ações que fazem parte da história da RAS UFRB.</p>
        </div>
        <a href="#eventos" class="gallery-view-more">Ver todas as fotos <span aria-hidden="true">→</span></a>
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
          <button type="button" class="gallery-album-media" :class="`tone-${album.tone}`" @click="openAlbum(album)">
            <div class="gallery-album-main-placeholder"><span>{{ album.category }}</span></div>
            <div class="gallery-album-thumbs" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span class="gallery-photo-count">▣ {{ album.count }} fotos</span>
          </button>
          <div class="gallery-album-copy">
            <strong>{{ album.title }}</strong>
            <p>{{ album.description }}</p>
          </div>
        </article>

        <aside v-if="activeFilter === 'Todos'" class="gallery-share-card">
          <div class="gallery-share-icon" aria-hidden="true">📷</div>
          <h3>Tem um registro incrível?</h3>
          <p>Compartilhe suas fotos com a gente e faça parte da nossa história.</p>
          <a href="#contato">Enviar fotos <span aria-hidden="true">→</span></a>
        </aside>
      </div>

      <p class="gallery-note">Novas fotos poderão ser organizadas por álbum/evento. O acervo oficial será conectado depois sem alterar esta estrutura.</p>
    </div>

    <div v-if="selectedAlbum" class="gallery-lightbox" role="dialog" aria-modal="true" :aria-label="selectedAlbum.title" @click.self="closeAlbum">
      <article class="gallery-lightbox-card">
        <button type="button" class="gallery-lightbox-close" aria-label="Fechar" @click="closeAlbum">×</button>
        <div class="gallery-lightbox-media" :class="`tone-${selectedAlbum.tone}`">
          <span>Álbum oficial será carregado aqui</span>
        </div>
        <div class="gallery-lightbox-copy">
          <span>{{ selectedAlbum.category }} · {{ selectedAlbum.year }} · {{ selectedAlbum.count }} fotos</span>
          <h3>{{ selectedAlbum.title }}</h3>
          <p>{{ selectedAlbum.description }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
