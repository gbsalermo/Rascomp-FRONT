<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import MediaFooterEditor from './MediaFooterEditor.vue'
import MediaImageAdjustment from './MediaImageAdjustment.vue'
import { originalHeroSeeds, originalAwardSeeds, originalEventSeeds, existingRobotCategorySeeds, type SeedHero } from '../content/landingEditorialSeeds'

type MediaPhoto = { id: number; name: string; src?: string; tone: number; albums: number[]; published: boolean; sourcePath?: string }
type Album = { id: number; name: string; description: string; coverId?: number }
type Award = { id: number; sourceId?: string; title: string; place: string; event: string; year: string; detail: string; photoId?: number; existing: boolean; active: boolean }
type EditorialEvent = { id: string; sourceId?: string; title: string; date: string; endDate: string; description: string; location: string; type: string; photoId?: number; existing: boolean; active: boolean }
type Sponsor = { id: number; photoId?: number; url: string; zoom: number }
type PickTarget = 'hero' | 'about' | 'board' | 'volunteer' | 'award' | 'robots-banner' | 'robot' | 'robot-change' | 'event' | 'sponsor' | 'sponsor-change' | 'competition-section' | 'competition-hero'

const props = defineProps<{ photos: MediaPhoto[]; albums: Album[]; uploadPhoto: (file: File) => number }>()
const sections = [
  { name: 'Intro / Heroes', description: 'Imagens e publicações com links para álbuns ou eventos', icon: '✦' },
  { name: 'Sobre', description: 'Sequência de fotos; texto institucional preservado', icon: '▧' },
  { name: 'Equipe e conquistas', description: 'Diretoria, voluntários e premiações', icon: '♜' },
  { name: 'Robôs', description: 'Banner e fotos por categoria', icon: '⚙' },
  { name: 'Eventos', description: 'Agenda, informações e imagens de eventos', icon: '▦' },
  { name: 'Patrocinadores', description: 'Logos, links e ordem do carrossel', icon: '◇' },
  { name: 'Competição', description: 'Hero competitivo: elementos extras sem sobrescrever a API', icon: '★' },
  { name: 'Footer', description: 'Contatos, links e informações atualizáveis', icon: '▤' }
]
const section = ref('Intro / Heroes')
const existingBoardIds = props.photos.filter(p => p.sourcePath?.includes('/assets/team/board/')).sort((a,b)=>(a.sourcePath||'').localeCompare(b.sourcePath||'', 'pt-BR',{numeric:true})).map(p=>p.id)
const existingVolunteerIds = props.photos.filter(p => p.sourcePath?.includes('/assets/team/volunteers/')).sort((a,b)=>(a.sourcePath||'').localeCompare(b.sourcePath||'','pt-BR',{numeric:true})).map(p=>p.id)
const existingSponsorIds = props.photos.filter(p => p.sourcePath?.includes('/assets/footer/partners/')).map(p=>p.id)
const board = ref([
  { role: 'Presidente', photoId: existingBoardIds[0] },
  { role: 'Vice-presidente', photoId: existingBoardIds[1] },
  { role: 'Tesoureiro', photoId: existingBoardIds[2] },
  { role: 'Secretário', photoId: existingBoardIds[3] },
  { role: 'Marketing', photoId: existingBoardIds[4] },
  { role: 'Orientador', photoId: existingBoardIds[5] }
])
const aboutPhotos = ref<number[]>(props.photos.filter(item=>item.sourcePath?.includes('/assets/about/')).sort((a,b)=>(a.sourcePath||'').localeCompare(b.sourcePath||'','pt-BR',{numeric:true})).map(item=>item.id))
const volunteerPhotos = ref<number[]>(existingVolunteerIds.slice(0,12))
const VOLUNTEER_LIMIT = 12
const sponsors = ref<Sponsor[]>(existingSponsorIds.slice(0,12).map((photoId,i)=>({id:i+1,photoId,url:'',zoom:100})))
const SPONSOR_LIMIT = 12
const awards = ref<Award[]>(originalAwardSeeds.map(item=>({...item})))
const events = ref<EditorialEvent[]>(originalEventSeeds.map(item=>{
  const matchingFile = item.id==='rcx-2026' ? '/rcx.jpg' : item.id==='rrc-2026' ? '/rrc.jpeg' : '/congresso.png'
  return {...item, photoId:props.photos.find(p=>p.sourcePath?.endsWith(matchingFile))?.id}
}))
const categories = existingRobotCategorySeeds
const robotCategory = ref<string>('sumo')
const robotTitles = ref<Record<number,string>>({})
const robotTitleLocations = ref<Record<number,'below'|'overlay'>>({})
type ImageAdjustment = {zoom:number;width:number;height:number;x:number;y:number;fit:'cover'|'contain'}
const imageAdjustments = ref<Record<string,ImageAdjustment>>({})
const activeAdjustmentKey = ref('')
const activeAdjustmentSrc = ref('')
const adjustmentOpen = ref(false)
const adjustmentLabel = ref('')
function defaultFrame(key:string): ImageAdjustment {
  const natural = key.startsWith('robot-banner') || key.startsWith('sponsor:') || key.startsWith('board:') || key.startsWith('volunteer:') || key.startsWith('about:')
  return {zoom:100,width:100,height:100,x:50,y:50,fit:natural?'contain':'cover'}
}
function frameFor(key:string): ImageAdjustment {
  return imageAdjustments.value[key] ?? defaultFrame(key)
}
function frameStyle(key:string) {
  const frame=frameFor(key)
  return {
    objectFit:frame.fit,
    objectPosition:frame.x+'% '+frame.y+'%',
    width:frame.width+'%',
    height:frame.height+'%',
    maxWidth:'none',
    maxHeight:'none',
    transform:`translate(${(frame.x-50)*.7}%,${(frame.y-50)*.7}%) scale(${frame.zoom/100})`
  }
}
function openAdjustment(key:string,id:number|undefined,label:string,sourceUrl?:string) {
  const src=sourceUrl || photo(id)?.src
  if (!src) {ElMessage.warning('Escolha uma imagem antes de ajustar o enquadramento.');return}
  activeAdjustmentKey.value=key
  activeAdjustmentSrc.value=src
  adjustmentLabel.value=label
  adjustmentOpen.value=true
}
function saveAdjustment(value:ImageAdjustment) {
  imageAdjustments.value={...imageAdjustments.value,[activeAdjustmentKey.value]:value}
  ElMessage.success('Enquadramento salvo nesta prévia local.')
}
function robotLabel(id:number) {
  const original=photo(id)?.name || ''
  return (robotTitles.value[id] ?? original.replace(/\.[^.]+$/,'').replace(/^\d+[\s_-]*/,'').replace(/[-_]+/g,' ').trim()).trim()
}
const initialRobotPhotos = (key: string) => props.photos
  .filter(item => item.sourcePath?.includes('/assets/robots/' + key + '/'))
  .filter(item => !item.sourcePath?.includes('/assets/robots/banners/'))
  .map(item => item.id)
