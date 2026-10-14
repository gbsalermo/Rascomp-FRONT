<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import MediaLandingEditor from '../components/MediaLandingEditor.vue'
import { mediaApi, type MediaWorkspace, type ApiMediaPhoto } from '../api/media'
import { prepareEditorialUpload } from '../api/mediaDraft'
import { useAuthStore } from '../store'

type Album = { id: number; name: string; description: string; coverId?: number }
type MediaPhoto = { id: number; name: string; albums: number[]; published: boolean; tone: number; src?: string; sourcePath?: string; persisted?: boolean }
type UploadItem = { file: File; preview: string }
type MediaVisibility = 'private' | 'public'

const route = useRoute()
const router = useRouter()
type MediaEditorApi = {
  createPreviewDraft:()=>Record<string,unknown>
  getEditorState:()=>Record<string,unknown>
  restoreEditorState:(state:Record<string,unknown>)=>void
  getEditedSections:()=>string[]
  setEditedSections:(sections:unknown)=>void
}
const landingEditor = ref<MediaEditorApi|null>(null)
const devMode = import.meta.env.DEV
const cmsLoading = ref(true)
const cmsReady = ref(false)
const cmsError = ref('')
const cmsBusy = ref(false)
const cmsVersion = ref(0)
const cmsDraftSaved = ref(false)
const confirmPublishOpen = ref(false)
const importedSourceIds = new Map<string,number>()
const persistedEditorialDraft = ref<Record<string,unknown>|null>(null)
const cmsStatus = computed(()=>cmsReady.value ? 'Conectado ao CMS (MySQL/R2)' : cmsLoading.value ? 'Conectando ao CMS…' : 'CMS indisponível')
const canEditMedia = computed(()=>cmsReady.value && !cmsBusy.value)

const isLocalManagement = import.meta.env.DEV && ['localhost','127.0.0.1'].includes(location.hostname)
const isProductionManagement = location.origin==='https://app.rasufrb.site'
const previewSupported = isLocalManagement || isProductionManagement
const landingPreviewOrigin = isProductionManagement ? 'https://rasufrb.site' : 'http://localhost:5174'
let previewPopup:Window|null=null
let previewToken=''
let popupReady=false
let previewPacket:{draft:Record<string,unknown>;files:Record<string,Blob>}|null=null
let pendingConversion=0
async function preparePreviewPacket(source:Record<string,unknown>) {
  const files:Record<string,Blob>={}
  const visit=async (value:unknown):Promise<unknown>=>{
    if(Array.isArray(value))return Promise.all(value.map(visit))
    if(value && typeof value==='object'){
      const result:Record<string,unknown>={}
      for(const [key,item] of Object.entries(value)){
        if(key==='src' && typeof item==='string'){
          if(item.startsWith('blob:')){
            const identifier='image-'+Object.keys(files).length
            try {
              const blob=await fetch(item).then(r=>r.blob())
              if(blob.type.startsWith('image/')) {files[identifier]=blob;result[key]='rascomp-file:'+identifier}
              else result[key]=''
            }catch{result[key]=''}
          }else result[key]=item
        }else result[key]=await visit(item)
      }
      return result
    }
    return value
  }
  return {draft:await visit(source) as Record<string,unknown>,files}
}
function sendPreview() {
  if(!popupReady || !previewPopup || previewPopup.closed || !previewPacket || !previewToken)return
  previewPopup.postMessage({type:'rascomp:media-draft',token:previewToken,...previewPacket},landingPreviewOrigin)
}
async function updatePreview(source?:Record<string,unknown>) {
  const draft=source??landingEditor.value?.createPreviewDraft()
  if(!draft)return
  const id=++pendingConversion
  const next=await preparePreviewPacket(draft)
  if(id!==pendingConversion)return
  previewPacket=next
  sendPreview()
}
function previewMessage(event:MessageEvent) {
  if(event.origin!==landingPreviewOrigin || event.source!==previewPopup)return
  if(event.data?.type!=='rascomp:media-ready' || event.data?.token!==previewToken)return
  popupReady=true
  sendPreview()
}
window.addEventListener('message',previewMessage)
async function openSitePreview() {
  if(!previewSupported) {
    ElMessage.warning('A prévia só está disponível na Gestão autenticada do RasComp.');return
  }
  if(!landingEditor.value){ElMessage.warning('Abra a seção Landing para gerar a prévia.');return}
  if(!previewPopup || previewPopup.closed) {
    previewToken=crypto.randomUUID()
    popupReady=false
    previewPopup=window.open(landingPreviewOrigin+'/?rascomp_media_preview=1#preview='+previewToken,'rascomp-media-site-preview')
    if(!previewPopup){ElMessage.warning('O navegador bloqueou a janela. Permita pop-ups para localhost.');return}
  }else previewPopup.focus()
  ElMessage.info(isProductionManagement ? 'Prévia online privada: nenhuma alteração foi publicada.' : 'Prévia local: mantenha a Landing em localhost:5174.')
  await updatePreview()
}

