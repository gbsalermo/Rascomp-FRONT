<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

type MediaPhoto = { id: number; name: string; src?: string; tone: number; albums: number[]; published: boolean }
type Album = { id: number; name: string; description: string; coverId?: number }
type Award = { id: number; title: string; year: string; detail: string; photoId?: number }
type Event = { id: number; title: string; date: string; description: string; photoId?: number }
type Sponsor = { id: number; photoId?: number; url: string; zoom: number }
type PickTarget = 'hero' | 'about' | 'board' | 'volunteer' | 'award' | 'robots-banner' | 'robot' | 'event' | 'sponsor' | 'competition-section' | 'competition-hero'

const props = defineProps<{ photos: MediaPhoto[]; albums: Album[]; uploadPhoto: (file: File) => number }>()
const sections = [
  { name: 'Intro / Heroes', description: 'Imagens e publicações com links para álbuns ou eventos', icon: '✦' },
  { name: 'Sobre', description: 'Sequência de fotos; texto institucional preservado', icon: '▧' },
  { name: 'Equipe e conquistas', description: 'Diretoria, voluntários e premiações', icon: '♜' },
  { name: 'Robôs', description: 'Banner e fotos por categoria', icon: '⚙' },
  { name: 'Eventos', description: 'Agenda, informações e imagens de eventos', icon: '▦' },
  { name: 'Patrocinadores', description: 'Logos, links e ordem do carrossel', icon: '◇' },
  { name: 'Competição', description: 'Conteúdo editorial separado dos dados da API', icon: '★' }
]
const section = ref('Intro / Heroes')
const board = ref([
  { role: 'Presidente', photoId: undefined as number | undefined },
  { role: 'Vice-presidente', photoId: undefined as number | undefined },
  { role: 'Tesoureiro', photoId: undefined as number | undefined },
  { role: 'Secretário', photoId: undefined as number | undefined },
  { role: 'Marketing', photoId: undefined as number | undefined },
  { role: 'Orientador', photoId: undefined as number | undefined }
])
const aboutPhotos = ref<number[]>([])
const volunteerPhotos = ref<number[]>([])
const VOLUNTEER_LIMIT = 12
const sponsors = ref<Sponsor[]>([])
const SPONSOR_LIMIT = 12
const awards = ref<Award[]>([])
const events = ref<Event[]>([])
const categories = [
  { key: 'sumo', label: 'Sumô' },
  { key: 'mini-sumo', label: 'Mini Sumô' },
  { key: 'hockey', label: 'Hockey' },
  { key: 'follow-line', label: 'Follow Line' }
] as const
const robotCategory = ref<string>('sumo')
const robotPhotos = ref<Record<string, number[]>>({ sumo: [], 'mini-sumo': [], hockey: [], 'follow-line': [] })
const robotBannerId = ref<number | undefined>()
const heroPhotoId = ref<number | undefined>()
const heroTitle = ref('Oficina de Arduino na UFRB')
const heroDescription = ref('Confira os registros da oficina e conheça nossas atividades.')
const heroButton = ref('Ver fotos')
const heroDestination = ref('album')
const heroAlbum = ref<number | undefined>()
const heroTarget = ref('')
const heroActive = ref(true)
const competitionBannerId = ref<number | undefined>()
const competitionHeroPhotoId = ref<number | undefined>()
const competitionHeroEnabled = ref(false)
const competitionText = ref('')
const competitionHeroTitle = ref('Venha competir com a RAS UFRB')
const competitionHeroButton = ref('Conheça a competição')
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
    case 'hero': heroPhotoId.value = id; break
    case 'about': aboutPhotos.value.push(id); break
    case 'board': board.value[pickIndex.value]!.photoId = id; break
    case 'volunteer': volunteerPhotos.value.push(id); break
    case 'award': { const a = awards.value[pickIndex.value]; if (a) a.photoId = id; break }
    case 'robots-banner': robotBannerId.value = id; break
    case 'robot': robotPhotos.value[robotCategory.value]!.push(id); break
    case 'event': { const e = events.value[pickIndex.value]; if (e) e.photoId = id; break }
    case 'sponsor': sponsors.value.push({ id: Date.now(), photoId: id, url: '', zoom: 100 }); break
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
function addAward() { awards.value.push({ id: Date.now(), title: '', year: String(new Date().getFullYear()), detail: '' }) }
function addEvent() { events.value.push({ id: Date.now(), title: '', date: '', description: '' }) }
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
        <div class="media-editor-block">
          <h3>Publicação / destaque no Hero</h3>
          <p>Adicione uma chamada editorial aos slides da Intro sem mudar os textos institucionais fixos.</p>
          <div class="editor-hero-preview">
            <img v-if="photo(heroPhotoId)?.src" :src="photo(heroPhotoId)?.src" alt="Prévia do Hero" />
            <div class="editor-hero-copy"><small>DESTAQUE EDITORIAL</small><h3>{{ heroTitle || 'Título da publicação' }}</h3><p>{{ heroDescription }}</p><span>{{ heroButton || 'Ver mais' }} →</span></div>
          </div>
          <div class="editor-actions"><el-button @click="openPicker('hero')">{{ heroPhotoId ? 'Trocar imagem do Hero' : 'Escolher imagem do Hero' }}</el-button><span class="editor-photo-name">{{ photo(heroPhotoId)?.name || 'Nenhuma imagem selecionada' }}</span></div>
          <div class="editor-form-grid">
            <el-form-item label="Título"><el-input v-model="heroTitle" maxlength="100" show-word-limit/></el-form-item>
            <el-form-item label="Texto do botão"><el-input v-model="heroButton" maxlength="40"/></el-form-item>
            <el-form-item label="Destino do botão"><el-select v-model="heroDestination">
              <el-option value="album" label="Álbum da Galeria"/><el-option value="gallery" label="Galeria completa"/><el-option value="event" label="Evento"/><el-option value="section" label="Seção da Landing"/>
            </el-select></el-form-item>
            <el-form-item v-if="heroDestination === 'album'" label="Álbum de destino"><el-select v-model="heroAlbum" placeholder="Escolha o álbum">
              <el-option v-for="album in albums" :key="album.id" :label="album.name" :value="album.id"/>
            </el-select></el-form-item>
            <el-form-item v-else-if="heroDestination === 'event' || heroDestination === 'section'" :label="heroDestination === 'event' ? 'Evento relacionado' : 'Seção de destino'">
              <el-select v-if="heroDestination === 'event'" v-model="heroTarget"><el-option v-for="event in events" :key="event.id" :label="event.title || 'Evento sem título'" :value="String(event.id)"/></el-select>
              <el-select v-else v-model="heroTarget"><el-option v-for="item in sections" :key="item.name" :label="item.name" :value="item.name"/></el-select>
            </el-form-item>
            <el-form-item label="Descrição" class="span-two"><el-input v-model="heroDescription" type="textarea" :rows="3" maxlength="300" show-word-limit /></el-form-item>
          </div>
          <el-checkbox v-model="heroActive">Manter este destaque ativo no carrossel</el-checkbox>
        </div>
      </template>

      <template v-else-if="section === 'Sobre'">
        <div class="editor-heading"><div><h3>Sequência de imagens</h3><p>Os textos da seção Sobre permanecem fixos. Organize a ordem das fotografias.</p></div><el-button type="primary" plain @click="openPicker('about')">+ Adicionar imagem</el-button></div>
        <div v-if="aboutPhotos.length" class="editor-image-grid">
          <article v-for="(id,i) in aboutPhotos" :key="i" class="editor-image-item">
            <div class="editor-image"><img v-if="photo(id)?.src" :src="photo(id)?.src" :alt="photo(id)?.name"/><span v-else>▧</span></div>
            <small>{{ photo(id)?.name || 'Foto de exemplo' }}</small>
            <div class="editor-inline-actions"><el-button size="small" :disabled="i===0" @click="move(aboutPhotos,i,-1)">↑</el-button><el-button size="small" :disabled="i===aboutPhotos.length-1" @click="move(aboutPhotos,i,1)">↓</el-button><el-button size="small" type="danger" text @click="aboutPhotos.splice(i,1)">Remover</el-button></div>
          </article>
        </div>
        <div v-else class="editor-empty">Nenhuma imagem selecionada. Adicione as fotos da sequência da seção Sobre.</div>
      </template>

      <template v-else-if="section === 'Equipe e conquistas'">
        <h3>Diretoria — cargos fixos</h3><p>Os seis cargos não podem ser alterados. Selecione apenas a fotografia de cada integrante.</p>
        <div class="editor-board-grid">
          <div v-for="(item,i) in board" :key="item.role" class="editor-board-card">
            <div class="editor-image"><img v-if="photo(item.photoId)?.src" :src="photo(item.photoId)?.src" :alt="item.role"/><span v-else>▧</span></div>
            <strong>{{ item.role }}</strong><el-button size="small" @click="openPicker('board',i)">{{ item.photoId ? 'Trocar foto' : 'Selecionar foto' }}</el-button>
          </div>
        </div>
        <div class="editor-heading editor-spaced"><div><h3>Voluntários</h3><p>Carrossel de fotografias. Máximo de {{ VOLUNTEER_LIMIT }} imagens.</p></div><el-button :disabled="volunteerPhotos.length >= VOLUNTEER_LIMIT" @click="openPicker('volunteer')">+ Adicionar foto ({{ volunteerPhotos.length }}/{{ VOLUNTEER_LIMIT }})</el-button></div>
        <div v-if="volunteerPhotos.length" class="editor-image-grid">
          <div v-for="(id,i) in volunteerPhotos" :key="i" class="editor-image-item"><div class="editor-image"><img v-if="photo(id)?.src" :src="photo(id)?.src" :alt="photo(id)?.name"/><span v-else>▧</span></div><small>{{ photo(id)?.name }}</small><div class="editor-inline-actions"><el-button size="small" :disabled="i===0" @click="move(volunteerPhotos,i,-1)">↑</el-button><el-button size="small" :disabled="i===volunteerPhotos.length-1" @click="move(volunteerPhotos,i,1)">↓</el-button><el-button text type="danger" size="small" @click="volunteerPhotos.splice(i,1)">Remover</el-button></div></div>
        </div><div v-else class="editor-empty">Nenhuma foto de voluntários escolhida nesta prévia.</div>
        <div class="editor-heading editor-spaced"><div><h3>Conquistas e premiações</h3><p>Gerencie título, ano, detalhes, imagem e ordem de exibição.</p></div><el-button type="primary" plain @click="addAward">+ Adicionar conquista</el-button></div>
        <div v-for="(award,i) in awards" :key="award.id" class="editor-record">
          <div class="editor-record-title"><strong>Conquista {{ i+1 }}</strong><div class="editor-inline-actions"><el-button size="small" :disabled="i===0" @click="move(awards,i,-1)">↑</el-button><el-button size="small" :disabled="i===awards.length-1" @click="move(awards,i,1)">↓</el-button><el-button size="small" type="danger" text @click="awards.splice(i,1)">Remover</el-button></div></div>
          <div class="editor-form-grid"><el-form-item label="Título"><el-input v-model="award.title" placeholder="Ex.: Campeão Follow Line"/></el-form-item><el-form-item label="Ano"><el-input v-model="award.year" maxlength="9"/></el-form-item>
            <el-form-item class="span-two" label="Descrição / detalhes"><el-input v-model="award.detail" type="textarea" :rows="2"/></el-form-item></div>
          <div class="editor-actions"><el-button size="small" @click="openPicker('award',i)">{{ award.photoId ? 'Trocar imagem' : 'Escolher imagem' }}</el-button><span class="editor-photo-name">{{ photo(award.photoId)?.name || 'Sem foto' }}</span></div>
        </div><div v-if="!awards.length" class="editor-empty">Adicione uma conquista para organizar o conteúdo da Landing.</div>
      </template>

      <template v-else-if="section === 'Robôs'">
        <h3>Imagem principal da seção</h3><p>Banner que aparece acima das categorias na Landing.</p>
        <div class="editor-wide-image"><img v-if="photo(robotBannerId)?.src" :src="photo(robotBannerId)?.src" alt="Banner de robôs"/><span v-else>▧</span></div>
        <el-button @click="openPicker('robots-banner')">Escolher imagem principal</el-button>
        <div class="editor-heading editor-spaced"><div><h3>Fotos por categoria</h3><p>Selecione a categoria e organize as fotos que aparecerão no respectivo subálbum.</p></div></div>
        <div class="editor-category-tabs">
          <button v-for="item in categories" :key="item.key" :class="{active:robotCategory===item.key}" @click="robotCategory=item.key">{{ item.label }} <small>{{ robotPhotos[item.key]?.length || 0 }}</small></button>
        </div>
        <div class="editor-actions"><strong>{{ categories.find(c=>c.key===robotCategory)?.label }}</strong><el-button type="primary" plain @click="openPicker('robot')">+ Adicionar foto nesta categoria</el-button></div>
        <div v-if="robotPhotos[robotCategory]?.length" class="editor-image-grid">
          <div v-for="(id,i) in robotPhotos[robotCategory]" :key="i" class="editor-image-item"><div class="editor-image"><img v-if="photo(id)?.src" :src="photo(id)?.src" :alt="photo(id)?.name"/><span v-else>▧</span></div><small>{{ photo(id)?.name }}</small><div class="editor-inline-actions"><el-button size="small" :disabled="i===0" @click="move(robotPhotos[robotCategory]!,i,-1)">↑</el-button><el-button size="small" :disabled="i===(robotPhotos[robotCategory]?.length || 0)-1" @click="move(robotPhotos[robotCategory]!,i,1)">↓</el-button><el-button size="small" text type="danger" @click="robotPhotos[robotCategory]!.splice(i,1)">Remover</el-button></div></div>
        </div><div v-else class="editor-empty">Ainda não há fotos associadas a esta categoria.</div>
      </template>

      <template v-else-if="section === 'Eventos'">
        <div class="editor-heading"><div><h3>Eventos da RAS</h3><p>Cadastre e ordene eventos com título, data, descrição e fotografia.</p></div><el-button type="primary" plain @click="addEvent">+ Adicionar evento</el-button></div>
        <div v-for="(event,i) in events" :key="event.id" class="editor-record">
          <div class="editor-record-title"><strong>Evento {{ i+1 }}</strong><div class="editor-inline-actions"><el-button size="small" :disabled="i===0" @click="move(events,i,-1)">↑</el-button><el-button size="small" :disabled="i===events.length-1" @click="move(events,i,1)">↓</el-button><el-button text type="danger" size="small" @click="events.splice(i,1)">Remover</el-button></div></div>
          <div class="editor-form-grid"><el-form-item label="Título"><el-input v-model="event.title"/></el-form-item><el-form-item label="Data do evento"><el-date-picker v-model="event.date" type="date" value-format="YYYY-MM-DD" style="width:100%" placeholder="Escolher data"/></el-form-item><el-form-item class="span-two" label="Descrição"><el-input v-model="event.description" type="textarea" :rows="2"/></el-form-item></div>
          <div class="editor-actions"><el-button size="small" @click="openPicker('event',i)">Escolher foto do evento</el-button><span class="editor-photo-name">{{ photo(event.photoId)?.name || 'Nenhuma foto selecionada' }}</span></div>
        </div><div v-if="!events.length" class="editor-empty">Nenhum evento editorial adicionado na prévia local.</div>
      </template>

      <template v-else-if="section === 'Patrocinadores'">
        <div class="editor-heading"><div><h3>Logos de patrocinadores</h3><p>Carrossel com até {{ SPONSOR_LIMIT }} logos; remova, reordene e ajuste o tamanho de cada uma.</p></div><el-button type="primary" plain :disabled="sponsors.length>=SPONSOR_LIMIT" @click="openPicker('sponsor')">+ Adicionar logo ({{ sponsors.length }}/{{ SPONSOR_LIMIT }})</el-button></div>
        <div v-for="(item,i) in sponsors" :key="item.id" class="editor-record">
          <div class="editor-record-title"><strong>Patrocinador {{ i+1 }}</strong><div class="editor-inline-actions"><el-button size="small" :disabled="i===0" @click="move(sponsors,i,-1)">↑</el-button><el-button size="small" :disabled="i===sponsors.length-1" @click="move(sponsors,i,1)">↓</el-button><el-button type="danger" text size="small" @click="sponsors.splice(i,1)">Remover</el-button></div></div>
          <div class="editor-sponsor-row"><div class="editor-sponsor-image"><img v-if="photo(item.photoId)?.src" :src="photo(item.photoId)?.src" :alt="photo(item.photoId)?.name" :style="{transform:'scale('+item.zoom/100+')'}"/><span v-else>▧</span></div>
            <div class="editor-sponsor-fields"><el-form-item label="Link (opcional)"><el-input v-model="item.url" placeholder="https://..."/></el-form-item><label>Zoom da logo: {{ item.zoom }}%</label><el-slider v-model="item.zoom" :min="60" :max="160"/></div></div>
          <el-button size="small" @click="openPicker('sponsor')">Adicionar outra logo</el-button>
        </div><div v-if="!sponsors.length" class="editor-empty">Adicione logos da Biblioteca. Não serão usados automaticamente os logos institucionais do rodapé.</div>
      </template>

      <template v-else-if="section === 'Competição'">
        <div class="editor-info">Informações oficiais como inscrição, status, categorias, robôs, pontuação e resultados continuarão chegando pela API competitiva. Aqui serão editadas apenas imagens e chamadas editoriais.</div>
        <h3>Imagem da seção Competição</h3><div class="editor-wide-image"><img v-if="photo(competitionBannerId)?.src" :src="photo(competitionBannerId)?.src" alt="Imagem da seção Competição"/><span v-else>▧</span></div>
        <el-button @click="openPicker('competition-section')">Escolher imagem da seção</el-button>
        <el-form-item label="Texto complementar (opcional)" class="editor-spaced"><el-input v-model="competitionText" type="textarea" :rows="3" placeholder="Informação editorial que não vem da API"/></el-form-item>
        <div class="editor-heading editor-spaced"><div><h3>Hero competitivo na Intro</h3><p>Um destaque opcional, sem trocar o modo de toda a Landing.</p></div><el-switch v-model="competitionHeroEnabled" active-text="Ativo" inactive-text="Desativado"/></div>
        <div class="editor-form-grid"><el-form-item label="Título"><el-input v-model="competitionHeroTitle"/></el-form-item><el-form-item label="Botão"><el-input v-model="competitionHeroButton"/></el-form-item></div>
        <div class="editor-actions"><el-button @click="openPicker('competition-hero')">Escolher imagem do Hero competitivo</el-button><span class="editor-photo-name">{{ photo(competitionHeroPhotoId)?.name || 'Imagem não selecionada' }}</span></div>
      </template>

      <div class="editor-footer"><el-button type="primary" @click="applyPreview">Aplicar na prévia local</el-button><span>Nenhum dado será salvo no banco ou publicado na Landing nesta fase.</span></div>
    </section>

    <el-dialog v-model="pickerOpen" title="Escolher imagem da Biblioteca" width="min(850px, 95vw)" append-to-body>
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
.editor-wide-image{height:185px;border-radius:10px;border:1px dashed #dbccd7;background:#f7f4f7;display:grid;place-items:center;color:#98758b;font-size:55px;margin:12px 0}
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