const robotPhotos = ref<Record<string, number[]>>({
  sumo: initialRobotPhotos('sumo'),
  'mini-sumo': initialRobotPhotos('mini-sumo'),
  hockey: initialRobotPhotos('hockey'),
  'follow-line': initialRobotPhotos('follow-line')
})
const robotBannerId = ref<number | undefined>(props.photos.find(item=>item.sourcePath?.includes('/assets/robots/banners/'))?.id)
// Conteúdo vigente da Landing pré-carregado para editar apenas na prévia local.
type EditableHero = SeedHero & { photoId?: number; albumId?: number; showButton: boolean }
const heroes = ref<EditableHero[]>(originalHeroSeeds.map(item => ({...item,showButton:true})))
const selectedHeroId = ref<string>(heroes.value[0]?.id || '')
const selectedHero = computed(() => heroes.value.find(item => item.id === selectedHeroId.value))
const selectedHeroIndex = computed(() => heroes.value.findIndex(item => item.id === selectedHeroId.value))
const heroPreviewUrl = computed(() => photo(selectedHero.value?.photoId)?.src || legacyImagePath(selectedHero.value?.imagePath))
const badHeroImageUrls = ref<Set<string>>(new Set())
function onHeroImageError() { if (heroPreviewUrl.value) badHeroImageUrls.value.add(heroPreviewUrl.value) }
function addHero() {
  const id = 'editorial-' + Date.now()
  heroes.value.push({
    id, sourceId: id, existing: false, eyebrow: 'Novidade da RAS', title: '',
    description: '', button: 'Ver mais', destination: 'gallery',
    target: '', imagePath: '', active: true, showButton: true
  })
  selectedHeroId.value = id
}
async function removeHero() {
  if (!selectedHero.value) return
  try {
    await ElMessageBox.confirm('Remover este Hero somente da prévia local?', 'Remover Hero', {type:'warning',confirmButtonText:'Remover',cancelButtonText:'Cancelar'})
  } catch { return }
  const index=selectedHeroIndex.value
  heroes.value.splice(index,1)
  selectedHeroId.value = heroes.value[Math.min(index,heroes.value.length-1)]?.id || ''
}
function reorderHero(delta: number) { move(heroes.value,selectedHeroIndex.value,delta) }
function restoreHero() {
  const current = selectedHero.value
  if (!current || !current.existing) return
  const original = originalHeroSeeds.find(item => item.sourceId===current.sourceId)
  if (original) {
    Object.assign(current, {...original, photoId:undefined,showButton:true})
    ElMessage.success('Hero restaurado para título, texto, botão, imagem e estado originais nesta prévia.')
  }
}
function legacyImagePath(path: string | undefined) {
  if (!path || !path.startsWith('/media/assets/')) return ''
  if (import.meta.env.DEV) return '/__rascomp_landing_media/' + path.slice('/media/assets/'.length)
  return 'https://rasufrb.site' + path
}
function restoreMissingOriginalHeroes() {
  const absent = originalHeroSeeds.filter(item => !heroes.value.some(hero => hero.sourceId===item.sourceId))
  if (!absent.length) { ElMessage.info('Todos os Heroes originais já estão na lista.'); return }
  for (const item of absent) heroes.value.push({...item,showButton:true})
  selectedHeroId.value=absent[0]?.id || selectedHeroId.value
  ElMessage.success(absent.length+' slide(s) original(is) restaurado(s) na prévia.')
}
const competitionBannerId = ref<number | undefined>()
const competitionHeroPhotoId = ref<number | undefined>()
const competitionHeroEnabled = ref(false)
const competitionHeroEffective = computed(()=>competitionHeroEnabled.value)
// Esta opção controla APENAS o Hero; a competição/API e sua seção são independentes.
// A aplicação da regra na Landing requer CMS persistente, fora deste checkpoint.
const competitionText = ref('')
const competitionHeroSubtitle = ref('Participe de mais uma edição da nossa competição!')
const competitionHeroDescription = ref('Acompanhe a programação e conheça as atividades desta edição.')
const competitionHeroShowExtra = ref(false)
const competitionHeroExtraLabel = ref('Veja também')
const competitionHeroExtraDestination = ref<'competition'|'gallery'|'events'>('competition')
const pickerOpen = ref(false)
const pickTarget = ref<PickTarget>('hero')
const pickIndex = ref(0)
const pickFilter = ref('all')
const pickSearch = ref('')
const visiblePhotos = computed(() => props.photos.filter(p => {
  const q = p.name.toLocaleLowerCase('pt-BR').includes(pickSearch.value.toLocaleLowerCase('pt-BR'))
  return q && (pickFilter.value === 'all' || (pickFilter.value === 'none' ? !p.albums.length : p.albums.includes(Number(pickFilter.value))))
}))

