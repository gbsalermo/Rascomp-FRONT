<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { galleryCollection, galleryPreviewMode, demoGalleryMode } from '../data/localGalleryPreview'
import GalleryLightbox from '../components/GalleryLightbox.vue'

const route=useRoute()
const selectedIndex=ref<number|null>(null)
const album=computed(()=>galleryCollection.value.albums.find(item=>item.slug===route.params.slug))
const publicPhotos=computed(()=>album.value?.photos.filter(photo=>photo.published===true && !!photo.src)||[])
watch(()=>route.params.slug,()=>selectedIndex.value=null)
watch(publicPhotos,()=>{
  if(selectedIndex.value!==null && selectedIndex.value>=publicPhotos.value.length)selectedIndex.value=null
})
</script>

<template>
  <section class="album-page gallery-public-album">
    <div class="gallery-page-container">
      <div v-if="galleryPreviewMode" class="gallery-preview-ribbon" role="status">
        <strong>PRÉVIA LOCAL DA GALERIA</strong><span>Somente fotografias públicas · Nenhuma alteração foi publicada</span>
      </div>
      <template v-if="album">
        <RouterLink :to="{path:'/',query:{ver:'albuns'}}" class="album-back-link">← Todos os álbuns</RouterLink>
        <header class="album-heading gallery-album-hero">
          <div class="gallery-album-hero-copy">
            <span class="gallery-kicker">REGISTROS DA IEEE RAS UFRB</span>
            <h1>{{ album.title }}</h1>
            <p>{{ album.description || 'Uma coleção de momentos da equipe.' }}</p>
            <div class="gallery-album-hero-meta">
              <span>{{ publicPhotos.length }} {{ publicPhotos.length===1?'fotografia':'fotografias' }}</span>
              <span v-if="album.date">{{ album.date }}</span>
            </div>
          </div>
          <div v-if="album.cover" class="gallery-album-hero-cover">
            <img :src="album.cover" :alt="'Capa do álbum '+album.title"/>
          </div>
        </header>
        <div v-if="publicPhotos.length" class="gallery-photo-masonry">
          <button v-for="(photo,index) in publicPhotos" :key="photo.id" type="button"
            :aria-label="'Abrir fotografia '+(index+1)" class="gallery-photo-piece"
            @click="selectedIndex=index">
            <img :src="photo.src" :alt="photo.alt" loading="lazy" decoding="async"/>
          </button>
        </div>
        <div v-else class="gallery-public-empty">
          <div class="gallery-empty-symbol" aria-hidden="true">✳</div>
          <h2>Álbum sem fotografias públicas</h2>
          <p>Apenas imagens autorizadas para a Galeria ficam visíveis. Fotos internas não aparecem aqui.</p>
          <RouterLink to="/">Voltar para todas as fotos →</RouterLink>
        </div>
        <RouterLink to="/" class="gallery-album-footer-link">← Voltar à Galeria</RouterLink>
      </template>
      <div v-else class="gallery-public-empty gallery-album-not-found">
        <div class="gallery-empty-symbol" aria-hidden="true">✳</div>
        <h1>Álbum não encontrado</h1>
        <p>Este álbum não existe ou não possui fotografias publicadas.</p>
        <RouterLink to="/">Voltar para todas as fotos →</RouterLink>
      </div>
      <p v-if="demoGalleryMode && album" class="gallery-album-sample-disclaimer">Imagens ilustrativas desta fase de validação. O acervo público real será conectado após a aprovação.</p>
    </div>
    <GalleryLightbox :photos="publicPhotos" :selected-index="selectedIndex"
      @select="selectedIndex=$event" @close="selectedIndex=null"/>
  </section>
</template>
