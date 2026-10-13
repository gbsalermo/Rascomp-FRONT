<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { albums, type GalleryCategory, type GalleryPhoto } from '../data/albums'

type Filter = 'Todas' | 'Álbuns' | GalleryCategory
type VisiblePhoto = { photo: GalleryPhoto; albumSlug: string; albumTitle: string; category: GalleryCategory }
const route = useRoute()
const router = useRouter()
const activeFilter = ref<Filter>(route.query.ver === 'albuns' ? 'Álbuns' : 'Todas')
const filters: Filter[] = ['Todas', 'Álbuns', 'RRC', 'Oficinas', 'RAS nas Escolas', 'Premiações', 'Eventos']
const allPhotos = computed<VisiblePhoto[]>(() => {
  const unique = new Map<string, VisiblePhoto>()
  for (const album of albums) {
    for (const photo of album.photos) {
      if (!unique.has(photo.id)) unique.set(photo.id, {
        photo, albumSlug: album.slug, albumTitle: album.title, category: album.category
      })
    }
  }
  return [...unique.values()]
})
const filteredPhotos = computed(() =>
  activeFilter.value === 'Todas'
    ? allPhotos.value
    : allPhotos.value.filter(item => item.category === activeFilter.value)
)
const visibleAlbums = computed(() => albums)
const selectedIndex = ref<number|null>(null)
const selected = computed(() =>
  selectedIndex.value === null ? null : filteredPhotos.value[selectedIndex.value] || null
)
function setFilter(value: Filter) {
  activeFilter.value = value
  selectedIndex.value = null
  if (value === 'Álbuns') router.replace({path:'/',query:{ver:'albuns'}})
  else if (route.query.ver) router.replace({path:'/'})
}
watch(() => route.query.ver, ver => {
  if (ver === 'albuns') activeFilter.value = 'Álbuns'
  else if (activeFilter.value === 'Álbuns') activeFilter.value = 'Todas'
})
function previousPhoto() {
  if (selectedIndex.value === null || !filteredPhotos.value.length) return
  selectedIndex.value = (selectedIndex.value - 1 + filteredPhotos.value.length) % filteredPhotos.value.length
}
function nextPhoto() {
  if (selectedIndex.value === null || !filteredPhotos.value.length) return
  selectedIndex.value = (selectedIndex.value + 1) % filteredPhotos.value.length
}
</script>

<template>
  <div class="gallery-home-page gallery-redesign">
    <div class="gallery-page-container">
      <header class="gallery-redesign-intro">
        <div>
          <span class="gallery-kicker">Registros da nossa trajetória</span>
          <h1>Nossa história<br>em imagens.</h1>
          <p>Competições, oficinas, projetos e conquistas que fazem parte da trajetória da IEEE RAS UFRB.</p>
        </div>
        <div class="gallery-hero-collage" aria-hidden="true">
          <img v-for="(item,index) in allPhotos.slice(0,3)" :key="item.photo.id" :class="'collage-' + index"
            :src="item.photo.src" alt="" />
        </div>
      </header>

      <div class="gallery-redesign-section-title">
        <div><span class="gallery-kicker">ACERVO FOTOGRÁFICO</span><h2>{{ activeFilter === 'Álbuns' ? 'Explore os álbuns' : 'Todas as fotos' }}</h2></div>
        <span>{{ activeFilter === 'Álbuns' ? visibleAlbums.length + ' álbuns ilustrativos' : filteredPhotos.length + ' imagens ilustrativas' }}</span>
      </div>

      <div class="gallery-filter-bar gallery-redesign-filters" aria-label="Filtrar a galeria">
        <button v-for="filter in filters" :key="filter" type="button"
          :class="{active:activeFilter===filter}" @click="setFilter(filter)">
          {{ filter === 'RRC' ? 'Competições' : filter === 'Premiações' ? 'Conquistas' : filter }}
        </button>
      </div>

      <div v-if="activeFilter === 'Álbuns'" class="gallery-index-grid">
        <article v-for="album in visibleAlbums" :key="album.slug" class="gallery-index-card">
          <RouterLink :to="'/albuns/' + album.slug" class="gallery-index-media" :aria-label="'Abrir álbum ' + album.title">
            <img v-if="album.cover" :src="album.cover" :alt="'Capa demonstrativa de ' + album.title" />
            <span v-else class="gallery-placeholder-cover">{{ album.title }}</span>
          </RouterLink>
          <div class="gallery-index-copy">
            <span class="gallery-category-pill">{{ album.category }}</span>
            <h2>{{ album.title }}</h2>
            <p>{{ album.description }}</p>
            <div class="gallery-redesign-card-bottom"><span>{{ album.photos.length }} imagens</span><RouterLink :to="'/albuns/' + album.slug">Ver álbum →</RouterLink></div>
          </div>
        </article>
      </div>
      <div v-else-if="filteredPhotos.length" class="gallery-all-photos">
        <button v-for="(item,index) in filteredPhotos" :key="item.photo.id" class="gallery-all-photo"
          :aria-label="'Ampliar ' + item.photo.alt" @click="selectedIndex = index">
          <img v-if="item.photo.src" :src="item.photo.src" :alt="item.photo.alt" loading="lazy" />
          <span v-else class="gallery-placeholder-cover">{{ item.albumTitle }}</span>
          <span class="gallery-all-photo-caption"><strong>{{ item.albumTitle }}</strong><small>{{ item.category }}</small></span>
        </button>
      </div>
      <p v-else class="gallery-development-note">Ainda não existem fotos publicadas neste filtro.</p>

      <p class="gallery-redesign-disclaimer">Interface de demonstração local — imagens ilustrativas. A integração com a Biblioteca e o acervo publicado será realizada na próxima etapa.</p>
    </div>

    <div v-if="selected && selectedIndex !== null" class="gallery-lightbox" role="dialog" aria-modal="true" :aria-label="selected.photo.alt" @keydown.esc="selectedIndex = null">
      <button type="button" class="lightbox-close" aria-label="Fechar foto" @click="selectedIndex = null">×</button>
      <button type="button" class="lightbox-arrow previous" aria-label="Foto anterior" @click="previousPhoto">‹</button>
      <div class="lightbox-content">
        <img v-if="selected.photo.src" :src="selected.photo.src" :alt="selected.photo.alt"/>
        <p>{{ selectedIndex + 1 }} / {{ filteredPhotos.length }} · {{ selected.albumTitle }}</p>
        <RouterLink class="gallery-lightbox-album-link" :to="'/albuns/' + selected.albumSlug">Ver álbum →</RouterLink>
      </div>
      <button type="button" class="lightbox-arrow next" aria-label="Próxima foto" @click="nextPhoto">›</button>
    </div>
  </div>
</template>