function photo(id?: number) { return props.photos.find(item => item.id === id) }
function openPicker(target: PickTarget, index = 0) {
  if (target === 'volunteer' && volunteerPhotos.value.length >= VOLUNTEER_LIMIT) {
    ElMessage.warning('Limite de 12 imagens para o carrossel de voluntários.'); return
  }
  if (target === 'sponsor' && sponsors.value.length >= SPONSOR_LIMIT) {
    ElMessage.warning('Limite de 12 patrocinadores no carrossel.'); return
  }
  pickTarget.value = target
  pickIndex.value = index
  pickFilter.value = 'all'
  pickSearch.value = ''
  pickerOpen.value = true
}
function selectPhoto(id: number) {
  if (pickTarget.value === 'volunteer' && volunteerPhotos.value.length >= VOLUNTEER_LIMIT) return
  if (pickTarget.value === 'sponsor' && sponsors.value.length >= SPONSOR_LIMIT) return
  switch (pickTarget.value) {
    case 'hero': if (selectedHero.value) selectedHero.value.photoId = id; break
    case 'about': aboutPhotos.value.push(id); break
    case 'board': board.value[pickIndex.value]!.photoId = id; break
    case 'volunteer': volunteerPhotos.value.push(id); break
    case 'award': { const a = awards.value[pickIndex.value]; if (a) a.photoId = id; break }
    case 'robots-banner': robotBannerId.value = id; break
    case 'robot': robotPhotos.value[robotCategory.value]!.push(id); break
    case 'robot-change': {
      const items = robotPhotos.value[robotCategory.value]
      const current = items?.[pickIndex.value]
      if (current !== undefined) {
        robotTitles.value[id] = robotTitles.value[current] || photo(current)?.name.replace(/\\.[^.]+$/,'') || ''
        items![pickIndex.value] = id
      }
      break
    }
    case 'event': { const e = events.value[pickIndex.value]; if (e) e.photoId = id; break }
    case 'sponsor': sponsors.value.push({ id: Date.now(), photoId: id, url: '', zoom: 100 }); break
    case 'sponsor-change': { const sponsor = sponsors.value[pickIndex.value]; if (sponsor) sponsor.photoId = id; break }
    case 'competition-section': competitionBannerId.value = id; break
    case 'competition-hero': competitionHeroPhotoId.value = id; break
  }
  pickerOpen.value = false
}
function directUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  const multi = ['about','volunteer','robot','sponsor'].includes(pickTarget.value)
  for (const file of multi ? files : files.slice(0,1)) {
    const id = props.uploadPhoto(file)
    if (id) selectPhoto(id)
    if (pickTarget.value === 'volunteer' && volunteerPhotos.value.length >= VOLUNTEER_LIMIT) break
    if (pickTarget.value === 'sponsor' && sponsors.value.length >= SPONSOR_LIMIT) break
  }
  input.value = ''
  if (files.length) ElMessage.info('As imagens foram adicionadas à prévia local da Biblioteca, sem envio à API.')
}
function move<T>(items: T[], index: number, delta: number) {
  const target = index + delta
  if (target < 0 || target >= items.length) return
  const [item] = items.splice(index, 1)
  if (item !== undefined) items.splice(target, 0, item)
}
function addAward() { awards.value.push({ id: Date.now(), title: '', place:'', event:'', year: String(new Date().getFullYear()), detail: '', existing:false, active:true }) }
function addEvent() { events.value.push({ id: 'event-'+Date.now(), title: '', date: '', endDate:'', description: '', location:'', type:'Participações', existing:false, active:true }) }
function applyPreview() { ElMessage.success('Alterações aplicadas na prévia local. Nenhum conteúdo foi publicado.') }
</script>

