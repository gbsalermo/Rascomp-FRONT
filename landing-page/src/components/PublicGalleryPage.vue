<script setup lang="ts">
import {computed,onMounted,onBeforeUnmount,ref,watch} from 'vue'
import {preloadImages,showPreparedImage} from '../utils/imagePreload'
import {API_URL} from '../api'

type Photo={id:number;src:string;alt:string;albumIds:number[];published:boolean}
type Album={id:number;name:string;description:string;coverId?:number}
type Gallery={photos:Photo[];albums:Album[];featuredPhotoIds:number[]}
const blank=():Gallery=>({photos:[],albums:[],featuredPhotoIds:[]})
const gallery=ref<Gallery>(blank())
const loading=ref(true)
const error=ref('')
const albumId=ref<number|null>(null)
const view=ref<'todas'|'albuns'>('todas')
const selected=ref<number|null>(null)
const chosen=computed(()=>gallery.value.photos.filter(photo=>photo.published && photo.src))
const albums=computed(()=>gallery.value.albums.filter(album=>chosen.value.some(photo=>photo.albumIds.includes(album.id))))
const currentAlbum=computed(()=>albums.value.find(album=>album.id===albumId.value))
const displayed=computed(()=>currentAlbum.value?chosen.value.filter(photo=>photo.albumIds.includes(currentAlbum.value!.id)):chosen.value)
const featured=computed(()=>{
  const items:Photo[]=[]
  for(const id of gallery.value.featuredPhotoIds||[]){
    const item=chosen.value.find(p=>p.id===id)
    if(item&&!items.includes(item))items.push(item)
  }
  for(const item of chosen.value){if(items.length>=3)break;if(!items.includes(item))items.push(item)}
  return items.slice(0,3)
})
const showing=computed(()=>selected.value!==null?displayed.value[selected.value]||null:null)
// Preparar as fotos exibidas na Galeria, sem solicitar novamente ao abrir o modal.
watch(displayed,items=>preloadImages(items.map(photo=>photo.src),Math.min(items.length,12)),{immediate:true})
let galleryNavigation=0
function openPhoto(index:number){
  const photo=displayed.value[index]
  if(!photo)return
  const token=++galleryNavigation
  void showPreparedImage(photo.src,()=>{
    if(token!==galleryNavigation)return
    selected.value=index
    preloadImages([displayed.value[index-1]?.src,displayed.value[index+1]?.src])
  })
}
function closePhoto(){++galleryNavigation;selected.value=null}
const isPreview=new URLSearchParams(window.location.search).get('rascomp_gallery_preview')==='1'
const temporaryUrls:string[]=[]
const allowedPreviewOrigins=['https://app.rasufrb.site','http://localhost:5173','http://127.0.0.1:5173']
const token=new URLSearchParams(window.location.hash.slice(1)).get('preview')
const safeSrc=(src:string)=>src.startsWith('blob:')?src:new URL(src,API_URL).href
let sender:Window|null=null
function onMessage(event:MessageEvent){
  if(!sender || event.source!==sender || !allowedPreviewOrigins.includes(event.origin))return
  const message=event.data
  if(message?.type!=='rascomp:gallery-draft' || message.token!==token)return
  if(!Array.isArray(message.draft?.photos)||!Array.isArray(message.draft?.albums))return
  for(const url of temporaryUrls)URL.revokeObjectURL(url)
  temporaryUrls.length=0
  const files:Record<string,Blob>=message.files||{}
  const photos:Photo[]=message.draft.photos
    .filter((p:Photo)=>p.published===true && Array.isArray(p.albumIds))
    .slice(0,400)
    .map((p:Photo)=>{
      let src=''
      if(p.src.startsWith('rascomp-file:')){
        const blob=files[p.src.slice('rascomp-file:'.length)]
        if(blob && blob.type.startsWith('image/')){src=URL.createObjectURL(blob);temporaryUrls.push(src)}
      }else if(/^http:\/\/(localhost|127\.0\.0\.1):5173\//.test(p.src)){
        src=p.src
      }
      return {...p,src,alt:'Fotografia publicada pela IEEE RAS UFRB'}
    }).filter((p:Photo)=>Boolean(p.src))
  gallery.value={
    photos,albums:message.draft.albums,
    featuredPhotoIds:Array.isArray(message.draft.featuredPhotoIds)?message.draft.featuredPhotoIds:[]
  }
  loading.value=false
  error.value=''
}
async function loadGallery(){
  if(isPreview)return
  loading.value=true
  try{
    const response=await fetch(API_URL+'/api/v1/public/media/gallery')
    if(!response.ok)throw Error('API da Galeria indisponível')
    const data=await response.json() as Gallery
    if(!Array.isArray(data.photos)||!Array.isArray(data.albums))throw Error('Dados inválidos')
    gallery.value={...data,photos:data.photos.filter(p=>p.published===true).map(p=>({...p,src:safeSrc(p.src)}))}
    error.value=''
  }catch(e){gallery.value=blank();error.value=e instanceof Error?e.message:'Falha ao carregar a Galeria'}
  finally{loading.value=false}
}
function chooseAlbum(id:number){
  albumId.value=id
  view.value='todas'
  closePhoto()
}
function goBack(){albumId.value=null;view.value='albuns';closePhoto()}
function shift(delta:number){
  if(selected.value===null || displayed.value.length<2)return
  openPhoto((selected.value+delta+displayed.value.length)%displayed.value.length)
}
function onKey(e:KeyboardEvent){
  if(selected.value===null)return
  if(e.key==='Escape'){closePhoto();return}
  if(e.key==='ArrowLeft')shift(-1)
  if(e.key==='ArrowRight')shift(1)
}
onMounted(()=>{
  if(isPreview && token && /^[a-f\d-]{30,60}$/i.test(token) && window.opener){
    sender=window.opener
    const ref=(()=>{try{return new URL(document.referrer).origin}catch{return ''}})()
    const origin=allowedPreviewOrigins.includes(ref)?ref:allowedPreviewOrigins[0]!
    window.addEventListener('message',onMessage)
    const opener=sender
    opener?.postMessage({type:'rascomp:gallery-ready',token},origin)
  }else void loadGallery()
  window.addEventListener('keydown',onKey)
})
onBeforeUnmount(()=>{
  window.removeEventListener('message',onMessage)
  window.removeEventListener('keydown',onKey)
  for(const url of temporaryUrls)URL.revokeObjectURL(url)
})
</script>
<template>
<div class="public-gallery">
  <header class="public-gallery-nav">
    <div class="public-gallery-shell nav-content">
      <a href="/" class="public-gallery-brand" aria-label="Voltar ao site IEEE RAS UFRB">
        <img class="gallery-brand-logo" src="/ieee-ras-official.png" alt="IEEE RAS" />
        <span><strong>IEEE RAS UFRB</strong><small>Galeria de fotos</small></span>
      </a>
      <nav aria-label="Navegação da Galeria">
        <button type="button" :aria-pressed="view==='todas'&&!albumId" @click="albumId=null;view='todas'">Todas as fotos</button>
        <button type="button" :aria-pressed="view==='albuns'&&!albumId" @click="albumId=null;view='albuns'">Álbuns</button>
        <a href="/">Voltar ao site ↗</a>
      </nav>
    </div>
  </header>
  <main class="public-gallery-shell">
    <aside v-if="isPreview" class="preview-info">PRÉVIA AUTORIZADA — alterações não publicadas</aside>
    <template v-if="!albumId">
      <section class="gallery-landing">
        <div class="gallery-copy">
          <span class="overline">IEEE ROBOTICS & AUTOMATION SOCIETY · UFRB</span>
          <h1>Momentos que<br><em>contam histórias.</em></h1>
          <p>Competições, oficinas, encontros e experiências que construímos juntos com a robótica.</p>
          <span class="gallery-count"><b>{{ chosen.length }}</b> fotografias &nbsp; · &nbsp; <b>{{ albums.length }}</b> álbuns</span>
        </div>
        <div class="gallery-collage" aria-hidden="true">
          <img v-for="item in featured" :key="item.id" :src="item.src" alt="" />
        </div>
      </section>
      <div class="gallery-topline">
        <div><span class="overline">EXPLORE NOSSO ACERVO</span>
          <h2>{{ view==='albuns'?'Coleções e álbuns':'Todas as fotografias' }}</h2>
        </div>
        <span>{{ view==='albuns'?albums.length:chosen.length }} registros</span>
      </div>
      <div class="gallery-tabs">
        <button :class="{active:view==='todas'}" @click="view='todas'">Todas</button>
        <button :class="{active:view==='albuns'}" @click="view='albuns'">Álbuns</button>
      </div>
    </template>
    <template v-else>
      <button class="back-link" @click="goBack">← Todos os álbuns</button>
      <h1 class="album-title">{{ currentAlbum?.name }}</h1>
      <p class="album-description">{{ currentAlbum?.description }}</p>
    </template>
    <div v-if="loading" class="gallery-empty">Carregando fotografias...</div>
    <div v-else-if="error" class="gallery-empty">{{ error }} <button @click="loadGallery">Tentar novamente</button></div>
    <div v-else-if="view==='albuns' && !albumId" class="album-tiles">
      <button v-for="album in albums" :key="album.id" class="album-tile" @click="chooseAlbum(album.id)">
        <div class="album-cover">
          <img v-if="chosen.find(p=>p.id===album.coverId)?.src || chosen.find(p=>p.albumIds.includes(album.id))?.src"
            :src="chosen.find(p=>p.id===album.coverId && p.albumIds.includes(album.id))?.src || chosen.find(p=>p.albumIds.includes(album.id))?.src" :alt="'Capa '+album.name" />
        </div>
        <div><strong>{{ album.name }}</strong><small>{{ album.description }}</small><span>Explorar álbum ↗</span></div>
      </button>
    </div>
    <div v-else-if="displayed.length" class="photo-wall">
      <button v-for="(photo,index) in displayed" :key="photo.id" :aria-label="'Abrir fotografia '+(index+1)"
        class="photo-tile" @click="openPhoto(index)"><img :src="photo.src" :alt="photo.alt" loading="lazy"/></button>
    </div>
    <div v-else class="gallery-empty">Ainda não há fotografias públicas nesta seleção.</div>
  </main>
  <footer class="public-gallery-footer">
    <div class="public-gallery-shell">IEEE RAS UFRB · Memórias, projetos, eventos e robótica.
      <a href="/">Voltar ao site institucional →</a>
    </div>
  </footer>
  <div v-if="showing" class="gallery-modal" role="dialog" aria-modal="true" aria-label="Visualizar fotografia" @click.self="closePhoto">
    <div class="gallery-modal-top"><span>{{ (selected??0)+1 }} / {{ displayed.length }}</span><button aria-label="Fechar" @click="closePhoto">×</button></div>
    <button v-if="displayed.length>1" class="prev" aria-label="Anterior" @click="shift(-1)">‹</button>
    <img :src="showing.src" :alt="showing.alt"/>
    <button v-if="displayed.length>1" class="next" aria-label="Próxima" @click="shift(1)">›</button>
  </div>
