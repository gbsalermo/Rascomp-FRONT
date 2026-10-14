<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { galleryCollection, galleryPreviewMode } from '../data/localGalleryPreview'
import GalleryLightbox from '../components/GalleryLightbox.vue'
import type { GalleryPhoto } from '../data/albums'

const route = useRoute()
const router = useRouter()
type GalleryFilter = string
const currentFilter = ref<GalleryFilter>(route.query.ver === 'albuns' ? 'Álbuns' : 'Todas')
const collection = galleryCollection
const filters = computed<GalleryFilter[]>(()=>[
  'Todas','Álbuns',
  ...new Set(collection.value.albums.map(album=>album.category).filter(category=>category!=='Álbuns')),
])
const photos = computed<GalleryPhoto[]>(()=>collection.value.photos.filter(photo=>photo.published === true && !!photo.src))
const filteredPhotos = computed<GalleryPhoto[]>(()=>{
  if(currentFilter.value==='Todas')return photos.value
  const categoryIds = new Set(collection.value.albums
    .filter(album=>album.category===currentFilter.value)
    .flatMap(album=>album.photos.map(photo=>photo.id)))
  return photos.value.filter(photo=>categoryIds.has(photo.id))
})
const albums = computed(()=>collection.value.albums.filter(album=>album.photos.some(photo=>photo.published===true && !!photo.src)))
const previewCollage = computed(()=>{
  const byId=new Map(photos.value.map(photo=>[photo.id,photo]))
  const ordered=collection.value.featuredPhotoIds.map(id=>byId.get(id)).filter((p):p is GalleryPhoto=>Boolean(p))
  for(const photo of photos.value) {
    if(ordered.length===3)break
    if(!ordered.some(item=>item.id===photo.id)) ordered.push(photo)
  }
  return ordered.slice(0,3)
})
const selectedIndex = ref<number|null>(null)
const selectedPhoto = computed(()=>selectedIndex.value!==null ? filteredPhotos.value[selectedIndex.value] : null)
const selectedAlbumLink=computed(()=>{
  if(!selectedPhoto.value)return undefined
  const related=albums.value.find(album=>album.photos.some(photo=>photo.id===selectedPhoto.value?.id))
  return related ? '/albuns/'+related.slug : undefined
})
function chooseFilter(filter:GalleryFilter) {
  currentFilter.value=filter
  selectedIndex.value=null
  router.replace({path:'/',query:filter==='Álbuns' ? {ver:'albuns'} : {}})
}
watch(()=>route.query.ver, value=>{
  if(value==='albuns') currentFilter.value='Álbuns'
  else if(currentFilter.value==='Álbuns')currentFilter.value='Todas'
})
watch(filteredPhotos,()=>{
  if(selectedIndex.value!==null && selectedIndex.value>=filteredPhotos.value.length)selectedIndex.value=null
})
const filterLabel=(value:string)=>value==='RRC' ? 'Competições' : value==='Premiações' ? 'Conquistas' : value
</script>

