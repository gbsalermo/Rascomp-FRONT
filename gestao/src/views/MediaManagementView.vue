<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import MediaLandingEditor from '../components/MediaLandingEditor.vue'
import { useAuthStore } from '../store'

type Album = { id: number; name: string; description: string; coverId?: number }
type MediaPhoto = { id: number; name: string; albums: number[]; published: boolean; tone: number; src?: string; sourcePath?: string }
type UploadItem = { file: File; preview: string }
type MediaVisibility = 'private' | 'public'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

// Preferência local por conta: vale apenas para este navegador.
const visibilityPreferenceKey = computed(() => 'rascomp.media.defaultVisibility.' + (auth.user?.id ?? 'anonymous'))
function loadVisibilityPreference(): MediaVisibility {
  try {
    return localStorage.getItem(visibilityPreferenceKey.value) === 'public' ? 'public' : 'private'
  } catch {
    return 'private'
  }
}
const defaultVisibility = ref<MediaVisibility>(loadVisibilityPreference())
const uploadVisibility = ref<MediaVisibility>(defaultVisibility.value)
function changeDefaultVisibility(value: string) {
  const choice: MediaVisibility = value === 'public' ? 'public' : 'private'
  defaultVisibility.value = choice
  try {
    localStorage.setItem(visibilityPreferenceKey.value, choice)
  } catch {
    ElMessage.warning('Não foi possível salvar a preferência neste navegador.')
  }
}
function openUploadDialog() {
  uploadVisibility.value = defaultVisibility.value
  uploadDialog.value = true
}
const section = computed(() => route.path.endsWith('/albuns') ? 'albums' : route.path.endsWith('/landing') ? 'landing' : 'library')
const albums = ref<Album[]>([
  { id: 1, name: 'Competições', description: 'Registros de competições e arenas' },
  { id: 2, name: 'Oficinas', description: 'Cursos, treinamentos e oficinas' },
  { id: 3, name: 'Equipe e conquistas', description: 'Pessoas e premiações da RAS' },
  { id: 4, name: 'RAS nas Escolas', description: 'Ações de extensão' }
])
// Fotografias atualmente versionadas na Landing, para edição na prévia.
 // Esta ponte estática é TEMPORÁRIA: o CMS real fará inventário/migração para o R2.
