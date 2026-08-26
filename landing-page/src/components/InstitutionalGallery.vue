<script setup lang="ts">
import { computed, ref } from 'vue'

type GalleryFilter = 'Todos' | 'RRC' | 'Oficinas' | 'RAS nas Escolas' | 'Premiações' | 'Eventos'

type GalleryItem = {
  id: number
  title: string
  category: Exclude<GalleryFilter, 'Todos'>
  subtitle: string
  date: string
  tone: 'purple' | 'red' | 'neutral'
  layout: 'wide' | 'tall' | 'square'
}

const filters: GalleryFilter[] = ['Todos', 'RRC', 'Oficinas', 'RAS nas Escolas', 'Premiações', 'Eventos']
const activeFilter = ref<GalleryFilter>('Todos')
const selectedItem = ref<GalleryItem | null>(null)

const items: GalleryItem[] = [
  { id: 1, title: 'Equipe em competição', category: 'RRC', subtitle: 'Preparação e bastidores de uma edição do RRC.', date: '2026', tone: 'red', layout: 'wide' },
  { id: 2, title: 'Oficina de robótica', category: 'Oficinas', subtitle: 'Formação prática com eletrônica, programação e construção.', date: '2026', tone: 'purple', layout: 'tall' },
  { id: 3, title: 'RAS nas Escolas', category: 'RAS nas Escolas', subtitle: 'Extensão e aproximação com estudantes da educação básica.', date: '2026', tone: 'neutral', layout: 'square' },
  { id: 4, title: 'Premiação da equipe', category: 'Premiações', subtitle: 'Resultados que registram a evolução coletiva do capítulo.', date: '2025', tone: 'red', layout: 'square' },
  { id: 5, title: 'Participação institucional', category: 'Eventos', subtitle: 'Representação da RAS UFRB em atividades acadêmicas e tecnológicas.', date: '2025', tone: 'purple', layout: 'wide' },
  { id: 6, title: 'Robôs em pista', category: 'RRC', subtitle: 'Testes, competição e desenvolvimento técnico em equipe.', date: '2025', tone: 'neutral', layout: 'tall' },
  { id: 7, title: 'Formação de novos membros', category: 'Oficinas', subtitle: 'Atividades técnicas para aproximar novos estudantes da robótica.', date: '2025', tone: 'purple', layout: 'square' },
  { id: 8, title: 'Encontro com a comunidade', category: 'Eventos', subtitle: 'Troca de conhecimento, divulgação científica e integração.', date: '2025', tone: 'red', layout: 'square' }
]

const visibleItems = computed(() => {
  if (activeFilter.value === 'Todos') return items
  return items.filter((item) => item.category === activeFilter.value)
})

function openItem(item: GalleryItem) {
  selectedItem.value = item
}

function closeItem() {
  selectedItem.value = null
}
</script>

<template>
  <section id="galeria" class="institutional-gallery-section">
    <div class="institutional-gallery-container">
      <header class="institutional-gallery-heading">
        <div>
          <span>Galeria</span>
          <h2>Um pouco do que construímos, vivemos e compartilhamos.</h2>
          <p>Registros de competições, oficinas, ações de extensão, premiações e eventos da RAS UFRB.</p>
        </div>
        <a href="#eventos" class="gallery-view-more">Ver todas as atividades <span aria-hidden="true">→</span></a>
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

      <div class="gallery-mosaic" :class="{ filtered: activeFilter !== 'Todos' }">
        <button
          v-for="item in visibleItems"
          :key="item.id"
          type="button"
          class="gallery-card"
          :class="[`layout-${item.layout}`, `tone-${item.tone}`]"
          @click="openItem(item)"
        >
          <div class="gallery-image-placeholder" aria-hidden="true">
            <span>Foto oficial</span>
          </div>
          <div class="gallery-card-overlay">
            <span>{{ item.category }}</span>
            <div>
              <strong>{{ item.title }}</strong>
              <small>{{ item.date }}</small>
            </div>
          </div>
        </button>
      </div>

      <p class="gallery-note">As imagens atuais são placeholders. O layout já está pronto para receber o acervo oficial por evento e categoria.</p>
    </div>

    <div v-if="selectedItem" class="gallery-lightbox" role="dialog" aria-modal="true" :aria-label="selectedItem.title" @click.self="closeItem">
      <article class="gallery-lightbox-card">
        <button type="button" class="gallery-lightbox-close" aria-label="Fechar" @click="closeItem">×</button>
        <div class="gallery-lightbox-media" :class="`tone-${selectedItem.tone}`">
          <span>Imagem oficial será adicionada posteriormente</span>
        </div>
        <div class="gallery-lightbox-copy">
          <span>{{ selectedItem.category }} · {{ selectedItem.date }}</span>
          <h3>{{ selectedItem.title }}</h3>
          <p>{{ selectedItem.subtitle }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
