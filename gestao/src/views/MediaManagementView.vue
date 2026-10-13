<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

type Album = { id: number; name: string; description: string }
type MediaPhoto = { id: number; name: string; albums: number[]; published: boolean; tone: number; src?: string }
type UploadItem = { file: File; preview: string }

const route = useRoute()
const router = useRouter()
const section = computed(() => route.path.endsWith('/albuns') ? 'albums' : route.path.endsWith('/landing') ? 'landing' : 'library')
const albums = ref<Album[]>([
  { id: 1, name: 'Competições', description: 'Registros de competições e arenas' },
  { id: 2, name: 'Oficinas', description: 'Cursos, treinamentos e oficinas' },
  { id: 3, name: 'Equipe e conquistas', description: 'Pessoas e premiações da RAS' },
  { id: 4, name: 'RAS nas Escolas', description: 'Ações de extensão' }
])
const photos = ref<MediaPhoto[]>([
  { id: 1, name: 'robo-competicao.jpg', albums: [1], published: true, tone: 0 },
  { id: 2, name: 'oficina-arduino.jpg', albums: [2], published: true, tone: 1 },
  { id: 3, name: 'equipe-premiacao.jpg', albums: [3, 1], published: true, tone: 2 },
  { id: 4, name: 'ras-nas-escolas.jpg', albums: [4], published: true, tone: 3 },
  { id: 5, name: 'voluntarios.jpg', albums: [3], published: false, tone: 4 },
  { id: 6, name: 'foto-avulsa.jpg', albums: [], published: false, tone: 5 },
  { id: 7, name: 'premiacao-2025.jpg', albums: [3], published: true, tone: 6 },
  { id: 8, name: 'oficina-robotica.jpg', albums: [2, 4], published: false, tone: 7 },
  { id: 9, name: 'laboratorio.jpg', albums: [], published: false, tone: 8 }
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
const cropDialog = ref(false)
const zoom = ref(115)
const positionX = ref(50)
const positionY = ref(50)
const displayWidth = ref(100)
const displayHeight = ref(100)
const landingSection = ref('Intro / Heroes')
const editorialTitle = ref('Oficina de Arduino na UFRB')
const editorialDescription = ref('Confira os registros da nossa oficina e conheça as atividades da IEEE RAS UFRB.')
const editorialDestination = ref('album')
const editorialAlbum = ref(2)
const editorialButton = ref('Ver fotos')
const landingSections = [
  { name: 'Intro / Heroes', detail: 'Imagens e destaques com botão para evento, álbum ou seção', symbol: '✦' },
  { name: 'Sobre', detail: 'Apenas fotografia e enquadramento', symbol: '▧' },
  { name: 'Equipe e conquistas', detail: 'Fotos da equipe e registros de conquistas', symbol: '♜' },
  { name: 'Robôs', detail: 'Imagens de apresentação dos robôs', symbol: '⚙' },
  { name: 'Eventos', detail: 'Imagens e informações dinâmicas', symbol: '▦' },
  { name: 'Patrocinadores', detail: 'Logos, tamanhos e ordenação', symbol: '◇' },
  { name: 'Competição', detail: 'Seção pública e Hero competitivo opcional', symbol: '★' }
]

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
  ElMessage.info('Álbum removido da prévia; as fotos foram preservadas.')
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
    id: start + i, name: item.file.name, albums: ids, published: false,
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
        <el-button v-if="section === 'library'" type="primary" @click="uploadDialog = true">＋ Adicionar fotos</el-button>
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
            <label>Visibilidade (prévia)</label>
            <el-switch v-model="selectedPhoto.published" active-text="Publicada" inactive-text="Privada" inline-prompt />
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
            <span>▧</span><b>{{ photos.filter(p => p.albums.includes(album.id)).length }} fotos</b>
          </div>
          <div class="media-album-body"><h2>{{ album.name }}</h2><p>{{ album.description || 'Coleção de imagens' }}</p>
            <div class="media-album-actions">
              <el-button size="small" type="primary" plain @click="showAlbum(album.id)">Ver fotos</el-button>
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
      <div class="media-landing-layout">
        <div class="media-section-list">
          <button v-for="item in landingSections" :key="item.name" :class="{ active: landingSection === item.name }"
            @click="landingSection = item.name"><span>{{ item.symbol }}</span><strong>{{ item.name }}</strong><small>{{ item.detail }}</small></button>
        </div>
        <section class="media-panel media-section-editor">
          <span class="media-kicker">EDIÇÃO POR SEÇÃO</span>
          <h2>{{ landingSection }}</h2>
          <template v-if="landingSection === 'Intro / Heroes'">
            <p>Os textos institucionais permanecem fixos. Este editor permitirá adicionar destaques com links para álbuns, eventos e outras seções.</p>
            <div class="media-demo-hero"><div class="media-demo-hero-copy"><small>DESTAQUE / PUBLICAÇÃO</small><h3>{{ editorialTitle }}</h3><p>{{ editorialDescription }}</p><span>{{ editorialButton || 'Ver fotos' }} →</span></div></div>
            <div class="media-form-grid">
              <el-form-item label="Título do destaque"><el-input v-model="editorialTitle" /></el-form-item>
              <el-form-item label="Botão"><el-input v-model="editorialButton" /></el-form-item>
              <el-form-item label="Destino do botão"><el-select v-model="editorialDestination"><el-option label="Álbum da Galeria" value="album" /><el-option label="Galeria completa" value="gallery" /><el-option label="Evento" value="event" /><el-option label="Seção da Landing" value="section" /></el-select></el-form-item>
              <el-form-item v-if="editorialDestination === 'album'" label="Álbum de destino"><el-select v-model="editorialAlbum"><el-option v-for="album in albums" :key="album.id" :label="album.name" :value="album.id"/></el-select></el-form-item>
              <el-form-item class="wide" label="Descrição"><el-input v-model="editorialDescription" type="textarea" :rows="3"/></el-form-item>
            </div>
            <el-button @click="demoOnly">Salvar rascunho (em breve)</el-button>
          </template>
          <template v-else>
            <p>{{ landingSections.find(item => item.name === landingSection)?.detail }}.</p>
            <div class="media-section-placeholder"><span>▧</span><strong>Área de prévia: {{ landingSection }}</strong><small>As opções serão ligadas ao acervo após a aprovação destas interfaces.</small></div>
            <el-button @click="router.push('/midia')">Escolher imagem da Biblioteca</el-button>
          </template>
        </section>
      </div>
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
      <template #footer><el-button @click="uploadDialog = false">Cancelar</el-button><el-button type="primary" @click="confirmUpload">Adicionar à prévia</el-button></template>
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
.media-photo-image img,.media-detail-photo img{width:100%;height:100%;object-fit:cover}
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
.media-album-body{padding:17px}.media-album-body h2{font-size:17px;margin:0 0 7px}.media-album-body p{color:#857985;font-size:12px;margin:0 0 17px}.media-album-actions{display:flex;gap:4px;flex-wrap:wrap}
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
.media-dialog-intro{color:#756a75;font-size:12px}.media-upload-drop{display:grid;place-items:center;min-height:103px;border:2px dashed #dfbacc;border-radius:11px;background:#fff7fa;color:#a80f3e;font-size:13px;font-weight:800;cursor:pointer}.media-upload-drop input{display:none}
.media-upload-preview{display:flex;gap:7px;overflow:auto;margin:12px 0}.media-upload-preview>div{min-width:84px;width:100px}.media-upload-preview img{height:66px;width:100%;object-fit:cover;border-radius:6px}.media-upload-preview span{display:block;font-size:9px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.media-dialog-choice{margin:15px 0}.dialog-checks{margin:12px 0}.media-crop-wrap{display:grid;grid-template-columns:1.2fr 1fr;gap:25px;align-items:start}.media-crop-preview{max-width:100%;margin:10px auto;display:grid;place-items:center;overflow:hidden;border-radius:10px;font-size:58px;color:#ffffffbb}.media-crop-preview img{width:100%;height:100%;object-fit:cover}.media-crop-inputs label{display:block;font-size:11px;color:#695c68;margin-bottom:10px}
@media(max-width:1360px){.media-library-grid{grid-template-columns:minmax(0,1fr) 225px}.media-photo-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.media-photo-image{height:115px}}
@media(max-width:1100px){.media-library-grid{grid-template-columns:1fr}.media-details{position:static}.media-photo-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.media-album-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:750px){.media-heading{align-items:start}.media-heading p{font-size:12px}.media-stats{grid-template-columns:repeat(3,minmax(0,1fr))}.media-stats>div{padding:12px}.media-stats strong{font-size:20px}.media-stats span{font-size:10px}.media-photo-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.media-photo-image{height:130px}.media-landing-layout{grid-template-columns:1fr}.media-section-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.media-section-list button{min-height:70px}.media-form-grid{grid-template-columns:1fr}.media-crop-wrap{grid-template-columns:1fr}.media-crop-preview{max-width:100%}}
@media(max-width:450px){.media-header-actions{width:100%;justify-content:space-between}.media-album-grid{grid-template-columns:1fr}.media-photo-image{height:108px}.media-panel.media-browser{padding:10px}.media-controls{flex-wrap:wrap}.media-filter-line :deep(.el-select){width:100%!important}.media-section-list{grid-template-columns:1fr}.media-section-editor{padding:14px}}
</style>