const originalAboutPhotos = import.meta.glob('../../../landing-page/src/assets/about/*.{jpg,jpeg,png,webp,avif}', { eager:true, query:'?url', import:'default' }) as Record<string,string>
const originalRobotPhotos = import.meta.glob('../../../landing-page/src/assets/robots/**/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' }) as Record<string,string>
const originalBoardPhotos = import.meta.glob('../../../landing-page/src/assets/team/board/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' }) as Record<string,string>
const originalVolunteerPhotos = import.meta.glob('../../../landing-page/src/assets/team/volunteers/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' }) as Record<string,string>
const originalPartnerPhotos = import.meta.glob('../../../landing-page/src/assets/footer/partners/*.{jpg,jpeg,png,webp,avif,svg}', { eager: true, query: '?url', import: 'default' }) as Record<string,string>
const originalEventPhotos = import.meta.glob('../../../landing-page/src/assets/{rcx.jpg,rrc.jpeg,congresso.png}', { eager: true, query: '?url', import: 'default' }) as Record<string,string>
const originalAssets = [
  ...Object.entries(originalAboutPhotos),
  ...Object.entries(originalRobotPhotos),
  ...Object.entries(originalBoardPhotos),
  ...Object.entries(originalVolunteerPhotos),
  ...Object.entries(originalPartnerPhotos),
  ...Object.entries(originalEventPhotos)
].sort(([a],[b])=>a.localeCompare(b,'pt-BR',{numeric:true}))
const legacyPhotos: MediaPhoto[] = originalAssets.map(([sourcePath,src],index)=>({
  id:10000+index,
  name:sourcePath.split('/').pop() || 'imagem-existente',
  sourcePath, src, tone:index%9, albums:[], published:false
}))
const photos = ref<MediaPhoto[]>([
  { id: 1, name: 'robo-competicao.jpg', albums: [1], published: true, tone: 0 },
  { id: 2, name: 'oficina-arduino.jpg', albums: [2], published: true, tone: 1 },
  { id: 3, name: 'equipe-premiacao.jpg', albums: [3, 1], published: true, tone: 2 },
  { id: 4, name: 'ras-nas-escolas.jpg', albums: [4], published: true, tone: 3 },
  { id: 5, name: 'voluntarios.jpg', albums: [3], published: false, tone: 4 },
  { id: 6, name: 'foto-avulsa.jpg', albums: [], published: false, tone: 5 },
  { id: 7, name: 'premiacao-2025.jpg', albums: [3], published: true, tone: 6 },
  { id: 8, name: 'oficina-robotica.jpg', albums: [2, 4], published: false, tone: 7 },
  { id: 9, name: 'laboratorio.jpg', albums: [], published: false, tone: 8 },
  ...legacyPhotos
])
const search = ref('')
const albumFilter = ref('all')
const selectedIds = ref<number[]>([1])
const selectedPhoto = computed(() => photos.value.find(photo => photo.id === selectedIds.value[0]))
const visiblePhotos = computed(() => photos.value.filter(photo => {
  const q = photo.name.toLocaleLowerCase('pt-BR').includes(search.value.toLocaleLowerCase('pt-BR'))
  if (!q) return false
  if (albumFilter.value === 'none') return photo.albums.length === 0
  if (albumFilter.value === 'all') return true
  return photo.albums.includes(Number(albumFilter.value))
}))
const albumName = (id: number) => albums.value.find(album => album.id === id)?.name || 'Álbum removido'
function albumPhotos(id: number) { return photos.value.filter(photo => photo.albums.includes(id)) }
function albumCover(album: Album): MediaPhoto | undefined {
  const items = albumPhotos(album.id)
  if (!items.length) return undefined
  const selected = items.find(photo => photo.id === album.coverId)
  if (selected) return selected
  const stored = items.find(photo => photo.id === autoCovers.get(album.id))
  if (stored) return stored
  const choice = items[Math.floor(Math.random() * items.length)]
  if (choice) autoCovers.set(album.id, choice.id)
  return choice
}
function openCoverPicker(albumId: number) {
  coverPickerAlbumId.value = albumId
}
function chooseAlbumCover(photoId: number | undefined) {
  const album = albums.value.find(item => item.id === coverPickerAlbumId.value)
  if (album) album.coverId = photoId
  coverPickerAlbumId.value = null
}
const uploadedUrls: string[] = []
const uploadDialog = ref(false)
const uploads = ref<UploadItem[]>([])
const uploadTarget = ref<'none' | 'existing' | 'new'>('none')
const targetAlbumIds = ref<number[]>([])
const newAlbumName = ref('')
const albumDialog = ref(false)
const albumDraft = ref('')
const albumDescriptionDraft = ref('')
const editingAlbumId = ref<number | null>(null)
const coverPickerAlbumId = ref<number | null>(null)
const autoCovers = new Map<number, number>()
const cropDialog = ref(false)
const zoom = ref(115)
const positionX = ref(50)
const positionY = ref(50)
const displayWidth = ref(100)
const displayHeight = ref(100)

