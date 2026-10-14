<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { GalleryPhoto } from '../data/albums'

const props = defineProps<{
  photos: GalleryPhoto[]
  selectedIndex: number | null
  albumUrl?: string
}>()
const emit = defineEmits<{(event:'close'):void;(event:'select',index:number):void}>()
const closeButton = ref<HTMLButtonElement|null>(null)
const selected = computed(() => props.selectedIndex === null ? null : props.photos[props.selectedIndex] || null)
const count = computed(() => props.photos.length)
let oldOverflow = ''
function next(delta:number) {
  if (props.selectedIndex === null || !count.value) return
  emit('select',(props.selectedIndex+delta+count.value)%count.value)
}
function onKey(event:KeyboardEvent) {
  if (props.selectedIndex === null) return
  if (event.key==='Escape') { event.preventDefault(); emit('close') }
  if (event.key==='ArrowLeft') { event.preventDefault(); next(-1) }
  if (event.key==='ArrowRight') { event.preventDefault(); next(1) }
}
watch(()=>props.selectedIndex, async(index,previous)=>{
  if(index!==null && previous===null) {
    oldOverflow=document.body.style.overflow
    document.body.style.overflow='hidden'
    await nextTick()
    closeButton.value?.focus()
  } else if(index===null && previous!==null) {
    document.body.style.overflow=oldOverflow
  }
}, {immediate:true})
window.addEventListener('keydown',onKey)
onBeforeUnmount(()=>{
  window.removeEventListener('keydown',onKey)
  document.body.style.overflow=oldOverflow
})
</script>

<template>
  <div v-if="selected && selectedIndex!==null" class="gallery-viewer" role="dialog" aria-modal="true" aria-label="Visualização de fotografia"
    @click.self="emit('close')">
    <div class="gallery-viewer-top">
      <span>{{ selectedIndex+1 }} / {{ count }}</span>
      <button ref="closeButton" type="button" aria-label="Fechar fotografia" title="Fechar (Esc)" class="gallery-viewer-close" @click="emit('close')">✕</button>
    </div>
    <button v-if="count>1" type="button" class="gallery-viewer-control prev" aria-label="Fotografia anterior"
      title="Anterior (←)" @click="next(-1)">‹</button>
    <figure class="gallery-viewer-figure">
      <img v-if="selected.src" :src="selected.src" :alt="selected.alt"/>
      <figcaption>
        <span>IEEE RAS UFRB</span>
        <RouterLink v-if="albumUrl" :to="albumUrl" @click="emit('close')">Explorar álbum ↗</RouterLink>
      </figcaption>
    </figure>
    <button v-if="count>1" type="button" class="gallery-viewer-control next" aria-label="Próxima fotografia"
      title="Próxima (→)" @click="next(1)">›</button>
  </div>
</template>