// Prévia local da Galeria: a Gestão envia APENAS fotos explicitamente públicas.
const galleryPreviewOrigin = isProductionManagement ? 'https://rasufrb.site' : 'http://localhost:5175'
let galleryPopup:Window|null=null
let galleryToken=''
let galleryReady=false
let galleryPacket:{draft:Record<string,unknown>;files:Record<string,Blob>}|null=null
function sendGalleryPreview(){
  if(!galleryReady||!galleryPopup||galleryPopup.closed||!galleryToken||!galleryPacket)return
  galleryPopup.postMessage({type:'rascomp:gallery-draft',token:galleryToken,...galleryPacket},galleryPreviewOrigin)
}
function galleryMessage(event:MessageEvent){
  if(event.origin!==galleryPreviewOrigin||event.source!==galleryPopup)return
  if(event.data?.type!=='rascomp:gallery-ready'||event.data?.token!==galleryToken)return
  galleryReady=true
  sendGalleryPreview()
}
window.addEventListener('message',galleryMessage)
async function openGalleryPreview(){
  if(!previewSupported){
    ElMessage.warning('A prévia da Galeria requer acesso à Gestão de Mídia.');return
  }
  if(!galleryPopup||galleryPopup.closed){
    galleryToken=crypto.randomUUID()
    galleryReady=false
    galleryPopup=window.open(galleryPreviewOrigin+(isProductionManagement?'/galeria':'/')+'?rascomp_gallery_preview=1#preview='+galleryToken,'rascomp-gallery-editorial-preview')
    if(!galleryPopup){ElMessage.warning('Permita pop-ups do localhost para abrir a Galeria.');return}
  }else galleryPopup.focus()
  const publicPhotos=photos.value.filter(item=>item.published===true&&!!item.src).slice(0,400)
  const files:Record<string,Blob>={}
  const prepared=await Promise.all(publicPhotos.map(async item=>{
    let src=new URL(item.src!,location.origin).href
    if(item.src!.startsWith('blob:') || (isProductionManagement && new URL(item.src!,location.origin).origin===location.origin)){
      try {
        const blob=await fetch(item.src!).then(response=>response.blob())
        if(!blob.type.startsWith('image/'))return null
        const name='gallery-'+item.id
        files[name]=blob
        src='rascomp-file:'+name
      }catch{return null}
    }
    return {
      id:item.id,src,
      albumIds:[...item.albums],
      published:true as const,
      alt:'Fotografia publicada pela IEEE RAS UFRB'
    }
  }))
  const approved=prepared.filter(item=>item!==null)
  galleryPacket={
    draft:{photos:approved,albums:albums.value.map(album=>({
      id:album.id,name:album.name,description:album.description,coverId:album.coverId
    })),featuredPhotoIds:galleryIntroIds.value.filter(id=>approved.some(photo=>photo.id===id))},
    files
  }
  sendGalleryPreview()
  ElMessage.info(approved.length+' foto(s) encaminhadas à prévia da Galeria. Nenhuma imagem foi publicada.')
}

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
// No modo hospedado, nunca apresentar as nove fotos fictícias como acervo existente.
if (!import.meta.env.DEV) {
  photos.value=[]
  albums.value=[]
}
async function loadCmsWorkspace() {
  cmsLoading.value=true
  cmsError.value=''
  try {
    const data:MediaWorkspace=await mediaApi.workspace()
    cmsVersion.value=data.version
    cmsDraftSaved.value=Object.keys(data.editorialDraft||{}).length>0
    const oldPhotos=photos.value
    // Preservar recursos estáticos originais para edição/migração manual, mas
    // não tratá-los como mídias persistidas/publicadas na Galeria.
    photos.value=[...data.photos.map((item:ApiMediaPhoto):MediaPhoto=>({
      id:item.id,name:item.name,albums:item.albums,published:item.published,
      src:undefined,persisted:true,tone:item.id%9
    })),...legacyPhotos.map(x=>({...x,published:false}))]
    albums.value=data.albums.map(item=>({
      id:item.id,name:item.name,description:item.description,coverId:item.coverId??undefined
    }))
    cmsReady.value=true
    galleryIntroSlots.value=[
      ...(Array.isArray(data.featuredPhotoIds)?data.featuredPhotoIds:[]),
      null,null,null
    ].slice(0,3)
    persistedEditorialDraft.value=data.editorialDraft
    await nextTick()
    landingEditor.value?.setEditedSections(data.editorialDraft?.__editedSections)
    if(Object.keys(data.editorialDraft||{}).length&&data.editorialDraft?._editorState && landingEditor.value)
      landingEditor.value.restoreEditorState(data.editorialDraft._editorState as Record<string,unknown>)
    // Protege assets privados: thumbnails são obtidas COM JWT, não por URL pública.
    await Promise.allSettled(data.photos.map(async item=>{
      const blob=await mediaApi.image(item.id)
      const url=URL.createObjectURL(blob)
      uploadedUrls.push(url)
      const photo=photos.value.find(p=>p.id===item.id && p.persisted)
      if(photo)photo.src=url
      else URL.revokeObjectURL(url)
    }))
    cmsError.value=''
    void oldPhotos
  }catch(error){
    cmsReady.value=false
    cmsError.value=error instanceof Error?error.message:'Erro de comunicação com o CMS'
    // Em produção, esconder a simulação, para não parecer conteúdo salvo.
    if(!import.meta.env.DEV){photos.value=[];albums.value=[]}
  }finally{cmsLoading.value=false}
}
onMounted(()=>{void loadCmsWorkspace()})
async function saveEditorialDraft(){
  if(!canEditMedia.value || !landingEditor.value)return
  cmsBusy.value=true
  try{
    const draft=await prepareEditorialUpload(
      {...landingEditor.value.createPreviewDraft(),__editedSections:landingEditor.value.getEditedSections()},
      landingEditor.value.getEditorState(),
      photos.value,
      (id,name,source,blob)=>{
        const url=URL.createObjectURL(blob)
        uploadedUrls.push(url)
        photos.value.unshift({id,name,src:url,albums:[],published:false,persisted:true,tone:id%9})
      }
    )
    await mediaApi.saveDraft(draft)
    persistedEditorialDraft.value=draft
    cmsDraftSaved.value=true
    const savedSections=Array.isArray(draft.__editedSections) ? draft.__editedSections as string[] : []
    ElMessage.success(savedSections.length ? 'Rascunho salvo. Seções: '+savedSections.join(', ')+'. Ainda não publicado.' : 'Rascunho salvo sem seções editoriais modificadas identificadas.')
  }catch(error){
    ElMessage.error(error instanceof Error?error.message:'Não foi possível salvar o rascunho.')
  }finally{cmsBusy.value=false}
}
async function publishChanges(){
  if(!canEditMedia.value)return
  const isLandingPublication=section.value==='landing'
  if(isLandingPublication && !cmsDraftSaved.value){
    ElMessage.warning('Salve o rascunho da Landing antes de publicá-lo.')
    return
  }
  cmsBusy.value=true
  try{
    // Publicar a Galeria NUNCA libera alterações editoriais pendentes na Landing.
    const response=isLandingPublication
      ? await mediaApi.publish(cmsVersion.value)
      : await mediaApi.publishGallery(cmsVersion.value)
    cmsVersion.value=response.version
    if(isLandingPublication)cmsDraftSaved.value=false
    confirmPublishOpen.value=false
    ElMessage.success(isLandingPublication
      ? 'Landing e Galeria publicadas na versão '+response.version+'.'
      : 'Galeria publicada! As fotos públicas e os álbuns já podem aparecer em /galeria.')
  }catch(error){
    ElMessage.error(error instanceof Error?error.message:'Não foi possível publicar. Verifique o CMS e atualize os dados.')
  }finally{cmsBusy.value=false}
}