</div>
</template>
<style scoped>
.public-gallery{min-height:100vh;background:#fcf9fb;color:#291c2d}
.public-gallery-shell{width:min(1450px,calc(100% - 54px));margin:auto}
.public-gallery-nav{background:#fff;border-bottom:1px solid #eee4ea}
.nav-content{display:flex;align-items:center;justify-content:space-between;gap:15px;min-height:83px}
.public-gallery-brand{display:flex;align-items:center;gap:14px;text-decoration:none;color:#2b2131}
.gallery-brand-logo {
  display: block;
  width: 54px;
  height: 54px;
  object-fit: contain;
  flex-shrink: 0;
  margin-right: 25px;
  transform: scale(2);
  transform-origin: center;
}
.public-gallery-brand span{display:grid;gap:3px}
.public-gallery-brand strong{font-weight:900;font-size:13px}.public-gallery-brand small{color:#817481;font-size:10px}
.public-gallery-nav nav{display:flex;align-items:center;gap:8px}
.public-gallery-nav nav button,.public-gallery-nav nav a{font:inherit;font-size:12px;border:0;background:none;color:#4c3d50;border-radius:9px;cursor:pointer;padding:12px;text-decoration:none}
.public-gallery-nav nav button[aria-pressed=true],.public-gallery-nav nav button:hover,.public-gallery-nav nav a:hover{background:#f8edf2;color:#a31b4c}
.public-gallery-nav nav a[href="/"]{display:inline-flex;align-items:center;justify-content:center;background:#c9003d;color:#fff;border:1px solid #c9003d;font-weight:800;font-size:14px;padding:12px 19px;border-radius:10px}
.public-gallery-nav nav a[href="/"]:hover{background:#a90034;color:#fff;border-color:#a90034}
.gallery-landing{display:grid;grid-template-columns:1.3fr 1fr;align-items:center;gap:54px;padding:72px 0 74px}
.gallery-copy h1{font-weight:950;letter-spacing:-.065em;font-size:clamp(45px,6vw,90px);line-height:1.02;margin:19px 0 22px}
.gallery-copy h1 em{font-style:normal;color:#a52059}
.gallery-copy p{line-height:1.75;max-width:600px;color:#766d79}
.overline{font-size:11px;color:#a01d50;letter-spacing:.14em;font-weight:850}
.gallery-count{display:block;margin-top:30px;font-size:12px;color:#87798a}
.gallery-count b{font-size:17px;color:#3d2442}
.gallery-collage{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:145px 145px;gap:12px;transform:rotate(-2deg)}
.gallery-collage img{width:100%;height:100%;object-fit:contain;background:#f0eaf1;border-radius:15px;border:1px solid #e5dbe4}
.gallery-collage img:first-child{grid-row:span 2}
.gallery-topline{display:flex;justify-content:space-between;border-top:1px solid #ece2e9;padding-top:20px;align-items:end}
.gallery-topline h2{margin:9px 0;font-size:clamp(24px,3vw,43px);letter-spacing:-.05em}
.gallery-topline>span{font-size:12px;color:#7c707d}
.gallery-tabs{display:flex;gap:8px;margin:24px 0}
.gallery-tabs button,.back-link{padding:12px 18px;border:1px solid #e4d7e0;background:#fff;color:#553f55;border-radius:9px;cursor:pointer;font-weight:750}
.gallery-tabs button.active{background:#a51747;color:#fff;border-color:#a51747}
.photo-wall{columns:4;column-gap:16px;margin-bottom:75px}
.photo-tile{display:block;width:100%;break-inside:avoid;padding:0;margin:0 0 16px;border:1px solid #eadfe7;background:#f3edf3;border-radius:12px;overflow:hidden;cursor:pointer}
.photo-tile img{width:100%;height:auto;display:block;object-fit:contain}
.photo-tile:hover{box-shadow:0 14px 24px #30182d18}
.album-tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;margin:0 0 75px}
.album-tile{padding:0;border:1px solid #eee2e8;text-align:left;background:#fff;border-radius:15px;overflow:hidden;cursor:pointer}
.album-cover{height:210px;background:#f4edf1;display:grid;place-items:center}
.album-cover img{width:100%;height:100%;object-fit:contain}
.album-tile>div:last-child{display:grid;padding:19px;gap:12px}
.album-tile strong{font-size:18px}.album-tile small{color:#8b7788;font-size:12px}.album-tile span{color:#a52059;font-size:12px;font-weight:800}
.back-link{margin:35px 0 18px}.album-title{font-size:clamp(32px,5vw,65px);margin:0;letter-spacing:-.055em}
.album-description{color:#817581;margin:13px 0 35px}
.gallery-empty{padding:75px 16px;text-align:center;color:#8c7c88}
.gallery-empty button{display:inline-block;margin-left:15px}
.preview-info{background:#35192e;color:#fff;padding:13px;margin-top:20px;border-radius:9px;text-align:center;font-size:12px;font-weight:850}
.public-gallery-footer{border-top:1px solid #e7dce4;padding:27px 0;color:#806f82;font-size:12px}
.public-gallery-footer>div{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
.public-gallery-footer a{color:#a01c50}
.gallery-modal{position:fixed;inset:0;background:#180e1bef;z-index:9000;display:flex;align-items:center;justify-content:center;padding:65px 74px}
.gallery-modal img{max-height:calc(100dvh - 115px);max-width:100%;object-fit:contain}
.gallery-modal button{color:#fff;background:#ffffff1a;border:1px solid #ffffff33;border-radius:50%;font-size:28px;cursor:pointer;width:48px;height:48px}
.gallery-modal .prev,.gallery-modal .next{position:absolute;top:50%}
.gallery-modal .prev{left:15px}.gallery-modal .next{right:15px}
.gallery-modal-top{position:absolute;top:13px;right:22px;display:flex;align-items:center;gap:15px;color:white;font-size:12px}
@media(max-width:980px){.photo-wall{columns:3}.gallery-landing{grid-template-columns:1fr .8fr}.album-tiles{grid-template-columns:repeat(2,1fr)}}
@media(max-width:700px){.public-gallery-shell{width:calc(100% - 28px)}.nav-content{flex-wrap:wrap;padding:12px 0}.public-gallery-nav nav{gap:0}.public-gallery-nav nav button,.public-gallery-nav nav a{padding:8px;font-size:11px}.gallery-landing{grid-template-columns:1fr;padding:48px 0}.gallery-collage{display:none}.photo-wall{columns:2;column-gap:9px}.photo-tile{margin-bottom:9px}.album-tiles{grid-template-columns:1fr}.gallery-modal{padding:55px 9px 75px}.gallery-modal .prev,.gallery-modal .next{top:auto;bottom:14px}}
</style>