function togglePhoto(id: number, multi: boolean) {
  if (multi) selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter(value => value !== id)
    : [...selectedIds.value, id]
  else selectedIds.value = [id]
}
function createAlbum(name: string, description = ''): number {
  const id = Math.max(0, ...albums.value.map(album => album.id)) + 1
  albums.value.push({ id, name: name.trim(), description })
  return id
}
function openAlbumDialog(album?: Album) {
  editingAlbumId.value = album?.id ?? null
  albumDraft.value = album?.name || ''
  albumDescriptionDraft.value = album?.description || ''
  albumDialog.value = true
}
function saveAlbum() {
  const name = albumDraft.value.trim()
  if (!name) { ElMessage.warning('Informe o nome do álbum.'); return }
  if (editingAlbumId.value !== null) {
    const target = albums.value.find(album => album.id === editingAlbumId.value)
    if (target) { target.name = name; target.description = albumDescriptionDraft.value }
  } else createAlbum(name, albumDescriptionDraft.value)
  albumDialog.value = false
  ElMessage.success('Álbum alterado nesta demonstração local.')
}
function removeAlbum(id: number) {
  photos.value.forEach(photo => { photo.albums = photo.albums.filter(albumId => albumId !== id) })
  albums.value = albums.value.filter(album => album.id !== id)
  if (albumFilter.value === String(id)) albumFilter.value = 'all'
  autoCovers.delete(id)
  ElMessage.info('Álbum removido da prévia; as fotos foram preservadas.')
}
function addPhotoForEditor(file: File): number {
  if (!file.type.startsWith('image/')) { ElMessage.warning('Selecione um arquivo de imagem.'); return 0 }
  const url = URL.createObjectURL(file)
  uploadedUrls.push(url)
  const id = Math.max(0, ...photos.value.map(item => item.id)) + 1
  photos.value.unshift({ id, name: file.name, src: url, albums: [], published: defaultVisibility.value === 'public', tone: id % 9 })
  return id
}
function fileChange(event: Event) {
  const input = event.target as HTMLInputElement
  uploads.value = Array.from(input.files || []).filter(file => file.type.startsWith('image/')).map(file => {
    const preview = URL.createObjectURL(file)
    uploadedUrls.push(preview)
    return { file, preview }
  })
  input.value = ''
}
function confirmUpload() {
  if (!uploads.value.length) { ElMessage.warning('Selecione pelo menos uma imagem.'); return }
  let ids: number[] = []
  if (uploadTarget.value === 'existing') ids = [...targetAlbumIds.value]
  if (uploadTarget.value === 'new') {
    if (!newAlbumName.value.trim()) { ElMessage.warning('Informe o nome do novo álbum.'); return }
    ids = [createAlbum(newAlbumName.value)]
  }
  const start = Math.max(0, ...photos.value.map(photo => photo.id)) + 1
  const added = uploads.value.map((item, i): MediaPhoto => ({
    id: start + i, name: item.file.name, albums: ids, published: uploadVisibility.value === 'public',
    tone: (start + i) % 9, src: item.preview
  }))
  photos.value = [...added, ...photos.value]
  selectedIds.value = added.map(item => item.id)
  albumFilter.value = 'all'
  uploads.value = []
  uploadDialog.value = false
  ElMessage.success('Fotos adicionadas apenas à prévia local (sem envio ao servidor).')
}
function changePhotoAlbum(id: number, enabled: boolean) {
  const photo = selectedPhoto.value
  if (!photo) return
  photo.albums = enabled ? [...new Set([...photo.albums, id])] : photo.albums.filter(albumId => albumId !== id)
}
function openCrop() {
  if (!selectedPhoto.value) return
  zoom.value = 115; positionX.value = 50; positionY.value = 50
  displayWidth.value = 100; displayHeight.value = 100
  cropDialog.value = true
}
function demoOnly() { ElMessage.info('Editor demonstrativo. A gravação no backend será implementada após sua aprovação visual.') }
function showAlbum(id: number) { albumFilter.value = String(id); router.push('/midia') }
onBeforeUnmount(() => uploadedUrls.forEach(url => URL.revokeObjectURL(url)))
</script>