<template>
  <div class="media-landing-layout">
    <aside class="media-section-list" aria-label="Seções editáveis da Landing">
      <button v-for="item in sections" :key="item.name" type="button" :class="{active: section === item.name}" @click="section = item.name">
        <span>{{ item.icon }}</span><strong>{{ item.name }}</strong><small>{{ item.description }}</small>
      </button>
    </aside>
    <section class="media-panel media-section-editor">
      <span class="media-kicker">EDIÇÃO POR SEÇÃO · PRÉVIA LOCAL</span>
      <h2>{{ section }}</h2>
      <p>{{ sections.find(item => item.name === section)?.description }}.</p>

      <template v-if="section === 'Intro / Heroes'">
        <div class="editor-heading">
          <div><h3>Heroes da Intro</h3><p>Gerencie os slides que já existem na Landing e os novos destaques. Selecione um item para editar.</p></div>
          <div class="editor-inline-actions">
            <el-button size="small" @click="restoreMissingOriginalHeroes">Recuperar originais removidos</el-button>
            <el-button type="primary" plain @click="addHero">+ Adicionar Hero</el-button>
          </div>
        </div>
        <div class="editor-inventory">
          <button v-for="(item,index) in heroes" :key="item.id" type="button" class="editor-inventory-card" :class="{active:selectedHeroId===item.id}" @click="selectedHeroId=item.id">
            <span class="editor-inventory-counter">{{ index + 1 }}</span>
            <span class="editor-inventory-summary">
              <strong>{{ item.title || 'Novo Hero (sem título)' }}</strong>
              <small>{{ item.existing ? 'Já existe na Landing' : 'Novo destaque' }} · {{ item.active ? 'Ativo' : 'Desativado' }}</small>
            </span>
            <span class="editor-inventory-arrow">→</span>
          </button>
        </div>
        <div v-if="selectedHero" class="media-editor-block">
          <div class="editor-heading">
            <div><h3>Editar Hero {{ selectedHeroIndex + 1 }}</h3><p>{{ selectedHero.existing ? 'Baseado no slide atual da Landing' : 'Novo destaque editorial' }} · Alterações apenas na prévia.</p></div>
            <div class="editor-inline-actions">
              <el-button size="small" :disabled="selectedHeroIndex===0" @click="reorderHero(-1)">↑</el-button>
              <el-button size="small" :disabled="selectedHeroIndex===heroes.length-1" @click="reorderHero(1)">↓</el-button>
              <el-button v-if="selectedHero?.existing" size="small" @click="restoreHero">Restaurar original</el-button>
              <el-button size="small" type="danger" plain @click="removeHero">Remover</el-button>
            </div>
          </div>
          <div class="editor-hero-preview">
            <img v-if="heroPreviewUrl && !badHeroImageUrls.has(heroPreviewUrl)"
              :src="heroPreviewUrl" :style="frameStyle('hero:'+selectedHero.id)" @error="onHeroImageError" alt="Imagem selecionada do Hero" />
            <span v-else-if="heroPreviewUrl" class="editor-image-unavailable">Imagem original indisponível nesta prévia — você pode escolher outra da Biblioteca.</span>
            <div class="editor-hero-copy">
              <small>{{ selectedHero.eyebrow || 'DESTAQUE EDITORIAL' }}</small>
              <h3>{{ selectedHero.title || 'Título do Hero' }}</h3>
              <p>{{ selectedHero.description }}</p>
              <span v-if="selectedHero.showButton">{{ selectedHero.button || 'Ver mais' }} →</span>
            </div>
          </div>
          <div class="editor-actions">
            <el-button @click="openPicker('hero')">{{ selectedHero.photoId || selectedHero.imagePath ? 'Trocar imagem' : 'Escolher imagem' }}</el-button>
            <el-button :disabled="!heroPreviewUrl" @click="openAdjustment('hero:'+selectedHero.id,selectedHero.photoId,'Hero — '+selectedHero.title,heroPreviewUrl)">Ajustar imagem</el-button>
            <el-button v-if="selectedHero.photoId" @click="selectedHero.photoId=undefined">Restaurar imagem original</el-button>
            <span class="editor-photo-name">{{ photo(selectedHero.photoId)?.name || selectedHero.imagePath || 'Nenhuma imagem selecionada' }}</span>
          </div>
          <div class="editor-form-grid">
            <el-form-item label="Chamada superior"><el-input v-model="selectedHero.eyebrow" maxlength="50"/></el-form-item>
            <el-form-item label="Título"><el-input v-model="selectedHero.title" maxlength="120" show-word-limit/></el-form-item>
            <el-form-item v-if="selectedHero.showButton" label="Texto do botão"><el-input v-model="selectedHero.button" maxlength="40"/></el-form-item>
            <el-form-item v-if="selectedHero.showButton" label="Destino do botão"><el-select v-model="selectedHero.destination">
              <el-option value="album" label="Álbum da Galeria"/><el-option value="gallery" label="Galeria completa"/>
              <el-option value="event" label="Evento"/><el-option value="section" label="Seção da Landing"/>
            </el-select></el-form-item>
            <el-form-item v-if="selectedHero.showButton && selectedHero.destination === 'album'" label="Álbum de destino"><el-select v-model="selectedHero.target">
              <el-option v-for="album in albums" :key="album.id" :label="album.name" :value="String(album.id)"/>
            </el-select></el-form-item>
            <el-form-item v-else-if="selectedHero.showButton && selectedHero.destination === 'event'" label="Evento relacionado"><el-select v-model="selectedHero.target">
              <el-option v-for="event in events" :key="event.id" :label="event.title" :value="event.id"/>
            </el-select></el-form-item>
            <el-form-item v-else-if="selectedHero.showButton && selectedHero.destination === 'section'" label="Seção de destino"><el-select v-model="selectedHero.target">
              <el-option v-for="item in sections" :key="item.name" :label="item.name" :value="item.name"/>
            </el-select></el-form-item>
            <el-form-item label="Descrição" class="span-two"><el-input v-model="selectedHero.description" type="textarea" :rows="3" maxlength="300" show-word-limit /></el-form-item>
          </div>
          <div class="editor-switch-row">
            <el-switch v-model="selectedHero.showButton" active-text="Hero com botão" inactive-text="Hero sem botão" />
            <el-switch v-model="selectedHero.active" active-text="Hero ativo" inactive-text="Oculto na prévia" />
          </div>
        </div>
        <div v-else class="editor-empty">Nenhum Hero cadastrado nesta prévia. Clique em Adicionar Hero.</div>
      </template>

      <template v-else-if="section === 'Sobre'">
        <div class="editor-heading"><div><h3>Sequência de imagens</h3><p>Os textos da seção Sobre permanecem fixos. Organize a ordem das fotografias.</p></div><el-button type="primary" plain @click="openPicker('about')">+ Adicionar imagem</el-button></div>
        <div v-if="aboutPhotos.length" class="editor-image-grid">
          <article v-for="(id,i) in aboutPhotos" :key="i" class="editor-image-item">
            <div class="editor-image"><img v-if="photo(id)?.src" :src="photo(id)?.src" :style="frameStyle('about:'+id)" :alt="photo(id)?.name"/><span v-else>▧</span></div>
            <small>{{ photo(id)?.name || 'Foto de exemplo' }}</small>
            <el-button size="small" :disabled="!photo(id)?.src" @click="openAdjustment('about:'+id,id,'Sobre — foto '+(i+1))">Ajustar imagem</el-button>
            <div class="editor-inline-actions"><el-button size="small" :disabled="i===0" @click="move(aboutPhotos,i,-1)">↑</el-button><el-button size="small" :disabled="i===aboutPhotos.length-1" @click="move(aboutPhotos,i,1)">↓</el-button><el-button size="small" type="danger" text @click="aboutPhotos.splice(i,1)">Remover</el-button></div>
          </article>
        </div>
        <div v-else class="editor-empty">Nenhuma imagem selecionada. Adicione as fotos da sequência da seção Sobre.</div>
      </template>

      <template v-else-if="section === 'Equipe e conquistas'">
        <h3>Diretoria — cargos fixos</h3><p>Os seis cargos não podem ser alterados. Selecione apenas a fotografia de cada integrante.</p>
        <div class="editor-board-grid">
          <div v-for="(item,i) in board" :key="item.role" class="editor-board-card">
            <div class="editor-image"><img v-if="photo(item.photoId)?.src" :src="photo(item.photoId)?.src" :style="frameStyle('board:'+item.role)" :alt="item.role"/><span v-else>▧</span></div>
            <strong>{{ item.role }}</strong><div class="editor-inline-actions">
              <el-button size="small" @click="openPicker('board',i)">{{ item.photoId ? 'Trocar foto' : 'Selecionar foto' }}</el-button>
              <el-button size="small" :disabled="!photo(item.photoId)?.src" @click="openAdjustment('board:'+item.role,item.photoId,item.role)">Ajustar</el-button>
            </div>
          </div>
        </div>
        <div class="editor-heading editor-spaced"><div><h3>Voluntários</h3><p>Carrossel de fotografias. Máximo de {{ VOLUNTEER_LIMIT }} imagens.</p></div><el-button :disabled="volunteerPhotos.length >= VOLUNTEER_LIMIT" @click="openPicker('volunteer')">+ Adicionar foto ({{ volunteerPhotos.length }}/{{ VOLUNTEER_LIMIT }})</el-button></div>
        <div v-if="volunteerPhotos.length" class="editor-image-grid">
          <div v-for="(id,i) in volunteerPhotos" :key="i" class="editor-image-item"><div class="editor-image"><img v-if="photo(id)?.src" :src="photo(id)?.src" :style="frameStyle('volunteer:'+id)" :alt="photo(id)?.name"/><span v-else>▧</span></div><small>{{ photo(id)?.name }}</small><div class="editor-inline-actions"><el-button size="small" :disabled="!photo(id)?.src" @click="openAdjustment('volunteer:'+id,id,'Voluntário — '+(i+1))">Ajustar</el-button><el-button size="small" :disabled="i===0" @click="move(volunteerPhotos,i,-1)">↑</el-button><el-button size="small" :disabled="i===volunteerPhotos.length-1" @click="move(volunteerPhotos,i,1)">↓</el-button><el-button text type="danger" size="small" @click="volunteerPhotos.splice(i,1)">Remover</el-button></div></div>
        </div><div v-else class="editor-empty">Nenhuma foto de voluntários escolhida nesta prévia.</div>
        <div class="editor-heading editor-spaced"><div><h3>Conquistas e premiações</h3><p>Gerencie título, ano, detalhes, imagem e ordem de exibição.</p></div><el-button type="primary" plain @click="addAward">+ Adicionar conquista</el-button></div>
        <div v-for="(award,i) in awards" :key="award.id" class="editor-record">
          <div class="editor-record-title"><strong>{{ award.title || 'Nova conquista' }} <small class="editor-original-tag">{{ award.existing ? 'Na Landing atual' : 'Novo' }}</small></strong><div class="editor-inline-actions"><el-button size="small" :disabled="i===0" @click="move(awards,i,-1)">↑</el-button><el-button size="small" :disabled="i===awards.length-1" @click="move(awards,i,1)">↓</el-button><el-popconfirm title="Remover esta conquista da prévia?" @confirm="awards.splice(i,1)"><template #reference><el-button size="small" type="danger" text>Remover</el-button></template></el-popconfirm></div></div>
          <div class="editor-form-grid">
          <el-form-item label="Título"><el-input v-model="award.title" placeholder="Ex.: ERBASE — Follow Line"/></el-form-item>
          <el-form-item label="Ano"><el-input v-model="award.year" maxlength="9"/></el-form-item>
          <el-form-item label="Colocação"><el-input v-model="award.place" placeholder="Ex.: Campeão"/></el-form-item>
          <el-form-item label="Evento / Categoria"><el-input v-model="award.event"/></el-form-item>
          <el-form-item class="span-two" label="Descrição / detalhes"><el-input v-model="award.detail" type="textarea" :rows="2"/></el-form-item></div>
          <el-switch v-model="award.active" active-text="Exibir esta conquista" inactive-text="Oculta na prévia" />
          <div class="editor-actions"><el-button size="small" @click="openPicker('award',i)">{{ award.photoId ? 'Trocar imagem' : 'Escolher imagem' }}</el-button><el-button size="small" :disabled="!photo(award.photoId)?.src" @click="openAdjustment('award:'+award.id,award.photoId,'Conquista — '+award.title)">Ajustar imagem</el-button><span class="editor-photo-name">{{ photo(award.photoId)?.name || 'Sem foto' }}</span></div>
        </div><div v-if="!awards.length" class="editor-empty">Adicione uma conquista para organizar o conteúdo da Landing.</div>
      </template>

      <template v-else-if="section === 'Robôs'">
        <h3>Imagem principal da seção</h3><p>Banner que aparece acima das categorias na Landing.</p>
        <div class="editor-wide-image"><img v-if="photo(robotBannerId)?.src" :src="photo(robotBannerId)?.src" :style="frameStyle('robot-banner')" alt="Banner de robôs"/><span v-else>▧</span></div>
        <div class="editor-actions"><el-button @click="openPicker('robots-banner')">Escolher imagem principal</el-button>
          <el-button :disabled="!photo(robotBannerId)?.src" @click="openAdjustment('robot-banner',robotBannerId,'Banner da seção Robôs')">Ajustar imagem</el-button>
        </div>
        <div class="editor-heading editor-spaced"><div><h3>Fotos por categoria</h3><p>Selecione a categoria e organize as fotos que aparecerão no respectivo subálbum.</p></div></div>
        <div class="editor-category-tabs">
          <button v-for="item in categories" :key="item.key" :class="{active:robotCategory===item.key}" @click="robotCategory=item.key">{{ item.label }} <small>{{ robotPhotos[item.key]?.length || 0 }}</small></button>
        </div>
        <div class="editor-actions"><strong>{{ categories.find(c=>c.key===robotCategory)?.label }}</strong><el-button type="primary" plain @click="openPicker('robot')">+ Adicionar foto nesta categoria</el-button></div>
        <div v-if="robotPhotos[robotCategory]?.length" class="editor-image-grid">
          <div v-for="(id,i) in robotPhotos[robotCategory]" :key="id + '-' + i" class="editor-image-item">
            <div class="editor-image"><img v-if="photo(id)?.src" :src="photo(id)?.src" :alt="photo(id)?.name"/><span v-else>▧</span></div>
            <small>{{ photo(id)?.sourcePath ? 'Imagem atual da Landing' : 'Nova imagem' }}</small>
            <el-input :model-value="robotTitles[id] ?? photo(id)?.name.replace(/\\.[^.]+$/,'')" size="small" placeholder="Nome do robô"
              @update:model-value="robotTitles[id]=String($event)" />
            <div class="editor-inline-actions">
              <el-button size="small" @click="openPicker('robot-change',i)">Trocar foto</el-button>
              <el-button size="small" :disabled="i===0" @click="move(robotPhotos[robotCategory]!,i,-1)">↑</el-button>
              <el-button size="small" :disabled="i===(robotPhotos[robotCategory]?.length || 0)-1" @click="move(robotPhotos[robotCategory]!,i,1)">↓</el-button>
              <el-button size="small" text type="danger" @click="robotPhotos[robotCategory]!.splice(i,1)">Remover</el-button>
            </div>
          </div>
        </div><div v-else class="editor-empty">Ainda não há fotos associadas a esta categoria.</div>
      </template>

      <template v-else-if="section === 'Eventos'">
        <div class="editor-heading"><div><h3>Eventos da RAS</h3><p>Cadastre e ordene eventos com título, data, descrição e fotografia.</p></div><el-button type="primary" plain @click="addEvent">+ Adicionar evento</el-button></div>
        <div v-for="(event,i) in events" :key="event.id" class="editor-record">
          <div class="editor-record-title"><strong>{{ event.title || 'Novo evento' }} <small class="editor-original-tag">{{ event.existing ? 'Na Landing atual' : 'Novo' }}</small></strong><div class="editor-inline-actions"><el-button size="small" :disabled="i===0" @click="move(events,i,-1)">↑</el-button><el-button size="small" :disabled="i===events.length-1" @click="move(events,i,1)">↓</el-button><el-popconfirm title="Remover este evento da prévia?" @confirm="events.splice(i,1)"><template #reference><el-button text type="danger" size="small">Remover</el-button></template></el-popconfirm></div></div>
          <div class="editor-form-grid">
          <el-form-item label="Título"><el-input v-model="event.title"/></el-form-item>
          <el-form-item label="Data de início"><el-date-picker v-model="event.date" type="date" value-format="YYYY-MM-DD" style="width:100%" placeholder="Data inicial"/></el-form-item>
          <el-form-item label="Data de término"><el-date-picker v-model="event.endDate" type="date" value-format="YYYY-MM-DD" style="width:100%" placeholder="Data final"/></el-form-item>
          <el-form-item label="Local"><el-input v-model="event.location"/></el-form-item>
          <el-form-item label="Categoria"><el-select v-model="event.type"><el-option v-for="type in ['Participações','Oficinas','Palestras','Competições','Projeto Social']" :key="type" :label="type" :value="type"/></el-select></el-form-item>
          <el-form-item class="span-two" label="Descrição"><el-input v-model="event.description" type="textarea" :rows="2"/></el-form-item></div>
          <el-switch v-model="event.active" active-text="Exibir evento" inactive-text="Oculto na prévia" />
          <div class="editor-actions"><el-button size="small" @click="openPicker('event',i)">Escolher foto do evento</el-button><span class="editor-photo-name">{{ photo(event.photoId)?.name || 'Nenhuma foto selecionada' }}</span></div>
        </div><div v-if="!events.length" class="editor-empty">Nenhum evento editorial adicionado na prévia local.</div>
      </template>

      <template v-else-if="section === 'Patrocinadores'">
        <div class="editor-heading"><div><h3>Logos de patrocinadores</h3><p>Carrossel com até {{ SPONSOR_LIMIT }} logos; remova, reordene e ajuste o tamanho de cada uma.</p></div><el-button type="primary" plain :disabled="sponsors.length>=SPONSOR_LIMIT" @click="openPicker('sponsor')">+ Adicionar logo ({{ sponsors.length }}/{{ SPONSOR_LIMIT }})</el-button></div>
        <div v-for="(item,i) in sponsors" :key="item.id" class="editor-record">
          <div class="editor-record-title"><strong>Patrocinador {{ i+1 }}</strong><div class="editor-inline-actions"><el-button size="small" :disabled="i===0" @click="move(sponsors,i,-1)">↑</el-button><el-button size="small" :disabled="i===sponsors.length-1" @click="move(sponsors,i,1)">↓</el-button><el-button type="danger" text size="small" @click="sponsors.splice(i,1)">Remover</el-button></div></div>
          <div class="editor-sponsor-row"><div class="editor-sponsor-image"><img v-if="photo(item.photoId)?.src" :src="photo(item.photoId)?.src" :alt="photo(item.photoId)?.name" :style="{transform:'scale('+item.zoom/100+')'}"/><span v-else>▧</span></div>
            <div class="editor-sponsor-fields"><el-form-item label="Link (opcional)"><el-input v-model="item.url" placeholder="https://..."/></el-form-item><label>Zoom da logo: {{ item.zoom }}%</label><el-slider v-model="item.zoom" :min="60" :max="160"/></div></div>
          <el-button size="small" @click="openPicker('sponsor-change',i)">Trocar logo</el-button>
        </div><div v-if="!sponsors.length" class="editor-empty">Adicione logos da Biblioteca. Não serão usados automaticamente os logos institucionais do rodapé.</div>
      </template>

      <template v-else-if="section === 'Competição'">
        <div class="editor-info">
          O nome da competição, o estado das inscrições, o lote atual, as categorias e o botão principal vêm da API. A Gestão de Mídia complementa a apresentação, sem modificar os dados oficiais.
        </div>
        <h3>Imagem principal da seção Competição</h3>
        <div class="editor-wide-image">
          <img v-if="photo(competitionBannerId)?.src" :src="photo(competitionBannerId)?.src" alt="Imagem editorial da seção Competição"/>
          <span v-else>▧</span>
        </div>
        <div class="editor-actions">
          <el-button @click="openPicker('competition-section')">{{ competitionBannerId ? 'Trocar imagem da seção' : 'Escolher imagem da seção' }}</el-button>
          <el-button v-if="competitionBannerId" size="small" @click="competitionBannerId=undefined">Remover imagem</el-button>
        </div>
        <el-form-item label="Texto complementar da seção (opcional)" class="editor-spaced">
          <el-input v-model="competitionText" type="textarea" :rows="3" maxlength="350" show-word-limit
            placeholder="Informações editoriais adicionais que não são fornecidas pela API"/>
        </el-form-item>

        <div class="editor-heading editor-spaced">
          <div><h3>Hero competitivo na Intro</h3><p>Mesma composição visual da Intro, com título, lote e status protegidos e provenientes da API.</p></div>
          <el-switch v-model="competitionHeroEnabled" active-text="Ativo" inactive-text="Oculto" />
        </div>
        <div class="editor-hero-preview editor-hero-competition">
          <img v-if="photo(competitionHeroPhotoId)?.src" :src="photo(competitionHeroPhotoId)?.src" alt="Imagem escolhida para o Hero competitivo"/>
          <div class="editor-hero-copy">
            <small>STATUS DAS INSCRIÇÕES · API</small>
            <h3>Nome da competição (API)</h3>
            <p v-if="competitionHeroSubtitle">{{ competitionHeroSubtitle }}</p>
            <p v-if="competitionHeroDescription">{{ competitionHeroDescription }}</p>
            <div class="editor-competition-info-tags">
              <span>Lote atual · API</span><span>Categorias · API</span>
            </div>
            <div class="editor-competition-actions"><span>Botão principal · API</span><span v-if="competitionHeroShowExtra">{{ competitionHeroExtraLabel || 'Veja também' }} ↗</span></div>
          </div>
        </div>
        <p class="editor-competition-notice">Prévia estrutural: os rótulos “API” serão preenchidos pelos dados reais quando a integração estiver concluída. Não representam uma competição fictícia.</p>
        <div class="editor-actions">
          <el-button @click="openPicker('competition-hero')">{{ competitionHeroPhotoId ? 'Trocar foto do Hero' : 'Escolher foto do Hero' }}</el-button>
          <el-button v-if="competitionHeroPhotoId" size="small" @click="competitionHeroPhotoId=undefined">Remover foto</el-button>
          <span class="editor-photo-name">{{ photo(competitionHeroPhotoId)?.name || 'Nenhuma foto selecionada' }}</span>
        </div>
        <div class="editor-form-grid">
          <el-form-item label="Subtítulo adicional (opcional)">
            <el-input v-model="competitionHeroSubtitle" maxlength="130" show-word-limit/>
          </el-form-item>
          <el-form-item class="span-two" label="Descrição complementar (opcional)">
            <el-input v-model="competitionHeroDescription" type="textarea" :rows="2" maxlength="280" show-word-limit/>
          </el-form-item>
        </div>
        <div class="editor-competition-api-fields">
          <strong>Campos controlados pela API — somente leitura</strong>
          <span>Nome da competição · Status/inscrições · Lote atual · Categorias · Botão principal e seu destino</span>
        </div>
        <div class="editor-spaced">
          <el-switch v-model="competitionHeroShowExtra" active-text="Adicionar botão secundário" inactive-text="Sem botão secundário"/>
          <div v-if="competitionHeroShowExtra" class="editor-form-grid editor-spaced">
            <el-form-item label="Texto do botão adicional">
              <el-input v-model="competitionHeroExtraLabel" maxlength="40"/>
            </el-form-item>
            <el-form-item label="Destino do botão adicional">
              <el-select v-model="competitionHeroExtraDestination">
                <el-option label="Seção Competição" value="competition"/>
                <el-option label="Galeria" value="gallery"/>
                <el-option label="Eventos" value="events"/>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </template>

      <template v-else-if="section === 'Footer'">
        <MediaFooterEditor />
      </template>

      <div class="editor-footer"><el-button type="primary" @click="applyPreview">Aplicar na prévia local</el-button><span>Nenhum dado será salvo no banco ou publicado na Landing nesta fase.</span></div>
    </section>

    <el-dialog class="media-photo-picker-dialog" v-model="pickerOpen" title="Escolher imagem da Biblioteca" width="min(850px, 95vw)" append-to-body>
      <p class="editor-picker-help">Selecione uma das imagens já enviadas à Biblioteca. A imagem original será preservada.</p>
      <div class="editor-picker-uploader"><label>+ Enviar foto(s) do computador<input type="file" accept="image/*" multiple @change="directUpload" /></label><small>Também adiciona as fotos à Biblioteca nesta demonstração.</small></div>
      <div class="editor-picker-filters"><el-input v-model="pickSearch" clearable placeholder="Buscar imagem pelo nome"/>
        <el-select v-model="pickFilter" style="width:200px"><el-option label="Todas" value="all"/><el-option label="Sem álbum" value="none"/><el-option v-for="album in albums" :key="album.id" :label="album.name" :value="String(album.id)"/></el-select></div>
      <div v-if="visiblePhotos.length" class="editor-picker-grid">
        <button v-for="item in visiblePhotos" :key="item.id" @click="selectPhoto(item.id)" :title="item.name">
          <span class="editor-picker-thumb"><img v-if="item.src" :src="item.src" :alt="item.name"/><span v-else>▧</span></span>
          <small>{{ item.name }}</small>
        </button>
      </div>
      <div v-else class="editor-empty">Nenhuma foto encontrada. Adicione imagens na Biblioteca.</div>
      <template #footer><el-button @click="pickerOpen=false">Cancelar</el-button></template>
    </el-dialog>
  </div>