watch([landingEditor,persistedEditorialDraft],()=>{
  const state=persistedEditorialDraft.value?._editorState
  if(landingEditor.value && state && typeof state==='object'){
    landingEditor.value.setEditedSections(persistedEditorialDraft.value?.__editedSections)
    landingEditor.value.restoreEditorState(state as Record<string,unknown>)
  }
},{flush:'post'})


const search = ref('')
const albumFilter = ref('all')
const selectedIds = ref<number[]>([])
const multiSelectionMode = ref(false)
const selectedPhotos = computed(() => photos.value.filter(item => selectedIds.value.includes(item.id)))
const bulkAlbumDialog = ref(false)
const bulkAlbumIds = ref<number[]>([])
const galleryIntroDialog = ref(false)
const galleryIntroSlots = ref<(number | null)[]>([null, null, null])
const galleryEligiblePhotos = computed(() => photos.value.filter(photo => photo.published && !!photo.src))
const galleryIntroIds = computed(() => {
  const allowed = galleryEligiblePhotos.value.map(photo => photo.id)
  const selected = galleryIntroSlots.value.filter((id): id is number => id !== null && allowed.includes(id))
  const result = [...new Set(selected)]
  for (const id of allowed) {
    if (result.length === 3) break
    if (!result.includes(id)) result.push(id)
  }
  return result.slice(0, 3)
})
function openGalleryIntroDialog() {
  galleryIntroSlots.value = [...galleryIntroIds.value, null, null].slice(0, 3)
  galleryIntroDialog.value = true
}
async function saveGalleryIntro() {
  if (galleryIntroIds.value.length !== 3) {
    ElMessage.warning('Selecione três fotografias públicas com imagem para preencher os destaques.')
    return
  }
  if(cmsReady.value){
    try{await mediaApi.saveFeatured(galleryIntroIds.value)}
    catch(error){ElMessage.error('Falha ao salvar os destaques no MySQL.');return}
  }
  galleryIntroSlots.value = [...galleryIntroIds.value]
  galleryIntroDialog.value = false
  ElMessage.success(cmsReady.value?'Destaques salvos no MySQL. Clique em Publicar Galeria para atualizar os visitantes.':'Destaques alterados somente no modo local.')
}
function toggleMultiSelection() {
  multiSelectionMode.value = !multiSelectionMode.value
  selectedIds.value = []
}
function selectVisiblePhotos() {
  selectedIds.value = [...new Set([...selectedIds.value, ...visiblePhotos.value.map(photo => photo.id)])]
}
function openBulkAlbumDialog() {
  if (!selectedIds.value.length) return
  bulkAlbumIds.value = []
  bulkAlbumDialog.value = true
}
async function addSelectedToAlbums() {
  if (!selectedIds.value.length || !bulkAlbumIds.value.length) {
    ElMessage.warning('Selecione pelo menos um álbum.')
    return
  }
  const validIds = new Set(albums.value.map(album => album.id))
  const toAdd = bulkAlbumIds.value.filter(id => validIds.has(id))
  if(cmsReady.value){
    try{await mediaApi.bulkAlbums(selectedIds.value,toAdd)}
    catch(error){ElMessage.error('Não foi possível adicionar as fotografias aos álbuns.');return}
  }
  selectedPhotos.value.forEach(photo => {
    photo.albums = [...new Set([...photo.albums, ...toAdd])]
  })
  bulkAlbumDialog.value = false
  ElMessage.success(selectedIds.value.length+' foto(s) associadas aos álbuns no MySQL. Publique a Galeria para atualizar o site.')
}
async function deleteSelectedPhotos() {
  if (!selectedIds.value.length) return
  const count = selectedIds.value.length
  try {
    await ElMessageBox.confirm(
      'Excluir '+count+' foto(s) do armazenamento R2 e do MySQL? Essa operação não pode ser desfeita. Fotografias já publicadas devem ser despublicadas primeiro.',
      'Excluir fotos selecionadas',
      { type: 'warning', confirmButtonText: 'Excluir permanentemente', cancelButtonText: 'Cancelar', confirmButtonClass: 'media-confirm-danger' }
    )
  } catch { return }
  const ids = new Set(selectedIds.value)
  if(cmsReady.value){
    try{
      for(const id of ids)await mediaApi.deletePhoto(id)
    }catch(error){
      ElMessage.error('Exclusão interrompida: alguma fotografia está publicada ou em uso. Atualize a Biblioteca.')
      await loadCmsWorkspace()
      return
    }
  }
  photos.value = photos.value.filter(item => !ids.has(item.id))
  albums.value.forEach(album => {
    if (album.coverId && ids.has(album.coverId)) album.coverId = undefined
    if (ids.has(autoCovers.get(album.id) || -1)) autoCovers.delete(album.id)
  })
  galleryIntroSlots.value = galleryIntroSlots.value.map(id => id !== null && ids.has(id) ? null : id)
  selectedIds.value = []
  ElMessage.success(count+' foto(s) removidas da Biblioteca. Publique a Galeria para atualizar os visitantes.')
}