<template>
  <main class="media-management page-stack">
    <div class="media-heading">
      <div>
        <span class="media-kicker">IEEE RAS · ADMINISTRAÇÃO EDITORIAL</span>
        <h1>{{ section === 'library' ? 'Biblioteca de imagens' : section === 'albums' ? 'Álbuns' : 'Conteúdo da Landing' }}</h1>
        <p v-if="section === 'library'">Todas as imagens em um só lugar. Organize, associe a álbuns e prepare imagens para o site.</p>
        <p v-else-if="section === 'albums'">Organize coleções sem duplicar imagens no armazenamento.</p>
        <p v-else>Gerencie as imagens das seções sem alterar o conteúdo institucional permanente.</p>
      </div>
      <div class="media-header-actions">
        <span class="media-demo-label">Demonstração local</span>
        <el-button v-if="section === 'library'" type="primary" @click="openUploadDialog">＋ Adicionar fotos</el-button>
        <el-button v-if="section === 'albums'" type="primary" @click="openAlbumDialog()">＋ Novo álbum</el-button>
        <el-button v-if="section === 'landing'" type="primary" plain @click="demoOnly">Prévia do site</el-button>
      </div>
    </div>

    <template v-if="section === 'library'">
      <div class="media-stats">
        <div><span>Imagens na Biblioteca</span><strong>{{ photos.length }}</strong></div>
        <div><span>Sem álbum</span><strong>{{ photos.filter(p => !p.albums.length).length }}</strong></div>
        <div><span>Álbuns existentes</span><strong>{{ albums.length }}</strong></div>
      </div>
      <div class="media-library-grid">
        <section class="media-panel media-browser">
          <div class="media-controls">
            <el-input v-model="search" clearable placeholder="Buscar imagens..." class="media-search" />
            <el-button @click="openAlbumDialog()">＋ Novo álbum</el-button>
          </div>
          <div class="media-filter-line">
            <button :class="{ active: albumFilter === 'all' }" @click="albumFilter = 'all'">Todas</button>
            <button :class="{ active: albumFilter === 'none' }" @click="albumFilter = 'none'">Sem álbum</button>
            <el-select v-model="albumFilter" style="width:190px" placeholder="Escolher álbum">
              <el-option label="Todos os álbuns" value="all" />
              <el-option v-for="album in albums" :key="album.id" :label="album.name" :value="String(album.id)" />
            </el-select>
            <span class="media-results">{{ visiblePhotos.length }} imagens</span>
          </div>
          <div v-if="visiblePhotos.length" class="media-photo-grid">
            <button v-for="photo in visiblePhotos" :key="photo.id" type="button" class="media-photo-tile"
              :class="{ selected: selectedIds.includes(photo.id) }" @click="togglePhoto(photo.id, $event.ctrlKey || $event.metaKey)">
              <span class="media-photo-image" :class="'tone-' + photo.tone">
                <img v-if="photo.src" :src="photo.src" :alt="photo.name" />
                <span v-else class="media-photo-symbol">{{ ['⚙','◈','★','▣','✦','▦','◆','✳','◇'][photo.tone] }}</span>
                <span class="media-tile-check">{{ selectedIds.includes(photo.id) ? '✓' : '○' }}</span>
              </span>
              <span class="media-tile-caption"><strong>{{ photo.name }}</strong><small>{{ photo.albums.length ? photo.albums.map(albumName).join(' · ') : 'Sem álbum' }}</small></span>
            </button>
          </div>
          <div v-else class="media-empty">Nenhuma imagem encontrada para este filtro.</div>
          <p class="media-hint">Clique para selecionar. Ctrl + clique permite selecionar várias imagens.</p>
        </section>
        <aside class="media-panel media-details">
          <template v-if="selectedPhoto">
            <h2>Detalhes da imagem</h2>
            <div class="media-detail-photo" :class="'tone-' + selectedPhoto.tone">
              <img v-if="selectedPhoto.src" :src="selectedPhoto.src" alt="Prévia da imagem selecionada"/>
              <span v-else>▧</span>
            </div>
            <label>Arquivo</label><div class="media-detail-field">{{ selectedPhoto.name }}</div>
            <label>Álbuns associados</label>
            <div class="media-album-checks">
              <el-checkbox v-for="album in albums" :key="album.id" :model-value="selectedPhoto.albums.includes(album.id)"
                @change="changePhotoAlbum(album.id, Boolean($event))">{{ album.name }}</el-checkbox>
            </div>
            <label>Exibir na Galeria pública (após integração)</label>
            <el-switch v-model="selectedPhoto.published" active-text="Sim" inactive-text="Não" />
            <p class="media-visibility-help">Esta opção simula a futura publicação. Fotos privadas permanecem na Biblioteca. Fotos marcadas como públicas serão exibidas na Galeria quando a integração estiver pronta; você pode alterar isso a qualquer momento. A prévia local não sincroniza as duas aplicações.</p>
            <div class="media-detail-actions"><el-button @click="openCrop">Editar enquadramento</el-button></div>
          </template>
          <div v-else class="media-empty">Selecione uma imagem para visualizar seus detalhes.</div>
        </aside>
      </div>
    </template>

    <template v-else-if="section === 'albums'">
      <div class="media-album-grid">
        <article v-for="(album, i) in albums" :key="album.id" class="media-panel media-album-card">
          <div class="media-album-cover" :class="'tone-' + (i % 9)">
            <img v-if="albumCover(album)?.src" :src="albumCover(album)?.src" :alt="'Capa de ' + album.name" />
            <span v-else>▧</span><b>{{ albumPhotos(album.id).length }} fotos</b>
          </div>
          <div class="media-album-body"><h2>{{ album.name }}</h2><p>{{ album.description || 'Coleção de imagens' }}</p>
            <div class="media-album-actions">
              <el-button size="small" type="primary" plain @click="showAlbum(album.id)">Ver fotos</el-button>
              <el-button size="small" @click="openCoverPicker(album.id)">Escolher capa</el-button>
              <el-button size="small" @click="openAlbumDialog(album)">Editar</el-button>
              <el-popconfirm title="Remover álbum? As fotos serão mantidas." @confirm="removeAlbum(album.id)">
                <template #reference><el-button size="small" text type="danger">Excluir</el-button></template>
              </el-popconfirm>
            </div>
          </div>
        </article>
        <button class="media-album-add" @click="openAlbumDialog()"><span>＋</span><strong>Criar novo álbum</strong><small>As imagens podem pertencer a vários álbuns.</small></button>
      </div>
    </template>

    <template v-else>
      <MediaLandingEditor :photos="photos" :albums="albums" :upload-photo="addPhotoForEditor" />
    </template>

    <el-dialog v-model="uploadDialog" title="Adicionar fotos à Biblioteca" width="min(620px, 94vw)" destroy-on-close>
      <p class="media-dialog-intro">Você pode subir uma ou várias imagens e escolher se elas entram em um ou mais álbuns.</p>
      <label class="media-upload-drop">＋ &nbsp; Selecionar imagens do computador<input type="file" multiple accept="image/*" @change="fileChange" /></label>
      <div v-if="uploads.length" class="media-upload-preview">
        <div v-for="(item, i) in uploads" :key="i"><img :src="item.preview" alt="" /><span>{{ item.file.name }}</span></div>
      </div>
      <div class="media-dialog-choice"><el-radio-group v-model="uploadTarget"><el-radio value="none">Sem álbum</el-radio><el-radio value="existing">Álbuns existentes</el-radio><el-radio value="new">Criar álbum</el-radio></el-radio-group></div>
      <div v-if="uploadTarget === 'existing'" class="media-album-checks dialog-checks">
        <el-checkbox-group v-model="targetAlbumIds"><el-checkbox v-for="album in albums" :key="album.id" :value="album.id">{{ album.name }}</el-checkbox></el-checkbox-group>
      </div>
      <el-input v-if="uploadTarget === 'new'" v-model="newAlbumName" placeholder="Nome do novo álbum" />
      <div class="media-upload-visibility">
        <strong>Exibição das fotos deste envio</strong>
        <el-radio-group v-model="uploadVisibility" class="media-visibility-radio">
          <el-radio value="private">Privadas — apenas na Biblioteca</el-radio>
          <el-radio value="public">Públicas — aparecerão na Galeria após a integração</el-radio>
        </el-radio-group>
        <div class="media-default-row">
          <div>
            <strong>Padrão para novos envios</strong>
            <small>Salvo para sua conta neste navegador e aplicado ao abrir o próximo upload.</small>
          </div>
          <el-select :model-value="defaultVisibility" style="width:180px;flex-shrink:0" @change="changeDefaultVisibility">
            <el-option label="Privadas" value="private" />
            <el-option label="Públicas" value="public" />
          </el-select>
        </div>
        <p>O padrão pode ser diferente da escolha deste lote. Depois, você poderá mudar cada foto na Biblioteca. Nenhuma imagem é publicada de verdade nesta prévia local.</p>
      </div>
      <template #footer><el-button @click="uploadDialog = false">Cancelar</el-button><el-button type="primary" @click="confirmUpload">Adicionar à prévia</el-button></template>
    </el-dialog>


    <el-dialog :model-value="coverPickerAlbumId !== null" title="Capa do álbum" width="min(650px, 94vw)" @close="coverPickerAlbumId = null">
      <p class="media-dialog-intro">Escolha uma fotografia do álbum como capa. Sem seleção, uma das fotos será escolhida automaticamente e permanecerá estável na prévia.</p>
      <div v-if="coverPickerAlbumId !== null && albumPhotos(coverPickerAlbumId).length" class="media-cover-picker">
        <button v-for="photo in albumPhotos(coverPickerAlbumId)" :key="photo.id" type="button" @click="chooseAlbumCover(photo.id)">
          <span class="media-cover-thumb" :class="'tone-' + photo.tone"><img v-if="photo.src" :src="photo.src" :alt="photo.name"/><span v-else>▧</span></span>
          <small>{{ photo.name }}</small>
        </button>
      </div>
      <div v-else class="media-empty">Adicione fotos a este álbum antes de escolher uma capa.</div>
      <template #footer><el-button @click="chooseAlbumCover(undefined)">Usar capa automática</el-button><el-button @click="coverPickerAlbumId = null">Cancelar</el-button></template>
    </el-dialog>
    <el-dialog v-model="albumDialog" :title="editingAlbumId === null ? 'Criar álbum' : 'Editar álbum'" width="min(480px, 94vw)">
      <el-form label-position="top"><el-form-item label="Nome"><el-input v-model="albumDraft" placeholder="Ex.: Oficina de Arduino" /></el-form-item>
        <el-form-item label="Descrição"><el-input v-model="albumDescriptionDraft" type="textarea" :rows="3"/></el-form-item></el-form>
      <template #footer><el-button @click="albumDialog = false">Cancelar</el-button><el-button type="primary" @click="saveAlbum">Confirmar</el-button></template>
    </el-dialog>

    <el-dialog v-model="cropDialog" title="Enquadramento da imagem" width="min(800px, 95vw)">
      <p class="media-dialog-intro">Prévia local não destrutiva. A imagem original não é alterada.</p>
      <div v-if="selectedPhoto" class="media-crop-wrap">
        <div class="media-crop-preview" :class="'tone-' + selectedPhoto.tone" :style="{ width: displayWidth + '%', height: (160 * displayHeight / 100) + 'px' }">
          <img v-if="selectedPhoto.src" :src="selectedPhoto.src" :alt="selectedPhoto.name"
            :style="{ transform: 'scale(' + zoom / 100 + ')', objectPosition: positionX + '% ' + positionY + '%' }" />
          <span v-else :style="{ transform: 'translate(' + (positionX - 50) + 'px,' + (positionY - 50) / 2 + 'px) scale(' + zoom / 100 + ')' }">▧</span>
        </div>
        <div class="media-crop-inputs">
          <label>Zoom {{ zoom }}%<el-slider v-model="zoom" :min="100" :max="200" /></label>
          <label>Posição horizontal {{ positionX }}%<el-slider v-model="positionX" :min="0" :max="100" /></label>
          <label>Posição vertical {{ positionY }}%<el-slider v-model="positionY" :min="0" :max="100" /></label>
          <label>Largura {{ displayWidth }}%<el-slider v-model="displayWidth" :min="60" :max="100" /></label>
          <label>Altura {{ displayHeight }}%<el-slider v-model="displayHeight" :min="60" :max="140" /></label>
        </div>
      </div>
      <template #footer><el-button @click="zoom=115;positionX=50;positionY=50;displayWidth=100;displayHeight=100">Restaurar</el-button>
        <el-button type="primary" @click="demoOnly">Aplicar (em breve)</el-button></template>
    </el-dialog>
  </main>