</template>

<style scoped>
.editor-inventory{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:7px 0 14px}
.editor-inventory-card{border:1px solid #e7dfe6;border-radius:10px;background:white;padding:12px;display:flex;align-items:center;gap:10px;text-align:left;cursor:pointer;min-width:0}
.editor-inventory-card.active{border-color:#aa1747;background:#fff4f7;box-shadow:0 0 0 1px #aa17472a}
.editor-inventory-counter{height:29px;width:29px;min-width:29px;display:grid;place-items:center;border-radius:8px;background:#f5ecf1;color:#ad1747;font-weight:850;font-size:12px}
.editor-inventory-summary{display:flex;flex-direction:column;gap:5px;min-width:0;flex:1}
.editor-inventory-summary strong{font-size:12px;line-height:1.35;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.editor-inventory-summary small{color:#8d818b;font-size:10px}
.editor-inventory-arrow{color:#ad1747}
@media(max-width:700px){.editor-inventory{grid-template-columns:1fr}}

.media-landing-layout{display:grid;grid-template-columns:260px minmax(0,1fr);gap:16px;align-items:start}
.media-section-list{display:flex;flex-direction:column;gap:8px}
.media-section-list button{border:1px solid #e8e2e7;background:#fff;border-radius:12px;min-height:68px;text-align:left;padding:12px 13px 12px 49px;position:relative;cursor:pointer;font:inherit}
.media-section-list button.active{border-color:#ce718f;background:#fff2f6}
.media-section-list button>span{position:absolute;left:16px;top:18px;color:#aa1747;font-size:21px}
.media-section-list strong,.media-section-list small{display:block}.media-section-list strong{font-size:13px}.media-section-list small{font-size:10px;line-height:1.45;color:#807582;margin-top:4px}
.media-panel{background:#fff;border:1px solid #e8e2e7;border-radius:14px}
.media-section-editor{padding:22px;min-width:0;display:flex;flex-direction:column;gap:8px}
.media-kicker{font-size:10px;letter-spacing:.12em;font-weight:850;color:#ad1747}
.media-section-editor h2{font-size:24px;letter-spacing:-.03em;margin:1px 0}
.media-section-editor h3{font-size:16px;margin:0 0 7px}.media-section-editor p{font-size:12px;line-height:1.6;color:#746976;margin:0 0 12px}
.media-editor-block{border-top:1px solid #eee7ed;padding-top:18px}
.editor-hero-preview{position:relative;overflow:hidden;min-height:205px;display:flex;align-items:center;border-radius:12px;background:linear-gradient(105deg,#29172e,#914565);margin:13px 0 11px;color:#fff}
.editor-hero-preview>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.editor-image-unavailable{position:absolute;top:10px;right:10px;max-width:280px;padding:7px 10px;background:#fff;color:#753950;font-size:10px;border-radius:7px;z-index:1}
.editor-hero-preview:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#241524ce,transparent);pointer-events:none}
.editor-hero-copy{position:relative;z-index:1;max-width:480px;padding:21px}
.editor-hero-copy small{font-size:10px;letter-spacing:.07em;color:#f7cadd}
.editor-hero-copy h3{font-size:clamp(17px,2vw,25px);margin:8px 0;color:#fff}
.editor-hero-copy p{color:#fff;opacity:.9;font-size:12px;line-height:1.5;margin-bottom:12px}
.editor-hero-copy span{background:#fff;color:#861641;display:inline-flex;padding:8px 12px;border-radius:6px;font-size:11px;font-weight:750}
.editor-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:12px 0}
.editor-photo-name{font-size:11px;color:#897e88;overflow-wrap:anywhere}
.editor-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 12px}
.editor-form-grid .span-two{grid-column:1/-1}
.editor-form-grid :deep(.el-form-item){min-width:0;display:flex;flex-direction:column;align-items:stretch}
.editor-form-grid :deep(.el-form-item__label){justify-content:flex-start}
.editor-original-tag{font-size:10px;font-weight:600;color:#ac4067;margin-left:8px}
.media-section-editor :deep(.el-button--primary:not(.is-plain)):not(.is-text){color:#fff!important;--el-button-text-color:#fff;--el-button-hover-text-color:#fff;--el-button-active-text-color:#fff}
.editor-switch-row{display:flex;align-items:center;gap:24px;flex-wrap:wrap;padding:10px 0}
.editor-hero-competition{min-height:230px}
.editor-competition-info-tags{display:flex;gap:7px;flex-wrap:wrap;margin:8px 0}
.editor-competition-info-tags span{padding:6px 9px;border:1px solid #ffffff80;border-radius:6px;background:#20132770;font-size:10px;color:#fff}
.editor-competition-actions{display:flex;gap:8px;flex-wrap:wrap}
.editor-competition-actions span{padding:8px 12px;background:#fff;border-radius:6px;color:#651737;font-size:11px;font-weight:750}
.editor-competition-notice{margin:8px 0!important;font-size:11px!important;color:#856e7d!important}
.editor-competition-api-fields{display:flex;flex-direction:column;gap:6px;padding:12px;background:#f8f4f7;border-radius:9px;border:1px solid #e8dbe5;font-size:11px;color:#655260}
.editor-competition-api-fields strong{font-size:12px}
.editor-heading{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.editor-heading h3{margin:0 0 3px}.editor-heading p{margin:0}
.editor-spaced{margin-top:25px}
.editor-image-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px;margin:12px 0}
.editor-image-item{padding:8px;border:1px solid #e8e3e8;border-radius:10px;min-width:0;overflow:hidden}
.editor-image{height:120px;background:#f7f5f7;border-radius:7px;display:grid;place-items:center;overflow:hidden;color:#ab92a2;font-size:35px}
.editor-image img,.editor-wide-image img,.editor-picker-thumb img{height:100%;width:100%;object-fit:contain}
.editor-image-item>small{display:block;font-size:10px;color:#786e79;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:8px 0}
.editor-inline-actions{display:flex;align-items:center;gap:4px;flex-wrap:wrap}
.editor-inline-actions :deep(.el-button){margin-left:0}
.editor-empty{margin:14px 0;border:1px dashed #dfd0da;background:#fbf8fa;border-radius:10px;color:#88778a;padding:36px 17px;text-align:center;font-size:12px}
.editor-board-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:10px 0}
.editor-board-card{padding:10px;border:1px solid #eee7eb;border-radius:11px;display:flex;flex-direction:column;gap:8px;min-width:0}
.editor-board-card strong{font-size:12px}
.editor-wide-image{height:185px;min-height:185px;max-height:185px;width:100%;min-width:0;border-radius:10px;border:1px dashed #dbccd7;background:#f7f4f7;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;color:#98758b;font-size:55px;margin:12px 0}
.editor-wide-image img{position:absolute;inset:0;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;display:block}
.editor-record{border:1px solid #e8e1e7;border-radius:11px;padding:15px;margin:9px 0;background:#fff}
.editor-record-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px}.editor-record-title strong{font-size:13px}
.editor-category-tabs{display:flex;gap:7px;flex-wrap:wrap;margin:12px 0}
.editor-category-tabs button{border:1px solid #e2d7df;border-radius:8px;background:#fff;color:#625361;padding:11px 14px;cursor:pointer;font-size:12px}
.editor-category-tabs button.active{border-color:#ad1747;background:#fff1f5;color:#a80f3e;font-weight:800}
.editor-category-tabs small{opacity:.65;margin-left:5px}
.editor-sponsor-row{display:grid;grid-template-columns:140px minmax(0,1fr);gap:20px}
.editor-sponsor-image{height:110px;background:#f7f5f7;border-radius:8px;overflow:hidden;display:grid;place-items:center}
.editor-sponsor-image img{width:100%;height:100%;object-fit:contain}
.editor-sponsor-fields label{font-size:12px;color:#766b76}
.editor-info{padding:12px;border-left:3px solid #a71947;background:#faf3f7;color:#715267;border-radius:5px;font-size:12px;line-height:1.6;margin:8px 0 17px}
.editor-footer{margin-top:23px;padding-top:17px;border-top:1px solid #eee5eb;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.editor-footer span{font-size:11px;color:#948691}
.editor-picker-help{font-size:12px;color:#827483}
.editor-picker-uploader{display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin:13px 0}
.editor-picker-uploader label{background:#ad1647;color:white;padding:11px 16px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:750}
.editor-picker-uploader input{display:none}
.editor-picker-uploader small{color:#8a7a87;font-size:11px}
.editor-picker-filters{display:flex;gap:10px;margin:10px 0 15px}
.editor-picker-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;max-height:400px;overflow:auto}
.editor-picker-grid button{border:1px solid #e8e0e7;border-radius:9px;background:#fff;overflow:hidden;padding:6px;text-align:left;min-width:0;cursor:pointer}
.editor-picker-grid button:hover{border-color:#ab1645}
.editor-picker-thumb{height:104px;display:grid;place-items:center;background:#f5f2f5;color:#a48c9a;font-size:26px;overflow:hidden}
.editor-picker-grid small{display:block;margin:8px 3px 3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
@media(max-width:1050px){.media-landing-layout{grid-template-columns:1fr}.media-section-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.editor-picker-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:640px){.media-section-list{grid-template-columns:1fr}.media-section-editor{padding:15px}.editor-board-grid,.editor-image-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.editor-form-grid{grid-template-columns:1fr}.editor-form-grid .span-two{grid-column:auto}.editor-sponsor-row{grid-template-columns:1fr}.editor-picker-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.editor-picker-filters{flex-wrap:wrap}}
</style>