<template>
  <section class="gallery-redesign gallery-public-home">
    <div class="gallery-page-container">
      <div v-if="galleryPreviewMode" class="gallery-preview-ribbon" role="status">
        <strong>PRÉVIA LOCAL DA GALERIA</strong>
        <span>Somente fotografias marcadas como públicas na Gestão · Nada foi publicado</span>
      </div>

      <header class="gallery-redesign-intro gallery-editorial-intro">
        <div class="gallery-editorial-copy">
          <span class="gallery-kicker">IEEE Robotics & Automation Society · UFRB</span>
          <h1>Momentos que<br><em>contam histórias.</em></h1>
          <p>Um olhar sobre o que construímos juntos: competições, oficinas, encontros e experiências com a robótica.</p>
          <div class="gallery-intro-stats" aria-label="Conteúdo da galeria">
            <span><strong>{{ photos.length }}</strong> {{ photos.length===1 ? 'fotografia' : 'fotografias' }}</span>
            <span><strong>{{ albums.length }}</strong> {{ albums.length===1 ? 'álbum' : 'álbuns' }}</span>
            <span v-if="!galleryPreviewMode" class="gallery-intro-demo-label">Exemplos ilustrativos</span>
          </div>
        </div>
        <div v-if="previewCollage.length" class="gallery-hero-collage gallery-editorial-collage" :class="'count-'+previewCollage.length" aria-hidden="true">
          <div v-for="(item,index) in previewCollage" :key="item.id" :class="'collage-'+index">
            <img :src="item.src" alt="" />
          </div>
        </div>
        <div v-else class="gallery-editorial-placeholder" aria-hidden="true">
          <span>✳</span><strong>IEEE RAS</strong><small>Nossas memórias</small>
        </div>
      </header>

      <div class="gallery-collection-heading">
        <div>
          <span class="gallery-kicker">EXPLORE NOSSO ACERVO</span>
          <h2>{{ currentFilter==='Álbuns' ? 'Coleções e álbuns' : currentFilter==='Todas' ? 'Todas as fotografias' : filterLabel(currentFilter) }}</h2>
          <p>{{ currentFilter==='Álbuns' ? 'Descubra as fotografias reunidas por atividade e ocasião.' : 'Fotografias que fazem parte da história da RAS UFRB.' }}</p>
        </div>
        <span class="gallery-collection-counter">{{ currentFilter==='Álbuns' ? albums.length : filteredPhotos.length }} {{ currentFilter==='Álbuns' ? 'coleções' : 'fotografias' }}</span>
      </div>
      <nav class="gallery-filter-bar gallery-editorial-filters" aria-label="Filtrar fotografias">
        <button v-for="filter in filters" :key="filter" type="button"
          :aria-pressed="currentFilter===filter" :class="{active:currentFilter===filter}"
          @click="chooseFilter(filter)">{{ filterLabel(filter) }}</button>
      </nav>

      <div v-if="currentFilter==='Álbuns' && albums.length" class="gallery-editorial-albums">
        <RouterLink v-for="album in albums" :key="album.slug" :to="'/albuns/'+album.slug" class="gallery-editorial-album">
          <div class="gallery-editorial-album-art">
            <img v-if="album.cover" :src="album.cover" :alt="'Capa do álbum '+album.title" loading="lazy"/>
            <div v-else class="gallery-editorial-album-placeholder" aria-hidden="true">✳</div>
            <span class="gallery-album-count">{{ album.photos.length }} {{ album.photos.length===1 ? 'foto' : 'fotos' }}</span>
          </div>
          <div class="gallery-editorial-album-info">
            <h3>{{ album.title }}</h3>
            <p>{{ album.description || 'Momentos registrados pela equipe.' }}</p>
            <span>Explorar álbum <span aria-hidden="true">↗</span></span>
          </div>
        </RouterLink>
      </div>

      <div v-else-if="currentFilter!=='Álbuns' && filteredPhotos.length" class="gallery-photo-masonry">
        <button v-for="(photo,index) in filteredPhotos" :key="photo.id"
          type="button" class="gallery-photo-piece" :aria-label="'Abrir fotografia '+(index+1)"
          @click="selectedIndex=index">
          <img v-if="photo.src" :src="photo.src" :alt="photo.alt" loading="lazy" decoding="async"/>
        </button>
      </div>

      <div v-else class="gallery-public-empty">
        <div class="gallery-empty-symbol" aria-hidden="true">✳</div>
        <h3>{{ galleryPreviewMode ? 'Nenhuma foto pública nesta prévia' : 'Novas memórias estão a caminho' }}</h3>
        <p>{{ galleryPreviewMode
          ? 'Na Biblioteca, marque uma foto como pública e clique em “Prévia da Galeria”. Fotos privadas e fotos usadas somente na Landing ficam de fora.'
          : 'Ainda não há fotografias disponíveis nesta seleção. Explore outras categorias ou volte em breve.' }}</p>
        <button v-if="currentFilter!=='Todas'" type="button" @click="chooseFilter('Todas')">Ver todas as fotos →</button>
      </div>

      <div v-if="!galleryPreviewMode" class="gallery-sample-notice">
        <span>Prévia de interface</span>
        <p>As imagens exibidas nesta fase são ilustrativas. O acervo real será carregado somente após a publicação autorizada na Gestão de Mídia.</p>
      </div>
    </div>
    <GalleryLightbox :photos="filteredPhotos" :selected-index="selectedIndex" :album-url="selectedAlbumLink"
      @select="selectedIndex=$event" @close="selectedIndex=null"/>
  </section>
</template>