</template>

<style scoped>
.media-management{color:#271e27;max-width:1660px;width:100%;margin:0 auto;padding:4px 2px 34px;gap:19px}
.media-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap}
.media-kicker{font-size:10px;font-weight:850;letter-spacing:.12em;color:#a80f3e}
.media-heading h1{font-size:clamp(25px,2.5vw,35px);line-height:1.12;letter-spacing:-.035em;margin:7px 0 8px}
.media-heading p{font-size:13px;color:#786c75;margin:0;line-height:1.5}
.media-header-actions{display:flex;align-items:center;gap:10px}
.media-demo-label{font-size:10px;color:#9b4b67;background:#fff1f6;border:1px solid #f3d7e3;border-radius:7px;padding:8px}
.media-management :deep(.el-button--primary){--el-button-bg-color:#aa1645;--el-button-border-color:#aa1645;--el-button-hover-bg-color:#8c123a;--el-button-hover-border-color:#8c123a}
.media-management :deep(.el-button--primary:not(.is-plain)):not(.is-text){color:#fff!important;--el-button-text-color:#fff;--el-button-hover-text-color:#fff}
.media-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.media-stats>div{background:#fff;border:1px solid #e9e2e8;border-radius:13px;padding:16px 19px;min-height:83px}
.media-stats span,.media-stats strong{display:block}.media-stats span{font-size:12px;color:#81757f}.media-stats strong{font-size:26px;margin-top:5px}
.media-library-grid{display:grid;grid-template-columns:minmax(0,1fr) 262px;gap:15px;align-items:start}
.media-panel{background:#fff;border:1px solid #e9e2e8;border-radius:14px;box-shadow:0 8px 24px #30182c08}
.media-browser{padding:16px;min-width:0}.media-controls{display:flex;gap:10px}.media-search{max-width:600px}
.media-filter-line{display:flex;align-items:center;flex-wrap:wrap;gap:7px;margin:16px 0}
.media-filter-line>button{border:1px solid #e7dfe6;background:#f8f6f8;color:#746774;border-radius:7px;padding:9px 13px;cursor:pointer;font:inherit;font-size:12px}
.media-filter-line>button.active{background:#fff0f5;color:#a80f3e;border-color:#ebc4d2;font-weight:750}
.media-results{margin-left:auto;color:#938893;font-size:11px}
.media-photo-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.media-photo-tile{border:1px solid #e8e2e7;border-radius:10px;overflow:hidden;background:#fff;text-align:left;cursor:pointer;display:block;padding:0;min-width:0;font:inherit}
.media-photo-tile.selected{border-color:#b51649;box-shadow:0 0 0 2px #b5164923}
.media-photo-image{height:140px;display:grid;place-items:center;position:relative;overflow:hidden}
.media-photo-image img,.media-detail-photo img{width:100%;height:100%;object-fit:contain;padding:5px;background:#f9f7f9}
.media-photo-symbol{font-size:45px;color:#ffffffad}
.media-tile-check{position:absolute;top:8px;right:8px;background:#fff;color:#a80f3e;width:22px;height:22px;display:grid;place-items:center;border-radius:6px;font-size:14px;font-weight:800}
.media-tile-caption{padding:9px 10px;display:block}.media-tile-caption strong{font-size:11px;display:block;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.media-tile-caption small{display:block;color:#8c7d88;margin-top:4px;font-size:10px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}
.tone-0{background:linear-gradient(135deg,#344964,#b16076)}.tone-1{background:linear-gradient(135deg,#72517e,#c88f9d)}.tone-2{background:linear-gradient(135deg,#506d78,#a5b3aa)}.tone-3{background:linear-gradient(135deg,#996d6d,#d3ad7d)}.tone-4{background:linear-gradient(135deg,#574e83,#b08aba)}.tone-5{background:linear-gradient(135deg,#466c6d,#9d929b)}.tone-6{background:linear-gradient(135deg,#8c485b,#d7a4a0)}.tone-7{background:linear-gradient(135deg,#426579,#8ab5b3)}.tone-8{background:linear-gradient(135deg,#6b5472,#b69079)}
.media-hint{font-size:11px;color:#948991;margin:14px 0 2px}
.media-details{padding:17px;position:sticky;top:16px}
.media-details h2{font-size:15px;margin:0 0 14px}.media-detail-photo{height:158px;border-radius:9px;display:grid;place-items:center;color:#ffffffc5;font-size:54px;overflow:hidden}
.media-details label{display:block;color:#8b7e88;font-size:10px;margin:15px 0 6px}
.media-detail-field{padding:11px;background:#faf8fa;border:1px solid #eee8ee;border-radius:7px;font-size:11px;overflow-wrap:anywhere}
.media-album-checks{display:flex;flex-direction:column;gap:3px}.media-detail-actions{border-top:1px solid #f0ebef;margin-top:15px;padding-top:15px}
.media-empty{text-align:center;padding:48px 10px;color:#8e808c}
.media-album-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.media-album-card{overflow:hidden}.media-album-cover{height:160px;display:flex;align-items:center;justify-content:center;position:relative;color:#fff}.media-album-cover>span{font-size:48px;opacity:.65}.media-album-cover b{position:absolute;right:12px;bottom:12px;background:#21132680;padding:5px 9px;border-radius:6px;font-size:11px}
.media-album-cover img{width:100%;height:100%;object-fit:contain;background:#f9f7f9}
.media-album-body{padding:17px}.media-album-body h2{font-size:17px;margin:0 0 7px}.media-album-body p{color:#857985;font-size:12px;margin:0 0 17px}.media-album-actions{display:flex;gap:4px;flex-wrap:wrap}
.media-album-actions :deep(.el-button){margin-left:0}
.media-visibility-help{color:#887b87;font-size:11px;line-height:1.5;margin:9px 0 0}
.media-cover-picker{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:18px 0;max-height:410px;overflow:auto}
.media-cover-picker button{border:1px solid #e8e2e7;background:white;border-radius:10px;overflow:hidden;cursor:pointer;padding:6px;min-width:0;text-align:left}
.media-cover-picker button:hover{border-color:#ab1747}
.media-cover-thumb{display:grid;place-items:center;height:118px;background:#faf7fa;color:#98748a;font-size:28px;overflow:hidden}
.media-cover-thumb img{width:100%;height:100%;object-fit:contain}
.media-cover-picker small{display:block;font-size:10px;margin:8px 3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.media-album-add{border:2px dashed #e3c7d4;border-radius:14px;background:#fffafb;color:#a80f3e;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:275px;gap:11px;cursor:pointer;font:inherit}.media-album-add span{font-size:40px}.media-album-add small{font-size:11px;color:#8e818b;max-width:160px}
.media-landing-layout{display:grid;grid-template-columns:300px minmax(0,1fr);gap:16px;align-items:start}.media-section-list{display:flex;flex-direction:column;gap:7px}
.media-section-list button{border:1px solid #e9e2e8;background:#fff;border-radius:11px;text-align:left;padding:15px 14px 15px 51px;min-height:70px;position:relative;cursor:pointer;font:inherit}
.media-section-list button.active{border-color:#d783a0;background:#fff4f7}
.media-section-list button>span{position:absolute;left:15px;top:21px;color:#ad1647;font-size:19px}
.media-section-list strong,.media-section-list small{display:block}.media-section-list strong{font-size:13px}.media-section-list small{font-size:10px;color:#8c8089;line-height:1.35;margin-top:3px}
.media-section-editor{padding:24px;min-height:510px}.media-section-editor h2{font-size:23px;margin:7px 0 9px}.media-section-editor>p{font-size:13px;color:#756a74;line-height:1.6}
.media-demo-hero{margin:18px 0 23px;border-radius:12px;background:linear-gradient(100deg,#271a36,#793653 65%,#b26373);color:#fff;min-height:185px;display:flex;align-items:center;padding:22px;overflow:hidden}
.media-demo-hero-copy{max-width:440px}.media-demo-hero-copy small{font-size:9px;letter-spacing:1px;color:#e9bad1}.media-demo-hero-copy h3{font-size:24px;letter-spacing:-.5px;margin:9px 0}.media-demo-hero-copy p{font-size:11px;line-height:1.6;color:#f6dce6;margin:0 0 10px}.media-demo-hero-copy span{display:inline-block;background:#fff;color:#7c1644;font-size:10px;font-weight:800;padding:9px 13px;border-radius:6px}
.media-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 15px}.media-form-grid .wide{grid-column:1/-1}
.media-section-placeholder{min-height:250px;background:linear-gradient(145deg,#f5eff3,#f9f8fb);border:1px dashed #dbcdd8;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:17px 0;color:#8c7287;gap:10px;text-align:center;padding:15px}
.media-section-placeholder>span{font-size:54px}.media-section-placeholder strong{font-size:14px}.media-section-placeholder small{font-size:11px}
.media-dialog-intro{color:#756a75;font-size:12px}
.media-upload-visibility{display:flex;flex-direction:column;gap:10px;margin-top:17px;padding:16px;border-radius:10px;border:1px solid #ebe3e9;background:#fcfafb}
.media-upload-visibility>strong,.media-default-row strong{font-size:12px;color:#332331}
.media-upload-visibility p,.media-default-row small{font-size:11px;color:#837581;line-height:1.5;margin:0}
.media-visibility-radio{display:flex;align-items:flex-start;flex-direction:column;gap:4px}
.media-default-row{border-top:1px solid #ebe3e9;padding-top:12px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.media-default-row>div{display:flex;flex-direction:column;gap:4px}
@media(max-width:480px){.media-default-row{flex-direction:column;align-items:stretch}.media-default-row :deep(.el-select){width:100%!important}}.media-upload-drop{display:grid;place-items:center;min-height:103px;border:2px dashed #dfbacc;border-radius:11px;background:#fff7fa;color:#a80f3e;font-size:13px;font-weight:800;cursor:pointer}.media-upload-drop input{display:none}
.media-upload-preview{display:flex;gap:7px;overflow:auto;margin:12px 0}.media-upload-preview>div{min-width:84px;width:100px}.media-upload-preview img{height:66px;width:100%;object-fit:cover;border-radius:6px}.media-upload-preview span{display:block;font-size:9px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.media-dialog-choice{margin:15px 0}.dialog-checks{margin:12px 0}.media-crop-wrap{display:grid;grid-template-columns:1.2fr 1fr;gap:25px;align-items:start}.media-crop-preview{max-width:100%;margin:10px auto;display:grid;place-items:center;overflow:hidden;border-radius:10px;font-size:58px;color:#ffffffbb}.media-crop-preview img{width:100%;height:100%;object-fit:cover}.media-crop-inputs label{display:block;font-size:11px;color:#695c68;margin-bottom:10px}
@media(max-width:1360px){.media-library-grid{grid-template-columns:minmax(0,1fr) 225px}.media-photo-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.media-photo-image{height:115px}}
@media(max-width:1100px){.media-library-grid{grid-template-columns:1fr}.media-details{position:static}.media-photo-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.media-album-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:750px){.media-heading{align-items:start}.media-heading p{font-size:12px}.media-stats{grid-template-columns:repeat(3,minmax(0,1fr))}.media-stats>div{padding:12px}.media-stats strong{font-size:20px}.media-stats span{font-size:10px}.media-photo-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.media-photo-image{height:130px}.media-landing-layout{grid-template-columns:1fr}.media-section-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.media-section-list button{min-height:70px}.media-form-grid{grid-template-columns:1fr}.media-crop-wrap{grid-template-columns:1fr}.media-crop-preview{max-width:100%}}
@media(max-width:450px){.media-cover-picker{grid-template-columns:repeat(2,minmax(0,1fr))}.media-header-actions{width:100%;justify-content:space-between}.media-album-grid{grid-template-columns:1fr}.media-photo-image{height:108px}.media-panel.media-browser{padding:10px}.media-controls{flex-wrap:wrap}.media-filter-line :deep(.el-select){width:100%!important}.media-section-list{grid-template-columns:1fr}.media-section-editor{padding:14px}}
</style>