const selectedPhoto = computed(() => photos.value.find(photo => photo.id === selectedIds.value[0]))
const visiblePhotos = computed(() => photos.value.filter(photo => {
  const q = photo.name.toLocaleLowerCase('pt-BR').includes(search.value.toLocaleLowerCase('pt-BR'))
  if (!q) return false
  if (albumFilter.value === 'none') return photo.albums.length === 0
  if (albumFilter.value === 'public') return photo.published
  if (albumFilter.value === 'private') return !photo.published
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
async function chooseAlbumCover(photoId: number | undefined) {
  const album = albums.value.find(item => item.id === coverPickerAlbumId.value)
  if(album && cmsReady.value){
    try{await mediaApi.updateAlbum(album.id,album.name,album.description,photoId)}
    catch(error){ElMessage.error('Não foi possível atualizar a capa.');return}
  }
  if(album)album.coverId=photoId
  coverPickerAlbumId.value=null
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
  if (multi || multiSelectionMode.value) {
    selectedIds.value = selectedIds.value.includes(id)
      ? selectedIds.value.filter(value => value !== id)
      : [...selectedIds.value, id]
  } else selectedIds.value = [id]
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
async function saveAlbum() {
  const name = albumDraft.value.trim()
  if (!name) { ElMessage.warning('Informe o nome do álbum.'); return }
  if(cmsReady.value){
    try{
      if(editingAlbumId.value!==null){
        const previous=albums.value.find(album=>album.id===editingAlbumId.value)
        await mediaApi.updateAlbum(editingAlbumId.value,name,albumDescriptionDraft.value,previous?.coverId)
        if(previous){previous.name=name;previous.description=albumDescriptionDraft.value}
      }else{
        const id=await mediaApi.createAlbum(name,albumDescriptionDraft.value)
        albums.value.push({id,name,description:albumDescriptionDraft.value})
      }
    }catch(error){ElMessage.error('Não foi possível salvar o álbum no MySQL.');return}
  }else{
    if(editingAlbumId.value!==null){
      const album=albums.value.find(item=>item.id===editingAlbumId.value)
      if(album){album.name=name;album.description=albumDescriptionDraft.value}
    }else createAlbum(name,albumDescriptionDraft.value)
  }
  albumDialog.value=false
  ElMessage.success(cmsReady.value?'Álbum salvo no MySQL. Clique em Publicar Galeria para atualizar o site.':'Álbum alterado somente no modo local.')
}
async function removeAlbum(id: number) {
  if(cmsReady.value){
    try{await mediaApi.deleteAlbum(id)}
    catch(error){ElMessage.error('Não foi possível excluir o álbum.');return}
  }
  photos.value.forEach(photo => { photo.albums = photo.albums.filter(albumId => albumId !== id) })
  albums.value = albums.value.filter(album => album.id !== id)
  if (albumFilter.value === String(id)) albumFilter.value = 'all'
  autoCovers.delete(id)
  ElMessage.info('Álbum excluído do MySQL. As fotos foram preservadas. Publique a Galeria para refletir a mudança.')
}
function addPhotoForEditor(file: File): number {
  if (!file.type.startsWith('image/')) { ElMessage.warning('Selecione um arquivo de imagem.'); return 0 }
  const url = URL.createObjectURL(file)
  uploadedUrls.push(url)
  const id = Math.max(0, ...photos.value.map(item => item.id)) + 1
  // Fotos adicionadas por um editor da Landing começam privadas na Galeria.
  // A publicação é uma ação independente e explícita na Biblioteca.
  photos.value.unshift({ id, name: file.name, src: url, albums: [], published: false, tone: id % 9 })
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
async function confirmUpload() {
  if(!uploads.value.length){ElMessage.warning('Selecione pelo menos uma imagem.');return}
  if(cmsBusy.value)return
  cmsBusy.value=true
  try{
    let ids:number[]=[]
    if(uploadTarget.value==='existing')ids=[...targetAlbumIds.value]
    if(uploadTarget.value==='new'){
      const title=newAlbumName.value.trim()
      if(!title){ElMessage.warning('Informe o nome do álbum.');return}
      const id=cmsReady.value?await mediaApi.createAlbum(title):createAlbum(title)
      if(cmsReady.value)albums.value.push({id,name:title,description:''})
      ids=[id]
    }
    const added:MediaPhoto[]=[]
    let next=Math.max(0,...photos.value.map(p=>p.id))+1
    for(const item of uploads.value){
      if(cmsReady.value){
        const uploaded=await mediaApi.upload(item.file,uploadVisibility.value==='public')
        if(ids.length)await mediaApi.albumsForPhoto(uploaded.id,ids)
        added.push({
          id:uploaded.id,name:uploaded.name,albums:ids,published:uploadVisibility.value==='public',
          persisted:true,tone:uploaded.id%9,src:item.preview
        })
      }else added.push({
        id:next++,name:item.file.name,albums:ids,published:uploadVisibility.value==='public',
        tone:next%9,src:item.preview
      })
    }
    photos.value=[...added,...photos.value]
    selectedIds.value=added.map(item=>item.id)
    albumFilter.value='all'
    uploads.value=[]
    uploadDialog.value=false
    ElMessage.success(cmsReady.value?'Fotos salvas no R2/MySQL. Clique em Publicar Galeria quando desejar exibi-las no site.':'Fotos adicionadas somente ao modo de desenvolvimento.')
  }catch(error){
    ElMessage.error(error instanceof Error?error.message:'Falha no upload de imagem')
    if(cmsReady.value)await loadCmsWorkspace()
  }finally{cmsBusy.value=false}
}
async function changePhotoAlbum(id: number, enabled: boolean) {
  const photo = selectedPhoto.value
  if (!photo) return
  const next=enabled ? [...new Set([...photo.albums, id])] : photo.albums.filter(albumId => albumId !== id)
  if(cmsReady.value){
    try{await mediaApi.albumsForPhoto(photo.id,next)}
    catch(error){ElMessage.error('Não foi possível salvar a associação no MySQL.');return}
  }
  photo.albums=next
}
async function persistVisibility(published:boolean) {
  const target=selectedPhoto.value
  if(!target)return
  if(cmsReady.value){
    try{await mediaApi.visibility(target.id,published)}
    catch(error){target.published=!published;ElMessage.error('Não foi possível salvar a visibilidade.');return}
  }
  ElMessage.info(cmsReady.value?'Visibilidade registrada no MySQL. Clique em Publicar Galeria para aplicar no site.':'Visibilidade alterada somente no modo local.')
}
function openCrop() {
  if (!selectedPhoto.value) return
  zoom.value = 115; positionX.value = 50; positionY.value = 50
  displayWidth.value = 100; displayHeight.value = 100
  cropDialog.value = true
}
function showAlbum(id: number) { albumFilter.value = String(id); router.push('/midia') }
onBeforeUnmount(() => {window.removeEventListener('message',previewMessage);window.removeEventListener('message',galleryMessage);uploadedUrls.forEach(url => URL.revokeObjectURL(url))})
</script>

<template>
  <main class="media-management page-stack">
    <div class="media-heading">
      <div>
        <span class="media-kicker">IEEE RAS · ADMINISTRAÇÃO EDITORIAL</span>
        <h1>{{ section === 'library' ? 'Biblioteca de imagens' : section === 'albums' ? 'Álbuns' : 'Conteúdo da Landing' }}</h1>
        <p v-if="section === 'library'">Organize as fotografias no R2/MySQL, escolha as públicas e publique a Galeria quando estiver pronta.</p>
        <p v-else-if="section === 'albums'">Organize coleções sem duplicar imagens no armazenamento.</p>
        <p v-else>Gerencie as imagens das seções sem alterar o conteúdo institucional permanente.</p>
      </div>
      <div class="media-header-actions">
        <span class="media-demo-label">{{ cmsStatus }}</span>
        <el-button v-if="!cmsReady && !cmsLoading" @click="loadCmsWorkspace">Reconectar CMS</el-button>
        <el-button v-if="section === 'library' || section === 'albums'" @click="openGalleryIntroDialog">Destaques da Galeria</el-button>
        <el-button v-if="section === 'library' || section === 'albums'" @click="openGalleryPreview">Prévia da Galeria ↗</el-button>
        <el-button v-if="section === 'library'" type="primary" @click="openUploadDialog">＋ Adicionar fotos</el-button>
        <el-button v-if="section === 'albums'" type="primary" @click="openAlbumDialog()">＋ Novo álbum</el-button>
        <el-button v-if="section === 'landing'" :disabled="!cmsReady" @click="saveEditorialDraft">Salvar rascunho</el-button>
        <el-button v-if="section === 'landing'" type="primary" @click="openSitePreview">Prévia do site ↗</el-button>
        <el-button type="primary" :disabled="!canEditMedia || (section === 'landing' && !cmsDraftSaved)" @click="confirmPublishOpen=true">{{ section === 'landing' ? 'Publicar alterações' : 'Publicar Galeria' }}</el-button>
      </div>
    </div>

    <div v-if="cmsError" class="media-connect-error">
      <strong>CMS ainda não conectado.</strong>
      <span>{{ cmsError }}</span>
      <span v-if="devMode">Durante o desenvolvimento, é possível revisar a demonstração local; nada será salvo sem o backend.</span>
    </div>
    <template v-if="cmsReady || (devMode && !cmsLoading)">
      <template v-if="section === 'library'">
      <div class="media-stats">
        <div><span>Imagens na Biblioteca</span><strong>{{ photos.length }}</strong></div>
        <div><span>Sem álbum</span><strong>{{ photos.filter(p => !p.albums.length).length }}</strong></div>
        <div><span>Álbuns existentes</span><strong>{{ albums.length }}</strong></div>
      </div>
      <div class="media-library-grid">
        <section class="media-panel media-browser">
          <div class="media-bulk-toolbar">
            <el-button :type="multiSelectionMode ? 'primary' : 'default'" :plain="multiSelectionMode"
              @click="toggleMultiSelection">{{ multiSelectionMode ? 'Concluir seleção' : 'Selecionar várias' }}</el-button>
            <template v-if="multiSelectionMode">
              <span class="media-bulk-count">{{ selectedIds.length }} selecionada(s)</span>
              <el-button @click="selectVisiblePhotos">Selecionar visíveis</el-button>
              <el-button :disabled="!selectedIds.length" @click="selectedIds=[]">Limpar</el-button>
              <el-button :disabled="!selectedIds.length" @click="openBulkAlbumDialog">Adicionar a álbuns</el-button>
              <el-button type="danger" :disabled="!selectedIds.length" @click="deleteSelectedPhotos">Excluir selecionadas</el-button>
            </template>
          </div>
          <div class="media-controls">
            <el-input v-model="search" clearable placeholder="Buscar imagens..." class="media-search" />
            <el-button @click="openAlbumDialog()">＋ Novo álbum</el-button>
          </div>
          <div class="media-filter-line">
            <button :class="{ active: albumFilter === 'all' }" @click="albumFilter = 'all'">Todas</button>
            <button :class="{ active: albumFilter === 'none' }" @click="albumFilter = 'none'">Sem álbum</button>
            <button :class="{ active: albumFilter === 'public' }" @click="albumFilter = 'public'">Na Galeria</button>
            <button :class="{ active: albumFilter === 'private' }" @click="albumFilter = 'private'">Privadas</button>
            <el-select v-model="albumFilter" style="width:190px" placeholder="Escolher álbum">
              <el-option label="Todos os álbuns" value="all" />
              <el-option v-for="album in albums" :key="album.id" :label="album.name" :value="String(album.id)" />
            </el-select>
            <span class="media-results">{{ visiblePhotos.length }} imagens</span>
          </div>
          <div v-if="visiblePhotos.length" class="media-photo-grid">
            <button v-for="photo in visiblePhotos" :key="photo.id" type="button" class="media-photo-tile"
              :class="{ selected: selectedIds.includes(photo.id) }" :aria-pressed="selectedIds.includes(photo.id)" @click="togglePhoto(photo.id, $event.ctrlKey || $event.metaKey)">
              <span class="media-photo-image" :class="'tone-' + photo.tone">
                <img v-if="photo.src" :src="photo.src" :alt="photo.name" />
                <span v-else class="media-photo-symbol">{{ ['⚙','◈','★','▣','✦','▦','◆','✳','◇'][photo.tone] }}</span>
                <span class="media-tile-check">{{ selectedIds.includes(photo.id) ? '✓' : '○' }}</span>
              </span>
              <span class="media-tile-caption"><strong>{{ photo.name }}</strong><small>{{ photo.albums.length ? photo.albums.map(albumName).join(' · ') : 'Sem álbum' }}</small></span>
            </button>
          </div>
          <div v-else class="media-empty">Nenhuma imagem encontrada para este filtro.</div>
          <p class="media-hint">{{ multiSelectionMode ? 'Selecione fotos com cliques simples. As ações acima afetam todas as selecionadas.' : 'Clique para ver os detalhes. Use Selecionar várias para agir em lote ou Ctrl + clique.' }}</p>
        </section>
        <aside class="media-panel media-details">
          <template v-if="selectedPhoto && (!multiSelectionMode || selectedIds.length === 1)">
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
            <label>Incluir na próxima publicação da Galeria</label>
            <el-switch v-model="selectedPhoto.published" active-text="Sim" inactive-text="Não" @change="persistVisibility(Boolean($event))"/>
            <p class="media-visibility-help">Fotos marcadas como públicas ficam disponíveis após clicar em <strong>Publicar Galeria</strong>. Uma imagem usada na Landing pode continuar privada na Galeria. Use a Prévia para conferir antes de publicar.</p>
            <div class="media-detail-actions"><el-button @click="openCrop">Editar enquadramento</el-button></div>
          </template>
          <div v-else-if="multiSelectionMode && selectedIds.length > 1" class="media-selection-summary">
            <h2>Seleção múltipla</h2><strong>{{ selectedIds.length }} fotografias</strong>
            <p>Utilize a barra acima para associá-las aos álbuns ou excluí-las do armazenamento. As alterações nos visitantes exigem nova publicação.</p>
          </div>
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
      <MediaLandingEditor ref="landingEditor" :photos="photos" :albums="albums" :upload-photo="addPhotoForEditor" @draft-applied="updatePreview" />
    </template>

    </template>
    <el-dialog v-model="confirmPublishOpen" :title="section === 'landing' ? 'Publicar Landing e Galeria' : 'Publicar Galeria'" width="min(560px,94vw)">
      <p class="media-dialog-intro" v-if="section === 'landing'">Publicar o rascunho editorial salvo no MySQL e atualizar a Galeria. Os visitantes verão a nova versão da Landing; as fotos privadas continuarão fora da Galeria.</p>
      <p class="media-dialog-intro" v-else>Publicar apenas as fotografias marcadas como públicas, seus álbuns e destaques. Rascunhos pendentes da Landing não serão publicados. Fotos privadas continuam protegidas.</p>
      <p class="media-dialog-intro">Versão publicada atual: {{ cmsVersion }}.</p>
      <template #footer>
        <el-button @click="confirmPublishOpen=false">Cancelar</el-button>
        <el-button type="primary" :loading="cmsBusy" @click="publishChanges">Confirmar publicação</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="bulkAlbumDialog" class="media-album-dialog" title="Adicionar seleção aos álbuns"
      width="min(540px,94vw)">
      <p class="media-dialog-intro">Adicionar {{ selectedIds.length }} fotos a um ou mais álbuns. As associações existentes serão mantidas, sem duplicar fotos.</p>
      <el-checkbox-group v-model="bulkAlbumIds" class="media-bulk-album-options">
        <el-checkbox v-for="album in albums" :key="album.id" :value="album.id">{{ album.name }}</el-checkbox>
      </el-checkbox-group>
      <p v-if="!albums.length" class="media-dialog-intro">Crie um álbum antes de associar as fotografias.</p>
      <template #footer>
        <el-button @click="bulkAlbumDialog=false">Cancelar</el-button>
        <el-button type="primary" :disabled="!bulkAlbumIds.length" @click="addSelectedToAlbums">Adicionar fotos</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="galleryIntroDialog" class="media-album-dialog" title="3 fotos principais da Galeria" width="min(790px,96vw)">
      <p class="media-dialog-intro">Escolha a ordem das três fotos que aparecem no mosaico de abertura. Somente fotografias marcadas como públicas podem ser usadas aqui. O destaque não muda a visibilidade das fotos.</p>
      <div class="media-intro-picker">
        <section v-for="slot in 3" :key="slot" class="media-intro-slot">
          <strong>{{ slot }}ª foto</strong>
          <div class="media-intro-image">
            <img v-if="photos.find(p=>p.id===galleryIntroSlots[slot-1])?.src"
              :src="photos.find(p=>p.id===galleryIntroSlots[slot-1])?.src" alt="Prévia da foto selecionada"/>
            <span v-else>Escolha uma foto pública</span>
          </div>
          <el-select :model-value="galleryIntroSlots[slot-1]" filterable clearable placeholder="Escolher foto"
            @update:model-value="galleryIntroSlots[slot-1]=($event as number|null)">
            <el-option v-for="photo in galleryEligiblePhotos" :key="photo.id" :label="photo.name" :value="photo.id"
              :disabled="galleryIntroSlots.some((id,i)=>id===photo.id && i!==slot-1)"/>
          </el-select>
        </section>
      </div>
      <p v-if="galleryEligiblePhotos.length<3" class="media-dialog-intro">Para completar a Intro, marque ao menos três fotografias com imagem como públicas na Biblioteca.</p>
      <p class="media-dialog-intro">As escolhas são salvas no CMS. Utilize <strong>Prévia da Galeria</strong> para conferir e <strong>Publicar Galeria</strong> para disponibilizar aos visitantes.</p>
      <template #footer>
        <el-button @click="galleryIntroDialog=false">Cancelar</el-button>
        <el-button type="primary" :disabled="!canEditMedia || galleryIntroIds.length!==3" @click="saveGalleryIntro">Salvar destaques</el-button>
      </template>
    </el-dialog>

    <el-dialog class="media-upload-dialog" v-model="uploadDialog" title="Adicionar fotos à Biblioteca" width="min(620px, 94vw)" destroy-on-close>
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
          <el-radio value="public">Públicas — disponíveis após clicar em Publicar Galeria</el-radio>
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
        <p>Fotos enviadas são armazenadas no R2 e registradas no MySQL. A opção <strong>Públicas</strong> permite exibi-las na próxima publicação da Galeria; a publicação ocorre pelo botão <strong>Publicar Galeria</strong>. O uso em Heroes ou eventos é independente dessa escolha.</p>
      </div>
      <template #footer><el-button @click="uploadDialog = false">Cancelar</el-button><el-button type="primary" :loading="cmsBusy" :disabled="!canEditMedia || !uploads.length" @click="confirmUpload">Enviar para a Biblioteca</el-button></template>
    </el-dialog>


    <el-dialog class="media-cover-dialog" :model-value="coverPickerAlbumId !== null" title="Capa do álbum" width="min(650px, 94vw)" @close="coverPickerAlbumId = null">
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
    <el-dialog class="media-album-dialog" v-model="albumDialog" :title="editingAlbumId === null ? 'Criar álbum' : 'Editar álbum'" width="min(480px, 94vw)">
      <el-form label-position="top"><el-form-item label="Nome"><el-input v-model="albumDraft" placeholder="Ex.: Oficina de Arduino" /></el-form-item>
        <el-form-item label="Descrição"><el-input v-model="albumDescriptionDraft" type="textarea" :rows="3"/></el-form-item></el-form>
      <template #footer><el-button @click="albumDialog = false">Cancelar</el-button><el-button type="primary" @click="saveAlbum">Confirmar</el-button></template>
    </el-dialog>

    <el-dialog class="media-crop-dialog" v-model="cropDialog" title="Enquadramento da imagem" width="min(800px, 95vw)">
      <p class="media-dialog-intro">Simulação do enquadramento, sem alterar a imagem original. Para salvar o enquadramento de uma seção, utilize o editor correspondente na Landing e salve o rascunho.</p>
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
        <el-button type="primary" @click="cropDialog=false">Fechar</el-button></template>
    </el-dialog>
  </main>
</template>

<style scoped>
.media-connect-error{display:flex;flex-direction:column;gap:8px;padding:17px;border:1px solid #d7afc5;border-radius:11px;background:#fff6f8;color:#6a2c4d;font-size:12px}

.media-bulk-toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:0 0 12px;margin-bottom:13px;border-bottom:1px solid #eee6ec}
.media-bulk-toolbar .el-button{min-height:35px;margin:0;padding:8px 12px}
.media-bulk-count{font-weight:750;font-size:12px;color:#a71947;margin:0 2px}
.media-selection-summary{display:grid;gap:13px;padding:12px;color:#654e60}
.media-selection-summary h2{margin:0;font-size:16px}
.media-selection-summary strong{font-size:22px;color:#a71947}
.media-selection-summary p{font-size:12px;line-height:1.6;color:#746877}
.media-intro-picker{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.media-intro-slot{min-width:0;display:flex;flex-direction:column;gap:9px;border:1px solid #eee5ec;border-radius:11px;padding:12px;background:#fff}
.media-intro-slot>strong{color:#a31e50;font-size:12px}
.media-intro-image{width:100%;height:145px;display:grid;place-items:center;overflow:hidden;border-radius:9px;background:#f6f2f5}
.media-intro-image>img{width:100%;height:100%;object-fit:contain}
.media-intro-image>span{font-size:11px;text-align:center;color:#918491}
.media-bulk-album-options{display:flex;flex-direction:column;gap:10px}
@media(max-width:640px){.media-intro-picker{grid-template-columns:1fr}.media-intro-slot{min-height:0}.media-intro-image{height:130px}}

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
